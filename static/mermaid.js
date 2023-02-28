mermaid.initialize({ startOnLoad: true });
const loadMermaid = () => {
  console.log("load mermaid");
  mermaid.contentLoaded();
};

// @ts-check

const replaceElWithMermaid = (el) => {
  const pre = document.createElement("pre");
  pre.classList.add("mermaid");
  pre.textContent = el.children[0].children[0].textContent;
  el.replaceWith(pre);
  return el;
};

setInterval(() => {
  const shikiElements = Array.from(document.getElementsByClassName("shiki"));

  shikiElements
    .filter((el) => !el.classList.contains("visible"))
    .forEach((el) => el.classList.add("visible"));

  const replacedElements = shikiElements
    .filter((el) => !el.children[0].classList.contains("language-id"))
    .map((el) => {
      if (el.classList.contains("min-dark")) {
        return el.remove();
      }

      return replaceElWithMermaid(el);
    });

  const incorrectlyRenderedMermaid = Array.from(
    document.getElementsByClassName("mermaid")
  )
    .filter((el) => el.children?.[0]?.classList?.contains("code-container"))
    .map((el) => replaceElWithMermaid(el));

  if (replacedElements.length > 0 || incorrectlyRenderedMermaid > 0) {
    loadMermaid();
  }
}, 60);
