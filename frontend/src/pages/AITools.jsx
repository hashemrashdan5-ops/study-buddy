import { useState } from "react";
import api from "../api/axios";

export default function AITools() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(5);
  const [summary, setSummary] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    setError("");
    setSummary("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/ai/summarize/", { text });
      setSummary(data.summary);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  const handleQuiz = async () => {
    setError("");
    setQuestions([]);
    setLoading(true);
    try {
      const { data } = await api.post("/api/ai/quiz/", { text, count });
      setQuestions(data.questions || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to generate quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>AI Tools</h2>

      <div className="card">
        <h3>Your text</h3>
        <textarea
          placeholder="Paste your study notes here (max 5000 chars)..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={5000}
        />
        <small>{text.length} / 5000 chars</small>

        <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={handleSummarize} disabled={loading || !text}>
            Summarize
          </button>
          <span>Questions:</span>
          <input
            type="number"
            min={1}
            max={10}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            style={{ width: 60 }}
          />
          <button onClick={handleQuiz} disabled={loading || !text}>
            Generate Quiz
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        {loading && <p>Processing with AI...</p>}
      </div>

      {summary && (
        <div className="card">
          <h3>Summary</h3>
          <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{summary}</pre>
        </div>
      )}

      {questions.length > 0 && (
        <div className="card">
          <h3>Quiz</h3>
          {questions.map((q, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <p><strong>{i + 1}. {q.question}</strong></p>
              {q.options?.map((opt, j) => (
                <p key={j} style={{ margin: "4px 0" }}>{opt}</p>
              ))}
              <p style={{ color: "#16a34a" }}>Answer: {q.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
