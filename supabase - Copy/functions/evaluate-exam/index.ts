import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { evaluationId, extractedText, answerKey, subject, gradeLevel } = await req.json();

    console.log('Evaluation request:', { evaluationId, subject, gradeLevel });

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get AI service credentials
    const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');
    const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');

    if (!baseUrl || !apiKey) {
      throw new Error('AI service not configured');
    }

    // Build evaluation prompt based on subject
    const systemPrompt = getSystemPromptForSubject(subject, gradeLevel);
    const evaluationPrompt = buildEvaluationPrompt(extractedText, answerKey, subject);

    console.log('Calling AI for evaluation...');

    // Call OnSpace AI for evaluation
    const aiResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: evaluationPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', errorText);
      throw new Error(`AI evaluation failed: ${errorText}`);
    }

    const aiResult = await aiResponse.json();
    const evaluationText = aiResult.choices[0].message.content;

    console.log('AI evaluation completed');

    // Parse the AI response to extract structured data
    const evaluationResults = parseEvaluationResults(evaluationText);

    // Update evaluation in database
    const { error: updateError } = await supabaseAdmin
      .from('evaluations')
      .update({
        status: 'completed',
        obtained_marks: evaluationResults.totalObtainedMarks,
        evaluation_results: evaluationResults,
      })
      .eq('id', evaluationId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ success: true, results: evaluationResults }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Evaluation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getSystemPromptForSubject(subject: string, gradeLevel: string): string {
  const basePrompt = `You are an expert ${subject} evaluator for ${gradeLevel} students. Evaluate the student's answers with precision and provide constructive feedback.`;

  const subjectSpecific: Record<string, string> = {
    'Mathematics': 'Focus on calculation accuracy, method correctness, step-by-step logic, and formula application. Check for computational errors and conceptual understanding.',
    'Physics': 'Evaluate understanding of physical concepts, formula application, unit consistency, diagram accuracy, and problem-solving approach.',
    'Chemistry': 'Assess chemical equations, nomenclature, reaction mechanisms, stoichiometry, and conceptual understanding.',
    'English': 'Evaluate grammar, vocabulary, coherence, factual accuracy, comprehension, and expression quality. Use paraphrasing detection.',
    'Science': 'Check factual accuracy, scientific terminology, concept understanding, and practical application.',
    'Hindi': 'Evaluate language proficiency, grammar, vocabulary, comprehension, and expression in Hindi.',
    'Marathi': 'Evaluate language proficiency, grammar, vocabulary, comprehension, and expression in Marathi.',
  };

  return `${basePrompt}\n\n${subjectSpecific[subject] || 'Evaluate based on factual accuracy, completeness, and clarity.'}`;
}

function buildEvaluationPrompt(extractedText: string, answerKey: any, subject: string): string {
  return `Please evaluate the following student answers against the answer key.

ANSWER KEY:
${JSON.stringify(answerKey, null, 2)}

STUDENT'S ANSWERS (OCR Extracted):
${extractedText}

Provide a detailed evaluation in the following JSON format:
{
  "questions": [
    {
      "questionNumber": 1,
      "maxMarks": 5,
      "obtainedMarks": 4.5,
      "feedback": "Detailed feedback here",
      "mistakes": ["List of specific mistakes"],
      "suggestions": ["How to improve"],
      "correctAnswer": "What the correct answer should be"
    }
  ],
  "totalObtainedMarks": 85.5,
  "overallRemarks": "General feedback about performance",
  "strengths": ["List of strengths"],
  "areasForImprovement": ["Areas to work on"]
}

Be precise, fair, and constructive in your evaluation.`;
}

function parseEvaluationResults(aiResponse: string): any {
  try {
    // Try to extract JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback: return the text as is
    return {
      rawResponse: aiResponse,
      totalObtainedMarks: 0,
      overallRemarks: aiResponse,
      questions: [],
    };
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return {
      rawResponse: aiResponse,
      totalObtainedMarks: 0,
      overallRemarks: aiResponse,
      questions: [],
    };
  }
}
