// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".select {\n    display: flex;\n    height: 100%;\n    justify-content: center;\n    align-items: center;\n    flex-direction: column;\n}\n\n.select > li {\n    margin-bottom: 15px;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}