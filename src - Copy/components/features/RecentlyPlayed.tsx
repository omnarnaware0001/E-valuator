import { Play } from 'lucide-react';

interface RecentlyPlayedProps {
  setCurrentTrack: (track: any) => void;
}

const RecentlyPlayed = ({ setCurrentTrack }: RecentlyPlayedProps) => {
  const recentTracks = [
    {
      title: 'Liked Songs',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
      color: 'from-purple-500',
    },
    {
      title: 'Today\'s Top Hits',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      color: 'from-blue-500',
    },
    {
      title: 'RapCaviar',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
      color: 'from-red-500',
    },
    {
      title: 'Rock Classics',
      image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop',
      color: 'from-orange-500',
    },
    {
      title: 'Chill Hits',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
      color: 'from-teal-500',
    },
    {
      title: 'All Out 2020s',
      image: 'https://images.unsplash.com/photo-1571974599782-87624638275e?w=300&h=300&fit=crop',
      color: 'from-pink-500',
    },
  ];

  const handlePlay = (track: any) => {
    setCurrentTrack({
      title: track.title,
      artist: 'Various Artists',
      album: track.title,
      image: track.image,
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentTracks.map((track) => (
          <div
            key={track.title}
            className="group bg-card hover:bg-card/60 rounded-md flex items-center gap-4 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]"
            onClick={() => handlePlay(track)}
          >
            <img
              src={track.image}
              alt={track.title}
              className="w-20 h-20 object-cover"
            />
            <div className="flex-1 font-semibold pr-4">{track.title}</div>
            <button
              className="play-button mr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              onClick={(e) => {
                e.stopPropagation();
                handlePlay(track);
              }}
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyPlayed;
