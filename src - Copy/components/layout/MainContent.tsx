import { useState } from 'react';
import Hero from '../features/Hero';
import PlaylistGrid from '../features/PlaylistGrid';
import RecentlyPlayed from '../features/RecentlyPlayed';

interface MainContentProps {
  setCurrentTrack: (track: any) => void;
}

const MainContent = ({ setCurrentTrack }: MainContentProps) => {
  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-spotify-gray via-spotify-dark-gray to-spotify-black">
      <Hero />
      <div className="px-8 pb-8 space-y-8">
        <RecentlyPlayed setCurrentTrack={setCurrentTrack} />
        <PlaylistGrid title="Focus" />
        <PlaylistGrid title="Spotify Playlists" />
      </div>
    </div>
  );
};

export default MainContent;
