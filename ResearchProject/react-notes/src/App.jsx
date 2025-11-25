import { useState, useEffect } from 'react';
import './css/App.css';
import Button from "./components/Button";
import NoteForm from "./components/NoteForm";
import NoteCard from "./components/NoteCard";
import CategoryFilter from "./components/CategoryFilter";
import SearchBar from "./components/SearchBar";

export default function App() {
  // Cargar notas desde localStorage al iniciar
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      return JSON.parse(savedNotes);
    }
    // Si no hay notas guardadas, crear una de bienvenida
    return [
      {
        id: 1,
        title: "Bienvenida a tu app de notas",
        content: "Esta es tu primera nota. Puedes crear, editar y eliminar notas fácilmente. ¡Tus notas se guardarán automáticamente!",
        category: "Personal",
        createdAt: new Date().toLocaleDateString()
      }
    ];
  });

  const [showForm, setShowForm] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Totes");
  const [searchTerm, setSearchTerm] = useState("");

  // Guardar notas en localStorage cada vez que cambien
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

  // Filtrar por categoría
  const filteredByCategory = selectedCategory === "Totes"
    ? notes
    : notes.filter(n => n.category === selectedCategory);

  // Filtrar por término de búsqueda
  const filteredNotes = filteredByCategory.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <div className="app-content">
        <div className="app-header">
          <h1 className="app-title">Mis Notas</h1>
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