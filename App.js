import React, { useState } from "react";
import InsightsChart from "./InsightsChart";

function App() {
  const [identifier, setIdentifier] = useState("");
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const validateInput = (input) => {
    const regex = /^[a-zA-Z0-9-_]{1,30}$/;
    return regex.test(input);
  };

  const handleFetch = async () => {
    setErrorMsg(null);
    if (!validateInput(identifier)) {
      setErrorMsg(
        "Invalid input: Only letters, numbers, dash, underscore allowed (max 30 chars)."
      );
      return;
    }
    setLoading(true);
    const API_BASE = process.env.REACT_APP_API_BASE_URL;
    const url = `${API_BASE}/insight?identifier=${encodeURIComponent(identifier)}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Server failed to respond");
      const json = await res.json();
      if (json.error) {
        setErrorMsg(json.error);
        setInsights(null);
      } else {
        setInsights(json.data);
      }
    } catch (err) {
      setErrorMsg("Network or server error. Please try again.");
      setInsights(null);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "auto",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>AKS – Intelligent Insights Dashboard</h2>
      <label htmlFor="identifierInput" style={{ display: "block", marginBottom: 8 }}>
        Enter Identifier:
      </label>
      <input
        id="identifierInput"
        type="text"
        aria-label="Identifier input"
        placeholder="e.g. item_123"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        style={{ width: "70%", padding: 10, fontSize: 16 }}
        maxLength={30}
      />
      <button
        onClick={handleFetch}
        disabled={loading || !identifier}
        style={{
          padding: "10px 16px",
          marginLeft: 12,
          fontSize: 16,
          cursor: loading ? "not-allowed" : "pointer",
        }}
        aria-disabled={loading || !identifier}
      >
        {loading ? "Loading..." : "Get Insight"}
      </button>

      {errorMsg && (
        <div role="alert" style={{ color: "red", marginTop: 16 }}>
          {errorMsg}
        </div>
      )}

      {insights && !errorMsg && (
        <div style={{ marginTop: 32 }}>
          <InsightsChart data={insights} />
        </div>
      )}
    </div>
  );
}

export default App;
