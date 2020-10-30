import React, { useEffect, useState } from "react";
import DynamicComponent from "./DynamicComponent";

import "./Utilities.scss";

const layoutElements = [
  {
    name: "wrapper",
    props: { className: "wrapper" },
    type: "div",
    children: [],
  },
  { name: "flow", props: { className: "flow" }, type: "div", children: [] },
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

const update = (elementsCopy, selectedElement, el) => {
  for (let element of elementsCopy) {
    if (typeof element === "string") continue;
    if (element.id === selectedElement) {
      element.children = [...element.children, el];
      return;
    } else {
      update(element.children, selectedElement, el);
    }
  }
};

const UiBuilder = ({ selectedPage, elements = [], setElements }) => {
  const [id, setId] = useState(0);
  const [selectedElement, setSelectedElement] = useState(-1);

  const getAndIncrement = () => {
    const currentId = id;
    setId((previousId) => previousId + 1);
    return currentId;
  };

  const addElement = (id, type, props, children, selectedElement) => {
    if (selectedElement > -1) {
      const el = { id, type, props, children };
      let updatedElements = elements.map((element) => ({ ...element }));
      update(updatedElements, selectedElement, el);
      setElements(updatedElements);
    } else {
      setElements([...elements, { id, type, props, children }]);
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
    <div style={{ padding: "0 50px" }}>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
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
          <h1 align="center">{selectedPage.name}</h1>
          <DynamicComponent
            elements={elements}
            selectedElement={selectedElement}
            setSelectedElement={setSelectedElement}
            componentName={selectedPage.name}
          />
        </div>
        <div style={{ padding: "0 10px" }}>
          <h1>Code</h1>
          <pre>
            <DynamicComponent
              raw
              elements={elements}
              componentName={selectedPage.name}
            />
          </pre>
        </div>
      </div>
    </div>
  );
};

export default UiBuilder;
