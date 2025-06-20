import {
  useVoiceAssistant,
  BarVisualizer,
  VoiceAssistantControlBar,
  useTrackTranscription,
  useLocalParticipant,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";
import "./SimpleVoiceAssistant.css";

const Message = ({ type, text }) => {
  return (
    <div className="message">
      <strong className={`message-${type}`}>
        {type === "agent" ? "Agent: " : "You: "}
      </strong>
      <span className="message-text">{text}</span>
    </div>
  );
};

const SimpleVoiceAssistant = () => {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();
  const localParticipant = useLocalParticipant();
  const { segments: userTranscriptions } = useTrackTranscription({
    publication: localParticipant.microphoneTrack,
    source: Track.Source.Microphone,
    participant: localParticipant.localParticipant,
  });

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const allMessages = [
      ...(agentTranscriptions?.map((t) => ({ ...t, type: "agent" })) ?? []),
      ...(userTranscriptions?.map((t) => ({ ...t, type: "user" })) ?? []),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime);
    setMessages(allMessages);
  }, [agentTranscriptions, userTranscriptions]);

  return (
    <div className="grid-layout">
    {/* Audio Section (75%) */}
    <div className="section">
      <h3>Audio</h3>
      <div className="visualizer-container">
        <BarVisualizer state={state} barCount={9} trackRef={audioTrack} />
      </div>
    </div>

    {/* Combined Chat + Controls (25%) */}
    <div className="section">
      <div className="chat-controls-container">
        <div className="chat-container">
          <h3>Chat</h3>
          <div className="conversation">
            {messages.map((msg, index) => (
              <Message key={msg.id || index} type={msg.type} text={msg.text} />
            ))}
          </div>
        </div>
        <div className="controls-container">
          <VoiceAssistantControlBar />
        </div>
      </div>
    </div>
  </div>
  );
};

export default SimpleVoiceAssistant;