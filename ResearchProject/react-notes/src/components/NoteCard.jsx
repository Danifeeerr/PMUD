import "../css/NoteCard.css";

function NoteCard({ note, onEdit, onDelete }) {
  const getCategoryClass = (category) => {
    const classes = {
      Personal: "category-personal",
      Treball: "category-treball",
      Idees: "category-idees",
      Tasques: "category-tasques"
    };
    return classes[category] || "category-personal";
  };

  return (
    <div className="note-card">
      <div className="note-header">
        <h3 className="note-title">{note.title}</h3>
        <span className={`note-category ${getCategoryClass(note.category)}`}>
          {note.category}
        </span>
      </div>
      
      <p className="note-content">{note.content}</p>
      
      <div className="note-footer">
        <span className="note-date">{note.createdAt}</span>
        <div className="note-actions">
          <button
            onClick={() => onEdit(note)}
            className="note-action-btn edit"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="note-action-btn delete"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}


function CategoryFilter({ selectedCategory, onSelectCategory, notesCount }) {
  const categories = ["Totes", "Personal", "Treball", "Idees", "Tasques"];

  return (
    <div className="category-filter">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`category-btn ${selectedCategory === cat ? 'active' : 'inactive'}`}
        >
          {cat} {cat === "Totes" && `(${notesCount})`}
        </button>
      ))}
    </div>
  );
}

export default NoteCard;