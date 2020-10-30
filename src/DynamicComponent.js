import prettier from "prettier";
import babelParser from "prettier/parser-babel";
import React from "react";
import { transform } from "@babel/core";
import pluginTransformJsx from "@babel/plugin-transform-react-jsx";

const transformJsx = (code) =>
  transform(code, { plugins: [pluginTransformJsx] }).code;

const formatProps = (props) =>
  Object.entries(props)
    .map(([key, value]) => {
      const val =
        {}.toString.call(value) === "[object Function]"
          ? value
          : JSON.stringify(value);
      return `${key}={${val}}`;
    })
    .join(" ");

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
  componentName,
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
    return prettier.format(
      `const ${componentName} = () => (<>${innerCode}</>)`,
      {
        parser: "babel",
        plugins: [babelParser],
      }
    );

  const code = `return ${transformJsx(`<>${innerCode}</>`).replace("\n", "")}`;

  const fn = new Function("React", "setSelectedElement", code);
  return fn(React, setSelectedElement);
};

export default DynamicComponent;
