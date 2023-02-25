import React, { useEffect } from "react";
import mermaid from "mermaid";

mermaid.initialize({});

export default function Mermaid({ chart }: { chart: string }) {
  useEffect(() => {
    mermaid.contentLoaded();
  }, []);

  return <div className="mermaid">{chart}</div>;
}
