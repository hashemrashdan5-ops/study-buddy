import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // note being edited

  const fetchNotes = async () => {
    try {
      const { data } = await api.get("/api/notes/");
      setNotes(data);
    } catch (err) {
      setError("Failed to load notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingNote(null);
    setError("");
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editingNote) {
        await api.patch(`/api/notes/${editingNote.id}/`, { title, content });
      } else {
        await api.post("/api/notes/", { title, content });
      }
      resetForm();
      fetchNotes();
    } catch (err) {
      setError(editingNote ? "Failed to update note" : "Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this note?")) return;
    try {
      await api.delete(`/api/notes/${id}/`);
      fetchNotes();
    } catch (err) {
      setError("Failed to delete note");
    }
  };

  return (
    <div className="container">
      <h2>My Notes</h2>

      <div className="card">
        <h3>{editingNote ? `✏️ Editing: "${editingNote.title}"` : "New Note"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          {error && <div className="error">{error}</div>}
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={loading}>
              {loading
                ? (editingNote ? "Updating..." : "Saving...")
                : (editingNote ? "Update Note" : "Add Note")}
            </button>
            {editingNote && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {notes.length === 0 && <p>No notes yet. Create your first one above!</p>}

      {notes.map((note) => (
        <div className="card" key={note.id}>
          <h3>{note.title}</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{note.content}</p>
          <small style={{ color: "#666" }}>
            {new Date(note.created_at).toLocaleString()}
          </small>
          <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
            <button onClick={() => handleOpenEdit(note)}>
              ✏️ Edit
            </button>
            <button className="danger" onClick={() => handleDelete(note.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
