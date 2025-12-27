// components/Copyright.js

export default function Copyright({ onFeedbackClick }) {
  return (
    <footer className="site-footer">

      <button onClick={onFeedbackClick} className="link-style-button">Fale Conosco</button>
      <p>&copy; {new Date().getFullYear()} Goulart Minds. Todos os direitos reservados.</p>
        
    </footer>
  );
}