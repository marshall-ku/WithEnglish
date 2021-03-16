// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = ".words {\n    overflow-x: auto;\n}\n\n.table {\n    display: grid;\n    grid-template-columns: 1fr 1fr 3fr;\n    white-space: nowrap;\n}\n\n.table__title {\n    background: var(--text-color);\n    color: var(--background-color);\n}\n\n.table > div {\n    padding: 10px;\n    line-height: 2;\n    border: 1px solid var(--border-color);\n}\n\n.table li {\n    list-style: inside decimal;\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';
  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}