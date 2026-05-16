import { useState, useRef, useEffect } from "react";
import api from "../api/axios";

function parseContent(content) {
  const parts = [];
  const regex = /```(\w+)?\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index).trim();
      if (text) parts.push({ type: "text", content: text });
    }
    parts.push({
      type: "code",
      language: (match[1] || "text").toLowerCase(),
      content: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    const text = content.slice(lastIndex).trim();
    if (text) parts.push({ type: "text", content: text });
  }

  return parts.length > 0 ? parts : [{ type: "text", content }];
}

function isPreviewable(lang) {
  return ["html", "htm", "javascript", "js", "css"].includes(lang);
}

function buildPreviewHtml(code, lang) {
  if (lang === "html" || lang === "htm") {
    if (code.includes("<html")) return code;
    return `<!DOCTYPE html>
<html>
<head>
<style>body { font-family: -apple-system, sans-serif; padding: 16px; margin: 0; }</style>
</head>
<body>
${code}
</body>
</html>`;
  }
  if (lang === "css") {
    return `<!DOCTYPE html>
<html>
<head>
<style>${code}</style>
</head>
<body>
<h1>CSS Preview</h1>
<p>This is a paragraph.</p>
<button>Button</button>
<div class="box">A div with class "box"</div>
</body>
</html>`;
  }
  if (lang === "javascript" || lang === "js") {
    return `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: -apple-system, sans-serif; padding: 16px; margin: 0; background: #fff; color: #000; }
#output { background: #f5f5f5; padding: 12px; border-radius: 4px; min-height: 100px; white-space: pre-wrap; font-family: monospace; }
</style>
</head>
<body>
<h3>Console Output:</h3>
<div id="output"></div>
<script>
const output = document.getElementById('output');
const origLog = console.log;
console.log = (...args) => {
  output.textContent += args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') + '\\n';
  origLog(...args);
};
window.onerror = (msg, src, line) => {
  output.textContent += 'Error: ' + msg + ' (line ' + line + ')\\n';
};
try {
${code}
} catch(e) {
  output.textContent += 'Error: ' + e.message;
}
</script>
</body>
</html>`;
  }
  return code;
}

function CodeBlock({ language, content }) {
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const previewable = isPreviewable(language);

  return (
    <div className="code-block">
      <div className="code-block-header">
        <span className="code-block-lang">{language || "text"}</span>
        <div className="code-block-actions">
          <button className="code-block-btn" onClick={handleCopy}>
            {copied ? "Copied!" : "Copy"}
          </button>
          {previewable && (
            <button className="code-block-btn" onClick={() => setShowPreview((v) => !v)}>
              {showPreview ? "Hide Preview" : "▶ Preview"}
            </button>
          )}
        </div>
      </div>
      <pre>
        <code>{content}</code>
      </pre>
      {showPreview && previewable && (
        <div className="code-preview">
          <iframe
            title="preview"
            srcDoc={buildPreviewHtml(content, language)}
            sandbox="allow-scripts"
          />
        </div>
      )}
    </div>
  );
}

function MessageContent({ content }) {
  const parts = parseContent(content);
  return (
    <div>
      {parts.map((part, i) =>
        part.type === "code" ? (
          <CodeBlock key={i} language={part.language} content={part.content} />
        ) : (
          <div key={i} style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, margin: "4px 0" }}>
            {part.content}
          </div>
        )
      )}
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/api/ai/chat/", {
        messages: newMessages,
      });
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (confirm("Clear all messages?")) {
      setMessages([]);
      setError("");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>
          <span style={{ color: "var(--accent)", textShadow: "0 0 12px var(--accent-glow)" }}>AI</span> Chat
        </h2>
        {messages.length > 0 && (
          <button className="danger" onClick={handleClear}>Clear Chat</button>
        )}
      </div>

      <div
        className="card"
        style={{
          minHeight: 400,
          maxHeight: 600,
          overflowY: "auto",
          padding: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            <p style={{ fontSize: 20, marginBottom: 8, color: "var(--accent)", textShadow: "0 0 12px var(--accent-glow)" }}>
              👋 Hi! I'm Study Buddy
            </p>
            <p>Ask me anything in Arabic or English. I can also write code with live preview!</p>
            <div style={{ marginTop: 24, fontSize: 14 }}>
              <p style={{ margin: "8px 0", color: "var(--text-dim)" }}>Try asking:</p>
              <p style={{ margin: "4px 0", color: "var(--accent)" }}>"اعملي صفحة HTML فيها زر يغير اللون"</p>
              <p style={{ margin: "4px 0", color: "var(--accent)" }}>"Write a JavaScript function that animates a circle"</p>
              <p style={{ margin: "4px 0", color: "var(--accent)" }}>"اكتب CSS لبطاقة عرض جميلة"</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid var(--border)",
              background: msg.role === "user" ? "var(--bg-elev)" : "transparent",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: msg.role === "user" ? "var(--text-muted)" : "var(--accent)",
                marginBottom: 8,
                fontWeight: 700,
                textShadow: msg.role === "assistant" ? "0 0 8px var(--accent-glow)" : "none",
              }}
            >
              {msg.role === "user" ? "🧑 You" : "🤖 Study Buddy"}
            </div>
            <MessageContent content={msg.content} />
          </div>
        ))}

        {loading && (
          <div style={{ padding: "14px 20px", color: "var(--accent)", fontStyle: "italic" }}>
            🤖 Study Buddy is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSend} style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <input
          type="text"
          placeholder="Type your message... (Arabic or English)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          maxLength={5000}
          style={{ flex: 1, marginBottom: 0 }}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          {loading ? "..." : "Send"}
        </button>
      </form>

      <p style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 8 }}>
        Powered by Llama 3.1 via Groq • Press Enter to send • Click ▶ Preview on HTML/CSS/JS code blocks
      </p>
    </div>
  );
}
