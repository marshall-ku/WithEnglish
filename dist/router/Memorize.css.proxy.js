// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".memorize__hidden {\n    opacity: 0;\n}\n\n.memorize__hidden.reveal {\n    opacity: 1;\n}\n\n.memorize__word {\n    font-size: 2.5rem;\n    padding: 5px 10px;\n    line-height: 2;\n    border-bottom: 2px solid var(--border-color);\n    margin-bottom: 10px;\n}\n\n.memorize__meaning > li {\n    padding: 5px;\n    list-style: inside decimal;\n    font-size: 1.5rem;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}