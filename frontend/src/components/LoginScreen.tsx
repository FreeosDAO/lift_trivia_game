import React, { useState } from 'react';
import { useInternetIdentity } from 'ic-use-internet-identity';
import { Shield, Clock, Users, Globe, Heart } from 'lucide-react';

function LoginScreen() {
  const { login, loginStatus } = useInternetIdentity();
  const [heartIsBlack, setHeartIsBlack] = useState(false);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        // Handle edge case where user is already authenticated
        window.location.reload();
      }
    }
  };

  const handleHeartDoubleClick = () => {
    setHeartIsBlack(true);
    // Note: Easter egg on login screen doesn't start game since user isn't authenticated
    // But we still change the heart to black for consistency
  };

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#121212', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '2rem',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Header with Logo - Above the card */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <img 
              src="https://wlnir-2iaaa-aaaal-ascwa-cai.icp0.io/assets/your-logo-07b5f3fa.png" 
              alt="Lift Cash Trivia" 
              style={{ height: '4rem', width: 'auto' }}
            />
          </div>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '800', 
            background: 'linear-gradient(135deg, #EB5528 0%, #ff6b35 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem',
            fontFamily: 'Montserrat, system-ui, sans-serif'
          }}>
            Lift Cash Trivia
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#b3b3b3' }}>Scheduled every 3 hours</p>
        </div>

        {/* Login Card */}
        <div style={{
          backgroundColor: '#1e1e1e',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              width: '5rem',
              height: '5rem',
              background: 'linear-gradient(135deg, #EB5528 0%, #d14820 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <Shield style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
            </div>
            <h2 style={{ 
              fontSize: '1.875rem', 
              fontWeight: '700', 
              color: '#ffffff', 
              marginBottom: '1rem',
              fontFamily: 'Montserrat, system-ui, sans-serif'
            }}>
              Welcome to Lift Cash Trivia
            </h2>
            <p style={{ 
              color: '#b3b3b3', 
              fontSize: '1.125rem', 
              lineHeight: '1.6'
            }}>
              Sign in securely with Internet Identity to join scheduled trivia rounds and compete with players worldwide.
            </p>
          </div>

          {/* Features */}
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              textAlign: 'left',
              padding: '1rem',
              backgroundColor: '#2a2a2a',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Clock style={{ width: '1.5rem', height: '1.5rem', color: '#fbbf24', marginRight: '0.75rem', flexShrink: 0 }} />
              <div>
                <h3 style={{ color: '#ffffff', fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem' }}>Scheduled Rounds</h3>
                <p style={{ color: '#808080', fontSize: '0.875rem', margin: 0 }}>New rounds every 3 hours</p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              textAlign: 'left',
              padding: '1rem',
              backgroundColor: '#2a2a2a',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Globe style={{ width: '1.5rem', height: '1.5rem', color: '#EB5528', marginRight: '0.75rem', flexShrink: 0 }} />
              <div>
                <h3 style={{ color: '#ffffff', fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem' }}>Multiple Languages</h3>
                <p style={{ color: '#808080', fontSize: '0.875rem', margin: 0 }}>Play in your preferred language</p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              textAlign: 'left',
              padding: '1rem',
              backgroundColor: '#2a2a2a',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Users style={{ width: '1.5rem', height: '1.5rem', color: '#10b981', marginRight: '0.75rem', flexShrink: 0 }} />
              <div>
                <h3 style={{ color: '#ffffff', fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem' }}>Multiplayer</h3>
                <p style={{ color: '#808080', fontSize: '0.875rem', margin: 0 }}>Compete with players worldwide</p>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            style={{
              width: '100%',
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              fontWeight: '600',
              background: isLoggingIn ? '#9CA3AF' : 'linear-gradient(135deg, #EB5528 0%, #d14820 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isLoggingIn ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          >
            {isLoggingIn ? (
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
                Signing In...
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Shield style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} />
                Sign In with Internet Identity
              </div>
            )}
          </button>

          <p style={{ 
            color: '#808080', 
            fontSize: '0.875rem', 
            marginTop: '1rem',
            margin: '1rem 0 0 0'
          }}>
            Secure, decentralized authentication powered by the Internet Computer
          </p>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#808080' }}>
          <p style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '0.875rem',
            margin: 0
          }}>
            © 2025. Built with{' '}
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
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
