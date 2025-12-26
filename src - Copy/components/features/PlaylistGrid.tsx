import MusicCard from './MusicCard';

interface PlaylistGridProps {
  title: string;
}

const PlaylistGrid = ({ title }: PlaylistGridProps) => {
  const playlists = [
    {
      title: 'Peaceful Piano',
      description: 'Relax and indulge with beautiful piano pieces',
      image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&h=300&fit=crop',
    },
    {
      title: 'Deep Focus',
      description: 'Keep calm and focus with ambient and post-rock music',
      image: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop',
    },
    {
      title: 'Instrumental Study',
      description: 'Focus with soft study music in the background',
      image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=300&fit=crop',
    },
    {
      title: 'Jazz Vibes',
      description: 'The original chill instrumental beats playlist',
      image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop',
    },
    {
      title: 'Focus Flow',
      description: 'Uptempo instrumental hip hop beats',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors font-semibold">
          Show all
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {playlists.map((playlist) => (
          <MusicCard
            key={playlist.title}
            title={playlist.title}
            description={playlist.description}
            image={playlist.image}
          />
        ))}
      </div>
    </div>
  );
};

export default PlaylistGrid;
