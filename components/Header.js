// components/Header.js

// Um componente é apenas uma função que retorna HTML (JSX).
export default function Header() {
  return (
    <header>
      {/* Cole o conteúdo do seu _header.html aqui */}
      {/* Lembre-se de trocar 'class' por 'className' */}
      
      {/* Exemplo: */}
      <div className="logo-placeholder">
        {/* Se você usa uma tag <img>, ela deve ser auto-fechada: <img ... /> */}
      </div>
      <h1>Goulart Minds</h1>
      <p>Descubra o que realmente aciona sua reatividade</p>
    </header>
  );
}
