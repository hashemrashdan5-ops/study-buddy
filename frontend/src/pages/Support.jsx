import { useState } from "react";
import api from "../api/axios";

export default function Support() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    steps: "",
    expected: "",
    actual: "",
    browser: "",
    priority: "medium",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await api.post("/api/bug-reports/", form);
      setSuccess(true);
      setForm({
        title: "",
        description: "",
        steps: "",
        expected: "",
        actual: "",
        browser: "",
        priority: "medium",
      });
    } catch (err) {
      setError("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Bug Report</h2>
        <p>Found a bug? Let us know. (No login needed.)</p>
        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Bug title" value={form.title} onChange={handleChange} required />
          <textarea name="description" placeholder="What happened?" value={form.description} onChange={handleChange} required />
          <textarea name="steps" placeholder="Steps to reproduce" value={form.steps} onChange={handleChange} required />
          <textarea name="expected" placeholder="Expected behavior" value={form.expected} onChange={handleChange} required />
          <textarea name="actual" placeholder="Actual behavior" value={form.actual} onChange={handleChange} required />
          <input name="browser" placeholder="Browser (e.g. Chrome 120)" value={form.browser} onChange={handleChange} />
          <select name="priority" value={form.priority} onChange={handleChange} style={{ padding: 8, marginBottom: 10, width: "100%", borderRadius: 6 }}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {success && <div className="success">Report submitted. Thank you!</div>}
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
}
