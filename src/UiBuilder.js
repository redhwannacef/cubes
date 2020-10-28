import React, { useCallback, useEffect, useState } from "react";
import { transform } from "@babel/core";
import pluginTransformJsx from "@babel/plugin-transform-react-jsx";
import prettier from "prettier";
import babelParser from "prettier/parser-babel";

import "./Utilities.scss";

const layoutElements = [
  {
    name: "wrapper",
    props: { className: "wrapper" },
    type: "div",
    children: [],
  },
  {
    name: "flow",
    props: { className: "flow" },
    type: "div",
    children: [],
  },
  {
    name: "horizontally spread",
    props: { className: "horizontally-spread" },
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
  console.log(props);
  return Object.entries(props)
    .map(([key, value]) => {
      const val =
        {}.toString.call(value) === "[object Function]"
          ? value
          : JSON.stringify(value);
      return `${key}={${val}}`;
    })
    .join(" ");
};

const createElement = (
  type,
  props = {},
  children = [],
  id,
  raw,
  selectedElement,
  setSelectedElement
) => {
  const highlight = id === selectedElement ? "selected" : "";
  const additionalProps = {
    ...props,
    className: `element ${props.className || ""} ${highlight}`,
    onClick: (e) => {
      setSelectedElement(Number(e.target.id));
      e.stopPropagation();
    },
    id,
  };

  const formattedProps = props
    ? formatProps(raw ? props : additionalProps)
    : raw
    ? ""
    : formatProps(raw ? props : additionalProps);

  return `<${type} ${formattedProps}>${children
    .filter((obj) => Boolean(obj))
    .map((child) =>
      typeof child === "string"
        ? child
        : createElement(
            child.type,
            child.props,
            child.children,
            child.id,
            raw,
            selectedElement,
            setSelectedElement
          )
    )
    .join("\n")}</${type}>`;
};

const DynamicComponent = ({
  elements,
  raw = false,
  selectedElement,
  setSelectedElement,
}) => {
  const innerCode =
    elements.length > 0
      ? elements
          .map(({ id, type, props, children }) =>
            createElement(
              type,
              props,
              children,
              id,
              raw,
              selectedElement,
              setSelectedElement
            )
          )
          .join("\n")
      : "";

  if (raw)
    return prettier.format(`const Code = () => (<>${innerCode}</>)`, {
      parser: "babel",
      plugins: [babelParser],
    });

  const code = `return ${transformJsx(`<>${innerCode}</>`).replace("\n", "")}`;

  const fn = new Function("React", "setSelectedElement", code);
  return fn(React, setSelectedElement);
};

const UiBuilder = () => {
  const [id, setId] = useState(0);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(-1);

  const getAndIncrement = () => {
    const currentId = id;
    setId((previousId) => previousId + 1);
    return currentId;
  };

  function update(elementsCopy, selectedElement, el) {
    for (let element of elementsCopy) {
      if (typeof element === "string") continue;
      if (element.id === selectedElement) {
        element.children = [...element.children, el];
        return;
      } else {
        update(element.children, selectedElement, el);
      }
    }
  }

  const addElement = (id, type, props, children, selectedElement) => {
    if (selectedElement > -1) {
      const el = { id, type, props, children };
      let updatedElements = elements.map((element) => ({ ...element }));
      update(updatedElements, selectedElement, el);
      setElements(updatedElements);
    } else {
      setElements((prevState) => [...prevState, { id, type, props, children }]);
    }
  };

  useEffect(() => {
    const escFunction = (event) => {
      if (event.keyCode === 27) {
        setSelectedElement(-1);
      }
    };
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

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
          <h4>Utilities</h4>
          {layoutElements.map(({ name, type, props, children }, index) => (
            <button
              key={name}
              onClick={() =>
                addElement(
                  getAndIncrement(),
                  type,
                  props,
                  children,
                  selectedElement
                )
              }
            >
              {name}
            </button>
          ))}
          <h4>HTML Elements</h4>
          {htmlElements.map(({ name, type, props, children }, index) => (
            <button
              key={name}
              onClick={() =>
                addElement(
                  getAndIncrement(),
                  type,
                  props,
                  children,
                  selectedElement
                )
              }
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: "0 10px", flexGrow: 2 }}>
        <h1 align="center">App</h1>
        <DynamicComponent
          elements={elements}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
        />
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

export default UiBuilder;
