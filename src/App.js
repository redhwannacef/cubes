import React, { useState } from "react";
import { transform } from "@babel/core";
import pluginTransformJsx from "@babel/plugin-transform-react-jsx";
import prettier from "prettier";
import babelParser from "prettier/parser-babel";

const transformJsx = (code) =>
  transform(code, { plugins: [pluginTransformJsx] }).code;

const toComponent = (type, children) => {
  return `<${type}>${children}</${type}>`;
};

const DynamicComponent = ({ elements, raw }) => {
  const innerCode =
    elements.length > 0
      ? elements
          .map(({ type, children }) => toComponent(type, children))
          .join("\n")
      : "";
  const code = `return ${transformJsx(`<div>${innerCode}</div>`).replace(
    "\n",
    ""
  )}`;

  if (raw)
    return prettier.format(`<div>${innerCode}</div>`, {
      parser: "babel",
      plugins: [babelParser],
    });

  const fn = new Function("React", code);
  return fn(React);
};

const App = () => {
  const [elements, setElements] = useState([]);

  const addElement = (element, children) =>
    setElements((prevState) => [
      ...prevState,
      {
        type: element,
        children: children,
      },
    ]);

  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <div>
        <h1>App</h1>
        <div style={{ display: "flex" }}>
          <button onClick={() => addElement("h1", "Heading 1")}>H1</button>
          <button onClick={() => addElement("h2", "Heading 2")}>H2</button>
          <button onClick={() => addElement("h3", "Heading 3")}>H3</button>
          <button onClick={() => addElement("p", "Paragraph")}>p</button>
        </div>
        <DynamicComponent elements={elements} />
      </div>
      <div>
        <h1>Code</h1>
        <div style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
          <DynamicComponent elements={elements} raw />
        </div>
      </div>
    </div>
  );
};

export default App;
