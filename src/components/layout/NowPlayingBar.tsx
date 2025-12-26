import { Heart, Shuffle, SkipBack, Play, SkipForward, Repeat, Mic2, ListMusic, Volume2 } from 'lucide-react';
import { Slider } from '../ui/slider';

interface NowPlayingBarProps {
  currentTrack: {
    title: string;
    artist: string;
    album: string;
    image: string;
  };
}

const NowPlayingBar = ({ currentTrack }: NowPlayingBarProps) => {
  return (
    <div className="h-24 bg-spotify-dark-gray border-t border-border px-4 flex items-center justify-between">
      {/* Current Track Info */}
      <div className="flex items-center gap-4 w-80">
        <img
          src={currentTrack.image}
          alt={currentTrack.album}
          className="w-14 h-14 rounded-md"
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold truncate">{currentTrack.title}</div>
          <div className="text-xs text-muted-foreground truncate">{currentTrack.artist}</div>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Heart className="w-5 h-5" />
        </button>
      </div>

      {/* Player Controls */}
      <div className="flex-1 max-w-2xl">
        <div className="flex items-center justify-center gap-4 mb-2">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Shuffle className="w-4 h-4" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <SkipBack className="w-5 h-5" />
          </button>
          <button className="play-button">
            <Play className="w-5 h-5 fill-current" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <SkipForward className="w-5 h-5" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>1:23</span>
          <Slider defaultValue={[33]} max={100} step={1} className="flex-1" />
          <span>3:45</span>
        </div>
      </div>

      {/* Volume and Extra Controls */}
      <div className="flex items-center gap-4 w-80 justify-end">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Mic2 className="w-5 h-5" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <ListMusic className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-muted-foreground" />
          <Slider defaultValue={[70]} max={100} step={1} className="w-24" />
        </div>
      </div>
    </div>
  );
};

export default NowPlayingBar;
