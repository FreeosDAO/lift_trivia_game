import React, { useState, useEffect } from 'react';
import { useInternetIdentity } from 'ic-use-internet-identity';
import { useQueryClient } from '@tanstack/react-query';
import { Clock, Users, Globe, Heart, LogOut, User, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useGetAllPlayers, useSetPlayerReady, useGetReadyPlayers, useGetPlayer } from '../hooks/useQueries';
import TriviaGame from './TriviaGame';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

interface TimeDisplay {
  hours: number;
  minutes: number;
  seconds: number;
}

function Lobby() {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [gameStarted, setGameStarted] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState<TimeDisplay>({ hours: 0, minutes: 0, seconds: 0 });
  const [principalCopied, setPrincipalCopied] = useState(false);
  const [showReadyPlayers, setShowReadyPlayers] = useState(false);
  const [heartIsBlack, setHeartIsBlack] = useState(false);
  const [easterEggActivated, setEasterEggActivated] = useState(false);
  const [roundEndReset, setRoundEndReset] = useState(false);

  const { data: allPlayers } = useGetAllPlayers();
  const { data: readyPlayers } = useGetReadyPlayers();
  const currentPrincipal = identity?.getPrincipal();
  const { data: currentPlayer } = useGetPlayer(currentPrincipal);
  const setPlayerReadyMutation = useSetPlayerReady();

  // Check if current user is ready based on backend data, but respect round end reset
  const isReady = !roundEndReset && (currentPlayer?.ready || false);

  // Update selected language from backend data if user is ready
  useEffect(() => {
    if (currentPlayer && currentPlayer.ready && !roundEndReset) {
      setSelectedLanguage(currentPlayer.language);
    }
  }, [currentPlayer, roundEndReset]);

  // Calculate next round time (every 3 hours)
  const getNextRoundTime = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const nextRoundHour = Math.ceil((currentHour + 1) / 3) * 3;
    const nextRound = new Date(now);
    nextRound.setHours(nextRoundHour, 0, 0, 0);
    
    if (nextRound <= now) {
      nextRound.setDate(nextRound.getDate() + 1);
      nextRound.setHours(0, 0, 0, 0);
    }
    
    return nextRound;
  };

  // Update countdown every second
  useEffect(() => {
    const updateCountdown = () => {
      // If easter egg was activated, start the game immediately
      if (easterEggActivated && isReady) {
        setGameStarted(true);
        return;
      }

      const nextRound = getNextRoundTime();
      const now = new Date();
      const timeRemaining = Math.max(0, nextRound.getTime() - now.getTime());
      
      if (timeRemaining === 0 && isReady) {
        setGameStarted(true);
      }

      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      setTimeDisplay({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [isReady, easterEggActivated]);

  const handleReadyClick = async () => {
    if (!isReady && identity) {
      try {
        // Set player as ready with selected language
        await setPlayerReadyMutation.mutateAsync({ language: selectedLanguage });
        // Clear the round end reset flag once player successfully joins
        setRoundEndReset(false);
      } catch (error) {
        console.error('Failed to set player ready:', error);
      }
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    if (!isReady) {
      setSelectedLanguage(newLanguage);
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleCopyPrincipal = () => {
    if (!identity) return;
    
    const principalId = identity.getPrincipal().toString();
    
    // Reset previous state
    setPrincipalCopied(false);
    
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(principalId)
        .then(() => {
          setPrincipalCopied(true);
          setTimeout(() => setPrincipalCopied(false), 2000);
        })
        .catch(() => {
          // Fallback to textarea method
          copyWithTextarea(principalId);
        });
    } else {
      // Use textarea fallback for older browsers or non-secure contexts
      copyWithTextarea(principalId);
    }
  };

  const copyWithTextarea = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setPrincipalCopied(true);
        setTimeout(() => setPrincipalCopied(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy principal ID:', error);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handleCopyReadyPlayerPrincipal = (principalId: string) => {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(principalId)
        .then(() => {
          // Could add individual copy feedback here if needed
        })
        .catch(() => {
          // Fallback to textarea method
          copyReadyPlayerWithTextarea(principalId);
        });
    } else {
      // Use textarea fallback for older browsers or non-secure contexts
      copyReadyPlayerWithTextarea(principalId);
    }
  };

  const copyReadyPlayerWithTextarea = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
    } catch (error) {
      console.error('Failed to copy ready player principal ID:', error);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handleHeartDoubleClick = () => {
    setHeartIsBlack(true);
    setEasterEggActivated(true);
  };

  const handleGameEnd = async () => {
    // When game ends, return to lobby
    setGameStarted(false);
    setEasterEggActivated(false);
    setHeartIsBlack(false);
    
    // Set the round end reset flag to simulate cleared readiness status
    setRoundEndReset(true);
    
    // Force refresh of player data to reflect any backend changes
    queryClient.invalidateQueries({ queryKey: ['allPlayers'] });
    queryClient.invalidateQueries({ queryKey: ['player'] });
    queryClient.invalidateQueries({ queryKey: ['readyPlayers'] });
    
    // Reset local state - user will need to select language and ready up again
    setSelectedLanguage('en');
  };

  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  const selectedLang = LANGUAGES.find(lang => lang.code === selectedLanguage);
  const readyPlayersCount = readyPlayers?.length || 0;
  const currentPrincipalId = identity?.getPrincipal().toString() || '';

  // Show trivia game if game has started
  if (gameStarted) {
    return <TriviaGame language={selectedLanguage} onGameEnd={handleGameEnd} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Logo and User Info */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 gap-4">
        <div className="flex items-center gap-4">
          <img 
            src="https://wlnir-2iaaa-aaaal-ascwa-cai.icp0.io/assets/your-logo-07b5f3fa.png" 
            alt="Lift Cash Trivia" 
            className="h-12 w-auto"
          />
          <div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">Lift Cash Trivia</h1>
            <p className="text-xl text-secondary">Scheduled every 3 hours</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center card px-4 py-2">
            <User className="w-5 h-5 text-accent mr-2" />
            <span className="text-primary text-sm font-mono">
              {currentPrincipalId.slice(0, 8)}...
            </span>
            <button
              onClick={handleCopyPrincipal}
              className="ml-2 p-1 hover:bg-tertiary rounded transition-colors"
              title="Copy full Principal ID"
            >
              {principalCopied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-muted hover:text-primary" />
              )}
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-4 py-2 rounded-lg transition-colors border border-red-500/30"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          {/* Countdown Timer */}
          <div className="card p-8 mb-8 text-center hover-lift">
            <div className="flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-yellow-400 mr-3" />
              <h2 className="text-2xl font-semibold text-primary">Next Round Starts In</h2>
            </div>
            
            <div className="flex justify-center space-x-4 mb-6">
              <div className="bg-tertiary rounded-2xl p-4 min-w-[80px] border border-default">
                <div className="text-4xl font-bold text-primary">{formatTime(timeDisplay.hours)}</div>
                <div className="text-sm text-secondary uppercase tracking-wide">Hours</div>
              </div>
              <div className="bg-tertiary rounded-2xl p-4 min-w-[80px] border border-default">
                <div className="text-4xl font-bold text-primary">{formatTime(timeDisplay.minutes)}</div>
                <div className="text-sm text-secondary uppercase tracking-wide">Minutes</div>
              </div>
              <div className="bg-tertiary rounded-2xl p-4 min-w-[80px] border border-default">
                <div className="text-4xl font-bold text-primary">{formatTime(timeDisplay.seconds)}</div>
                <div className="text-sm text-secondary uppercase tracking-wide">Seconds</div>
              </div>
            </div>

            {timeDisplay.hours === 0 && timeDisplay.minutes < 5 && (
              <div className="text-yellow-400 font-semibold animate-pulse">
                Round starting soon!
              </div>
            )}
          </div>

          {/* Language Selection */}
          <div className="card p-6 mb-8 hover-lift">
            <div className="flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-accent mr-2" />
              <h3 className="text-xl font-semibold text-primary">
                {isReady ? 'Selected Language (Locked)' : 'Select Language'}
              </h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  disabled={isReady}
                  className={`p-3 rounded-xl transition-all duration-200 border ${
                    selectedLanguage === lang.code
                      ? 'bg-accent text-white shadow-lg scale-105 border-accent'
                      : 'bg-tertiary text-secondary hover:bg-secondary hover:text-primary border-default hover:border-hover'
                  } ${isReady ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="text-2xl mb-1">{lang.flag}</div>
                  <div className="text-sm font-medium">{lang.name}</div>
                </button>
              ))}
            </div>
            
            {isReady && (
              <div className="mt-4 p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                <p className="text-blue-300 text-sm text-center">
                  🔒 Language locked for current round. You can change it after the round ends.
                </p>
              </div>
            )}
          </div>

          {/* Ready Button or Status */}
          <div className="text-center mb-8">
            {!isReady ? (
              <button
                onClick={handleReadyClick}
                disabled={setPlayerReadyMutation.isPending}
                className={`btn btn-primary px-12 py-4 text-xl font-bold ${
                  setPlayerReadyMutation.isPending ? 'opacity-50' : ''
                }`}
              >
                {setPlayerReadyMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                    Joining...
                  </div>
                ) : (
                  'Ready for Next Round'
                )}
              </button>
            ) : (
              <div className="p-4 bg-green-500/20 rounded-xl border border-green-500/30">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-green-300 font-bold text-xl">Ready!</span>
                </div>
                <p className="text-green-300 font-medium">
                  ✓ You're queued for the next round in {selectedLang?.name} ({selectedLang?.flag})
                </p>
                <p className="text-green-400 text-sm mt-1">
                  You'll automatically join when the countdown reaches zero!
                </p>
              </div>
            )}

            {principalCopied && (
              <div className="mt-4 p-3 bg-green-500/20 rounded-xl border border-green-500/30">
                <p className="text-green-300 text-sm">
                  ✓ Principal ID copied to clipboard!
                </p>
              </div>
            )}
          </div>

          {/* Players Count - Expandable */}
          {readyPlayersCount > 0 && (
            <div className="card hover-lift">
              <button
                onClick={() => setShowReadyPlayers(!showReadyPlayers)}
                className="w-full p-4 text-center flex items-center justify-between hover:bg-tertiary transition-colors rounded-2xl"
              >
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-accent mr-2" />
                  <span className="text-primary font-medium">
                    {readyPlayersCount} player{readyPlayersCount !== 1 ? 's' : ''} ready for next round
                  </span>
                </div>
                {showReadyPlayers ? (
                  <ChevronUp className="w-5 h-5 text-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted" />
                )}
              </button>
              
              {showReadyPlayers && (
                <div className="border-t border-default p-4">
                  <h4 className="text-primary font-semibold mb-3 text-center">Ready Players</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {readyPlayers?.map((player, index) => (
                      <div
                        key={player.principalId}
                        className="flex items-center justify-between p-3 bg-tertiary rounded-lg border border-default"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-primary font-mono text-sm">
                              {player.principalId.slice(0, 12)}...
                            </div>
                            <div className="text-muted text-xs">
                              {LANGUAGES.find(l => l.code === player.language)?.name} {LANGUAGES.find(l => l.code === player.language)?.flag}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCopyReadyPlayerPrincipal(player.principalId)}
                          className="p-2 hover:bg-secondary rounded transition-colors"
                          title="Copy Principal ID"
                        >
                          <Copy className="w-4 h-4 text-muted hover:text-primary" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-muted">
        <p className="flex items-center justify-center">
          © 2025. Built with{' '}
          <span 
            className="mx-1 cursor-pointer select-none"
            onDoubleClick={handleHeartDoubleClick}
            title="Double-click for a surprise!"
          >
            {heartIsBlack ? '🖤' : '❤️'}
          </span>
          {' '}using{' '}
          <a href="https://caffeine.ai" className="ml-1 text-accent hover:text-orange-400 transition-colors">
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

export default Lobby;
