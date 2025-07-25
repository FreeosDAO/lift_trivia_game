import React, { useState, useEffect } from 'react';
import { useInternetIdentity } from 'ic-use-internet-identity';
import { useQueryClient } from '@tanstack/react-query';
import { Clock, Globe, LogOut, User, Copy, Check } from 'lucide-react';
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
  const [heartIsBlack, setHeartIsBlack] = useState(false);
  const [easterEggActivated, setEasterEggActivated] = useState(false);
  const [roundEndReset, setRoundEndReset] = useState(false);

  const { data: allPlayers } = useGetAllPlayers();
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
        // After successful mutation, invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['allPlayers'] });
        queryClient.invalidateQueries({ queryKey: ['player'] });
        queryClient.invalidateQueries({ queryKey: ['readyPlayers'] });
      } catch (error) {
        console.error('Error setting player ready:', error);
      }
    }
  };

  const handleLanguageChange = (langCode: string) => {
    if (!isReady) {
      setSelectedLanguage(langCode);
    }
  };

  const handleLogout = () => {
    clear();
  };

  const handleCopyPrincipal = async () => {
    const fullPrincipalId = identity?.getPrincipal().toString() || '';
    let textArea: HTMLTextAreaElement | null = null;
    try {
      textArea = document.createElement('textarea');
      textArea.value = fullPrincipalId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      setPrincipalCopied(true);
      setTimeout(() => setPrincipalCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy Principal ID:', err);
    } finally {
      if (textArea) {
        document.body.removeChild(textArea);
      }
    }
  };

  const handleCopyReadyPlayerPrincipal = async (principalId: string) => {
    let textArea: HTMLTextAreaElement | null = null;
    try {
      textArea = document.createElement('textarea');
      textArea.value = principalId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy Principal ID:', err);
    } finally {
      if (textArea) {
        document.body.removeChild(textArea);
      }
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
  const currentPrincipalId = identity?.getPrincipal().toString() || '';

  // Show trivia game if game has started
  if (gameStarted) {
    return <TriviaGame language={selectedLanguage} onGameEnd={handleGameEnd} />;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#121212', 
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header with Logo and User Info */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img 
            src="https://wlnir-2iaaa-aaaal-ascwa-cai.icp0.io/assets/your-logo-07b5f3fa.png" 
            alt="Lift Cash Trivia" 
            style={{ height: '3rem', width: 'auto' }}
          />
          <div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '800', 
              background: 'linear-gradient(135deg, #EB5528 0%, #ff6b35 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.25rem',
              fontFamily: 'Montserrat, system-ui, sans-serif'
            }}>
              Lift Cash Trivia
            </h1>
            <p style={{ fontSize: '1.125rem', color: '#b3b3b3', margin: 0 }}>Scheduled every 3 hours</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#1e1e1e',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <User style={{ width: '1.25rem', height: '1.25rem', color: '#EB5528', marginRight: '0.5rem' }} />
            <span style={{ color: '#ffffff', fontSize: '0.875rem', fontFamily: 'monospace' }}>
              {currentPrincipalId.slice(0, 8)}...
            </span>
            <button
              onClick={handleCopyPrincipal}
              style={{
                marginLeft: '0.5rem',
                padding: '0.25rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                color: principalCopied ? '#10b981' : '#808080',
                transition: 'color 0.3s ease'
              }}
              title="Copy full Principal ID"
            >
              {principalCopied ? (
                <Check style={{ width: '1rem', height: '1rem' }} />
              ) : (
                <Copy style={{ width: '1rem', height: '1rem' }} />
              )}
            </button>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            <LogOut style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        gap: '2rem',
        minHeight: 'calc(100vh - 200px)'
      }}>
        {/* Countdown Timer */}
        <div style={{
          backgroundColor: '#1e1e1e',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: '1.5rem' 
          }}>
            <Clock style={{ width: '2rem', height: '2rem', color: '#fbbf24', marginRight: '0.75rem' }} />
            <h2 style={{ 
              fontSize: '1.875rem', 
              fontWeight: '700', 
              color: '#ffffff', 
              margin: 0,
              fontFamily: 'Montserrat, system-ui, sans-serif'
            }}>
              Next Round Starts In
            </h2>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1rem', 
            marginBottom: '1rem' 
          }}>
            <div style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '16px',
              padding: '1rem',
              minWidth: '80px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ffffff' }}>
                {formatTime(timeDisplay.hours)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#b3b3b3', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Hours
              </div>
            </div>
            <div style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '16px',
              padding: '1rem',
              minWidth: '80px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ffffff' }}>
                {formatTime(timeDisplay.minutes)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#b3b3b3', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Minutes
              </div>
            </div>
            <div style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '16px',
              padding: '1rem',
              minWidth: '80px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ffffff' }}>
                {formatTime(timeDisplay.seconds)}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#b3b3b3', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Seconds
              </div>
            </div>
          </div>

          {timeDisplay.hours === 0 && timeDisplay.minutes < 5 && (
            <div style={{ color: '#fbbf24', fontWeight: '600', animation: 'pulse 2s infinite' }}>
              Round starting soon!
            </div>
          )}
        </div>

        {/* Language Selection */}
        <div style={{
          backgroundColor: '#1e1e1e',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
          maxWidth: '600px',
          width: '100%'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            marginBottom: '1rem' 
          }}>
            <Globe style={{ width: '1.5rem', height: '1.5rem', color: '#EB5528', marginRight: '0.5rem' }} />
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#ffffff',
              margin: 0,
              fontFamily: 'Montserrat, system-ui, sans-serif'
            }}>
              Select Language
            </h3>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '0.75rem' 
          }}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isReady}
                style={{
                  padding: '0.75rem',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  border: selectedLanguage === lang.code ? '2px solid #EB5528' : '1px solid rgba(255, 255, 255, 0.1)',
                  backgroundColor: selectedLanguage === lang.code ? '#EB5528' : '#2a2a2a',
                  color: selectedLanguage === lang.code ? 'white' : '#b3b3b3',
                  cursor: isReady ? 'not-allowed' : 'pointer',
                  opacity: isReady ? 0.5 : 1,
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{lang.flag}</div>
                <div>{lang.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Ready Button */}
        <div style={{ textAlign: 'center' }}>
          {!isReady ? (
            <button
              onClick={handleReadyClick}
              disabled={setPlayerReadyMutation.isPending}
              style={{
                padding: '1rem 3rem',
                fontSize: '1.125rem',
                fontWeight: '600',
                background: setPlayerReadyMutation.isPending ? '#9CA3AF' : 'linear-gradient(135deg, #EB5528 0%, #d14820 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: setPlayerReadyMutation.isPending ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            >
              {setPlayerReadyMutation.isPending ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '0.5rem'
                  }}></div>
                  Joining...
                </div>
              ) : (
                'Ready for Next Round'
              )}
            </button>
          ) : (
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              textAlign: 'center'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '0.5rem' 
              }}>
                <div style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.5rem'
                }}>
                  <div style={{
                    width: '0.75rem',
                    height: '0.75rem',
                    backgroundColor: '#10b981',
                    borderRadius: '50%'
                  }}></div>
                </div>
                <span style={{ color: '#6ee7b7', fontWeight: '700', fontSize: '1.25rem' }}>Ready!</span>
              </div>
              <p style={{ color: '#6ee7b7', fontWeight: '500', margin: '0.5rem 0' }}>
                ✓ You're queued for the next round in {selectedLang?.name} ({selectedLang?.flag})
              </p>
              <p style={{ color: '#34d399', fontSize: '0.875rem', margin: 0 }}>
                You'll automatically join when the countdown reaches zero!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '1.5rem', color: '#808080' }}>
        <p style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: 0,
          fontSize: '0.875rem'
        }}>
          © 2025. Started with{' '}
          <span 
            style={{ margin: '0 0.25rem', cursor: 'pointer', userSelect: 'none' }}
            onDoubleClick={handleHeartDoubleClick}
            title="Double-click for a surprise!"
          >
            {heartIsBlack ? '🖤' : '❤️'}
          </span>
          {' '}using{' '}
          <a 
            href="https://caffeine.ai" 
            style={{ 
              marginLeft: '0.25rem', 
              color: '#EB5528', 
              textDecoration: 'none',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => (e.target as HTMLElement).style.color = '#ff6b35'}
            onMouseOut={(e) => (e.target as HTMLElement).style.color = '#EB5528'}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

export default Lobby;