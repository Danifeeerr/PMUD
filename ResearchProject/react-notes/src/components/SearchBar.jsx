import '../css/SearchBar.css';

export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
        placeholder="🔍 Buscar notes per títol..."
      />
    </div>
  );
}

