import { Play } from 'lucide-react';

interface MusicCardProps {
  title: string;
  description: string;
  image: string;
}

const MusicCard = ({ title, description, image }: MusicCardProps) => {
  return (
    <div className="music-card group relative">
      <div className="relative mb-4 aspect-square">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-md shadow-lg"
        />
        <button className="play-button absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <Play className="w-5 h-5 fill-current" />
        </button>
      </div>
      <h3 className="font-semibold mb-1 truncate">{title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
    </div>
  );
};

export default MusicCard;
