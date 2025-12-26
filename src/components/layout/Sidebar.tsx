import { Home, Search, Library, PlusSquare, Heart } from 'lucide-react';

const Sidebar = () => {
  const playlists = [
    'Today\'s Top Hits',
    'RapCaviar',
    'All Out 2020s',
    'Rock Classics',
    'Chill Vibes',
    'Workout Beats',
  ];

  return (
    <div className="w-64 bg-spotify-black flex flex-col border-r border-border">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-spotify-black">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 14.5c-.2.3-.5.4-.8.4-.2 0-.3 0-.5-.1-2.4-1.4-5.4-1.7-9-.9-.4.1-.8-.2-.9-.6-.1-.4.2-.8.6-.9 4-.9 7.3-.5 10.1 1.1.4.2.5.7.5 1zm1.1-2.8c-.2.4-.7.5-1.1.3-2.7-1.7-6.8-2.1-10-1.2-.5.1-1-.2-1.1-.6-.1-.5.2-1 .6-1.1 3.7-1.1 8.2-.6 11.3 1.3.4.3.5.9.3 1.3zm.1-2.9c-3.2-1.9-8.5-2.1-11.6-1.2-.6.2-1.2-.2-1.4-.7-.2-.6.2-1.2.7-1.4 3.6-1.1 9.4-.8 13.1 1.3.5.3.7 1 .4 1.5-.3.5-1 .7-1.5.4-.1 0-.1 0 0 0z"/>
            </svg>
          </div>
          <span className="text-2xl font-bold">Spotify</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          <div className="sidebar-link active">
            <Home className="w-6 h-6" />
            <span className="font-semibold">Home</span>
          </div>
          <div className="sidebar-link">
            <Search className="w-6 h-6" />
            <span className="font-semibold">Search</span>
          </div>
          <div className="sidebar-link">
            <Library className="w-6 h-6" />
            <span className="font-semibold">Your Library</span>
          </div>
        </div>

        <div className="mt-6 space-y-1">
          <div className="sidebar-link">
            <PlusSquare className="w-6 h-6" />
            <span className="font-semibold">Create Playlist</span>
          </div>
          <div className="sidebar-link">
            <Heart className="w-6 h-6" />
            <span className="font-semibold">Liked Songs</span>
          </div>
        </div>

        {/* Playlists */}
        <div className="mt-6 px-6">
          <div className="h-px bg-border mb-4" />
          <div className="space-y-3">
            {playlists.map((playlist) => (
              <div
                key={playlist}
                className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                {playlist}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
