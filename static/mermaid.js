mermaid.initialize({ startOnLoad: true });
const loadMermaid = () => {
  console.log("load mermaid");
  mermaid.contentLoaded();
};

// @ts-check

setInterval(() => {
  const shikiElements = Array.from(document.getElementsByClassName("shiki"));
  shikiElements.forEach((el) => el.classList.add("visible"));
  const replacedElements = shikiElements
    .filter((el) => !el.children[0].classList.contains("language-id"))
    .map((el) => {
      if (el.classList.contains("min-dark")) {
        return el.remove();
      }

      const pre = document.createElement("pre");
      pre.classList.add("mermaid");
      pre.textContent = el.children[0].children[0].textContent;
      el.after(pre);
      requestAnimationFrame(() => {
        el.remove();
      });
      return el;
    });

  if (replacedElements.length > 0) {
    loadMermaid();
  }
}, 60);
