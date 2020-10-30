import React, { useState, Fragment } from "react";
import RouteBuilder from "./RouteBuider";
import UiBuilder from "./UiBuilder";
import DynamicComponent from "./DynamicComponent";
import RoutesCode from "./RoutesCode";

import "./Utilities.scss";
import { BrowserRouter } from "react-router-dom";

const pageExists = (pages, name) => {
  for (const page of pages) {
    if (page.name === name) return true;
    pageExists(page.children, name);
  }
  return false;
};

const updatePages = (pages, parent, newPage) => {
  for (const page of pages) {
    if (page.name === parent) {
      page.children.push(newPage);
      return;
    }
    updatePages(page.children, parent, newPage);
  }
};

const App = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [pageElements, setPageElements] = useState({});

  const addPageElementIfNotExist = (name) => {
    if (!pageElements[name]) {
      setPageElements((prevState) => ({ ...prevState, [name]: [] }));
    }
  };

  const addPage = (name, path, parent) => {
    if (pageExists(pages, name)) return;
    if (!parent) {
      setPages((prevState) => [...prevState, { name, path, children: [] }]);
      addPageElementIfNotExist(name);
    } else {
      let pagesCopy = pages.map((page) => page);
      updatePages(pagesCopy, parent, { name, path, children: [] });
      setPages(pagesCopy);
      addPageElementIfNotExist(name);
    }
  };

  const onSetElements = (elements) => {
    setPageElements((prevState) => ({
      ...prevState,
      [selectedPage.name]: elements,
    }));
  };

  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <div style={{ flexGrow: 2 }}>
          <RouteBuilder
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            pages={pages}
            addPage={addPage}
          />
          {selectedPage && (
            <>
              <hr style={{ margin: "3rem" }} />
              <UiBuilder
                selectedPage={selectedPage}
                setElements={onSetElements}
                elements={pageElements[selectedPage.name]}
              />
            </>
          )}
        </div>
        <div style={{ padding: "0 10px" }}>
          <h1>Code</h1>
          <pre>
            <RoutesCode pages={pages} />
            {"\n"}
            {Object.entries(pageElements).map(([page, elements]) => (
              <Fragment key={`code-${page}`}>
                <DynamicComponent
                  raw
                  elements={elements}
                  componentName={page}
                />
                {"\n"}
              </Fragment>
            ))}
          </pre>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
