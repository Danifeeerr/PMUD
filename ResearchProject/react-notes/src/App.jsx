import { useState, useEffect } from 'react';
import './css/App.css';
import Button from "./components/Button";
import NoteForm from "./components/NoteForm";
import NoteCard from "./components/NoteCard";
import CategoryFilter from "./components/CategoryFilter";
import SearchBar from "./components/SearchBar";

export default function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      return JSON.parse(savedNotes);
    }
    //si no hi han notes, crear una de benvinguda
    return [
      {
        id: 1,
        title: "Benvolgut/da a la teva app de notes",
        content: "Aquesta és la teva primera nota. Pots crear, editar i eliminar notes fàcilment. Les teves notes es desaran automàticament!",
        category: "Personal",
        createdAt: new Date().toLocaleDateString()
      }
    ];
  });

  const [showForm, setShowForm] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Totes");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleCreateNote = () => {
    setNoteToEdit(null);
    setShowForm(true);
  };

  const handleSaveNote = (note) => {
    if (noteToEdit) {
      setNotes(notes.map(n => n.id === note.id ? note : n));
    } else {
      setNotes([note, ...notes]);
    }
    setShowForm(false);
    setNoteToEdit(null);
  };

  const handleEditNote = (note) => {
    setNoteToEdit(note);
    setShowForm(true);
  };

  const handleDeleteNote = (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta nota?")) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  const filteredByCategory = selectedCategory === "Totes"
    ? notes
    : notes.filter(n => n.category === selectedCategory);

  const filteredNotes = filteredByCategory.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <div className="app-content">
        <div className="app-header">
          <h1 className="app-title">Les meves notes</h1>
          <Button text="+ Crear Nota" onClick={handleCreateNote} />
        </div>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          notesCount={notes.length}
        />

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {filteredNotes.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">
              {searchTerm 
                ? `No se encontraron notas con "${searchTerm}"` 
                : "No hay notas en esta categoría. ¡Crea tu primera nota!"
              }
            </p>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}

        {showForm && (
          <NoteForm
            onSave={handleSaveNote}
            onCancel={() => {
              setShowForm(false);
              setNoteToEdit(null);
            }}
            noteToEdit={noteToEdit}
          />
        )}
      </div>
    </div>
  );
}