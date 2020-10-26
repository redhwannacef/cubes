import React, { useState } from "react";
import { transform } from "@babel/core";
import pluginTransformJsx from "@babel/plugin-transform-react-jsx";
import prettier from "prettier";
import babelParser from "prettier/parser-babel";

import "./Utilities.css";

const layoutElements = [
  {
    name: "container",
    props: { className: "wrapper" },
    type: "div",
    children: [],
  },
];

const htmlElements = [
  { name: "div", type: "div", children: ["div"] },
  { name: "h1", type: "h1", children: ["h1"] },
  { name: "h2", type: "h2", children: ["h2"] },
  { name: "h3", type: "h3", children: ["h3"] },
  { name: "h4", type: "h4", children: ["h4"] },
  { name: "p", type: "p", children: ["p"] },
  { name: "button", type: "button", children: ["button"] },
  { name: "input", type: "input", children: [] },
];

const transformJsx = (code) =>
  transform(code, { plugins: [pluginTransformJsx] }).code;

const formatProps = (props) => {
  return Object.entries(props)
    .map(([key, value]) => {
      return `${key}={${JSON.stringify(value)}}`;
    })
    .join(" ");
};

const createElement = (type, props, children = []) => {
  const formattedProps = props ? formatProps(props) : "";
  return `<${type} ${formattedProps}>${children
    .filter((obj) => Boolean(obj))
    .map((child) =>
      typeof child === "string"
        ? child
        : createElement(child.type, child.props, child.children)
    )
    .join("\n")}</${type}>`;
};

const DynamicComponent = ({ elements, raw }) => {
  const innerCode =
    elements.length > 0
      ? elements
          .map(({ type, props, children }) =>
            createElement(type, props, children)
          )
          .join("\n")
      : "";

  if (raw)
    return prettier.format(`const Code = () => (<>${innerCode}</>)`, {
      parser: "babel",
      plugins: [babelParser],
    });

  const code = `return ${transformJsx(`<div>${innerCode}</div>`).replace(
    "\n",
    ""
  )}`;

  const fn = new Function("React", code);
  return fn(React);
};

const App = () => {
  const [elements, setElements] = useState([]);

  const addElement = (type, props, children) =>
    setElements((prevState) => [...prevState, { type, props, children }]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "0 50px",
      }}
    >
      <div style={{ padding: "0 10px" }}>
        <h1>Components</h1>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <h4>Layout Elements</h4>
          {layoutElements.map(({ name, type, props, children }) => (
            <button
              key={name}
              onClick={() => addElement(type, props, children)}
            >
              {name}
            </button>
          ))}
          <h4>HTML Elements</h4>
          {htmlElements.map(({ name, type, props, children }) => (
            <button
              key={name}
              onClick={() => addElement(type, props, children)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: "0 10px", flexGrow: 2 }}>
        <h1 align="center">App</h1>
        <DynamicComponent elements={elements} />
      </div>
      <div style={{ padding: "0 10px" }}>
        <h1>Code</h1>
        <div style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}>
          <DynamicComponent elements={elements} raw />
        </div>
      </div>
    </div>
  );
};

export default App;
