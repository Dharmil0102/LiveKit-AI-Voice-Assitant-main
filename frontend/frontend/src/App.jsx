import { useState } from 'react'
import './App.css'
import LiveKitModal from './components/LiveKitModal';
import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import SimpleVoiceAssistant from './components/SimpleVoiceAssistant';

function App() {
  const [showSupport, setShowSupport] = useState(false);
  const [token, setToken] = useState(null);

  return (
    <div className="app">
      <header className="header">
        <div className="logo">QeApps</div>
        <button className="support-button" onClick={() => setShowSupport(true)}>
          Connect
        </button>
      </header>
      
      <main>
        {token ? (
          <LiveKitRoom
            serverUrl={import.meta.env.VITE_LIVEKIT_URL}
            token={token}
            connect={true}
            video={false}
            audio={true}
            onDisconnected={() => setToken(null)}
          >
            <RoomAudioRenderer />
            <SimpleVoiceAssistant />
          </LiveKitRoom>
        ) : (
          <section className="hero">
            <h1>Welcome To QeApps VoiceAI</h1>
          </section>
        )}
      </main>

      {showSupport && (
        <LiveKitModal
          setShowSupport={setShowSupport}
          onTokenReceived={(token) => setToken(token)}
        />
      )}
    </div>
  )
}

export default App