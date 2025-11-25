import '../css/CategoryFilters.css';

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
export default CategoryFilter;