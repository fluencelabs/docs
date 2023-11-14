mermaid.initialize({ startOnLoad: true });
const loadMermaid = () => mermaid.contentLoaded();

// @ts-check

const replaceWithMermaid = (el) => {
  const pre = document.createElement("pre");
  pre.classList.add("mermaid");
  pre.textContent = el.children[0].children[0].textContent;
  el.replaceWith(pre);
};

setInterval(() => {
  const shikiElements = Array.from(document.getElementsByClassName("shiki"));
  shikiElements.forEach((el) => el.classList.add("visible"));
  const elementsToReplace = shikiElements.filter(
    (el) => el.previousElementSibling?.textContent === "mermaid"
  );

  elementsToReplace.forEach((el) => {
    el.previousElementSibling.remove();
    if (el.classList.contains("min-dark")) {
      el.remove();
      return;
    }

    replaceWithMermaid(el);
  });
  const setOfDiagrams = new Set();
  Array.from(document.getElementsByClassName("mermaid"))
    .filter((el) => el.children[0]?.classList.contains("code-container"))
    .forEach((el) => {
      const textContent = el.children[0].children[0].textContent;
      if (setOfDiagrams.has(textContent)) {
        el.remove();
        return;
      }
      replaceWithMermaid(el);
      setOfDiagrams.add(textContent);
    });

  if (elementsToReplace.length > 0) {
    loadMermaid();
  }
}, 60);
