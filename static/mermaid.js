mermaid.initialize({ startOnLoad: true });
const loadMermaid = () => {
  console.log("load mermaid");
  mermaid.contentLoaded();
};

// @ts-check

const getShikiElements = () =>
  Array.from(document.getElementsByClassName("shiki"));

setInterval(() => {
  const replacedElements = getShikiElements()
    .filter((el) => !el.children[0].classList.contains("language-id"))
    .map((el) => {
      if (el.classList.contains("min-dark")) {
        return el.remove();
      }

      const pre = document.createElement("pre");
      pre.classList.add("mermaid");
      pre.textContent = el.children[0].children[0].textContent;
      el.replaceWith(pre);
      return el;
    });

  if (replacedElements.length > 0) {
    loadMermaid();
  }

  requestAnimationFrame(() => {
    getShikiElements().forEach((el) => el.classList.add("visible"));
  });
}, 60);
