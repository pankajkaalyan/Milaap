import React, { useState, useRef, useEffect, useCallback } from 'react';
import AdPlayer from './AdPlayer';
import PlayIcon from '../icons/PlayIcon';
import PauseIcon from '../icons/PauseIcon';
import VolumeUpIcon from '../icons/VolumeUpIcon';
import VolumeOffIcon from '../icons/VolumeOffIcon';
import FullscreenEnterIcon from '../icons/FullscreenEnterIcon';
import FullscreenExitIcon from '../icons/FullscreenExitIcon';
import { MediaPlayerType, AdState } from '../../types';

interface MediaPlayerProps {
  src: string;
  type: MediaPlayerType;
  poster?: string;
  showAd?: boolean;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ src, type, poster, showAd = true }) => {
  const [adState, setAdState] = useState<AdState>(showAd ? AdState.PLAYING : AdState.FINISHED);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  let controlsTimeout = useRef<number | null>(null);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (mediaRef.current) {
      if (isPlaying) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setProgress(mediaRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
    }
  };
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(mediaRef.current) {
          const newTime = Number(e.target.value);
          mediaRef.current.currentTime = newTime;
          setProgress(newTime);
      }
  }

  const toggleMute = () => {
      if(mediaRef.current) {
          mediaRef.current.muted = !isMuted;
          setIsMuted(!isMuted);
      }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(mediaRef.current) {
          const newVolume = Number(e.target.value);
          mediaRef.current.volume = newVolume;
          setVolume(newVolume);
          setIsMuted(newVolume === 0);
      }
  }

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
        setIsFullscreen(true);
    } else {
        document.exitFullscreen();
        setIsFullscreen(false);
    }
  }, []);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    controlsTimeout.current = window.setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    const container = containerRef.current;

    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    if (container && type === MediaPlayerType.VIDEO) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', () => {
          if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
          setShowControls(false)
      });
    }

    return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        if (container && type === MediaPlayerType.VIDEO) {
            container.removeEventListener('mousemove', handleMouseMove);
        }
    }
  }, [type]);

  useEffect(() => {
      const media = mediaRef.current;
      if (media) {
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        media.addEventListener('play', onPlay);
        media.addEventListener('pause', onPause);
        return () => {
            media.removeEventListener('play', onPlay);
            media.removeEventListener('pause', onPause);
        }
      }
  }, []);


  const MediaComponent = type === MediaPlayerType.VIDEO ? 'video' : 'audio';

  return (
    <div ref={containerRef} className={`relative ${type === MediaPlayerType.VIDEO ? 'w-full aspect-video' : 'w-full'} bg-black rounded-lg overflow-hidden group`}>
        {adState === AdState.PLAYING && (
            <AdPlayer onAdComplete={() => {
                setAdState(AdState.FINISHED);
                setIsPlaying(true);
                mediaRef.current?.play();
            }} />
        )}

        <MediaComponent
            ref={mediaRef as any}
            src={src}
            poster={poster}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            hidden={adState === AdState.PLAYING}
        />

        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity duration-300 ${ (showControls || type === MediaPlayerType.AUDIO || !isPlaying) ? 'opacity-100' : 'opacity-0'}`}>
            {/* Progress Bar */}
            <input
                type="range"
                min="0"
                max={duration}
                value={progress}
                onChange={handleProgressChange}
                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex items-center justify-between mt-1 text-white text-xs">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3">
                    <button onClick={togglePlay} className="text-white">
                        {isPlaying ? <PauseIcon className="w-8 h-8"/> : <PlayIcon className="w-8 h-8"/>}
                    </button>
                    <div className="flex items-center gap-2 group/volume">
                         <button onClick={toggleMute} className="text-white">
                            {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-0 group-hover/volume:w-20 transition-all duration-300 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider-thumb"
                        />
                    </div>
                </div>

                {type === MediaPlayerType.VIDEO && (
                     <button onClick={toggleFullscreen} className="text-white">
                        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
                    </button>
                )}
            </div>
        </div>
        <style>{`
            .slider-thumb::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 12px;
                height: 12px;
                background: #F59E0B; /* amber-500 */
                border-radius: 50%;
                cursor: pointer;
            }
        `}</style>
    </div>
  );
};

export default MediaPlayer;