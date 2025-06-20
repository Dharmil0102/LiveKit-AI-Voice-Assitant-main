import { useState, useCallback } from "react";
import "@livekit/components-styles";
import './LiveKitModal.css'; // Verify this path is correct

const LiveKitModal = ({ setShowSupport, onTokenReceived }) => {
  const [name, setName] = useState("");

  const getToken = useCallback(async (userName) => {
  try {
      const response = await fetch(
        `/api/getToken?name=${encodeURIComponent(userName)}`
      );
      const data = await response.json(); // ✅ correctly parse JSON
      console.log("Received token and room:", data);
      onTokenReceived(data.token); // ✅ pass only the token
      setShowSupport(false);
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  }, [onTokenReceived, setShowSupport]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      getToken(name);
    }
  };

  return (
    <div className="modal-overlay">
    <div className="modal-content">
    <form onSubmit={handleNameSubmit} className="name-form">
      <h2>Enter your name to connect</h2>
      <div className="input-group">
        <label htmlFor="name">Your Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
      <div className="button-group">
        <button type="submit" className="submit-button">
          Connect
        </button>
        <button
          type="button"
          className="cancel-button"
          onClick={() => setShowSupport(false)}
        >
          Cancel
        </button>
      </div>
      </form>
  </div>
</div>
  );
};

export default LiveKitModal;