// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".front {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    flex-direction: column;\n}\n\n.front__title {\n    margin-top: 25vh;\n    margin-bottom: 10vh;\n    font-family: \"Dancing Script\", cursive;\n    font-size: 3rem;\n}\n\n.front__buttons {\n    display: flex;\n    flex-direction: column;\n}\n\n.front__buttons > .large-button {\n    margin-bottom: 15px;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}