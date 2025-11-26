import '../css/button.css';

function Button({ text, onClick, variant = "primary" }) {
  return (
    <button 
      onClick={onClick}
      className={`btn btn-${variant}`}
    >
      {text}
    </button>
  );
}

export default Button;





