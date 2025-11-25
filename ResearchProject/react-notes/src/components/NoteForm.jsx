import { useState } from "react";
import Button from "./Button.jsx";
import '../css/NoteForm.css';

function NoteForm({ onSave, onCancel, noteToEdit = null }) {
  const [title, setTitle] = useState(noteToEdit?.title || "");
  const [content, setContent] = useState(noteToEdit?.content || "");
  const [category, setCategory] = useState(noteToEdit?.category || "Personal");

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert("Si us plau, omple tots els camps.");
      return;
    }

    const note = {
      id: noteToEdit?.id || Date.now(),
      title: title.trim(),
      content: content.trim(),
      category,
      createdAt: noteToEdit?.createdAt || new Date().toLocaleDateString()
    };

    onSave(note);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">
          {noteToEdit ? "Editar Nota" : "Nova Nota"}
        </h2>

        <div className="form-group">
          <label className="form-label">Títol</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder="Títol de la nota"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contingut</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-textarea"
            placeholder="Escriu el contingut de la teva nota..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
          >
            <option value="Personal">Personal</option>
            <option value="Treball">Treball</option>
            <option value="Idees">Idees</option>
            <option value="Tasques">Tasques</option>
          </select>
        </div>

        <div className="form-buttons">
          <Button text={noteToEdit ? "Guardar" : "Crear"} onClick={handleSubmit} />
          <Button text="Cancelar" onClick={onCancel} variant="secondary" />
        </div>
      </div>
    </div>
  );
}
export default NoteForm;