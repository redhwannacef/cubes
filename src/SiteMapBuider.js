import React, { useState } from "react";
import { Link } from "react-router-dom";
import prettier from "prettier";
import babelParser from "prettier/parser-babel";

const renderPages = (pages) =>
  pages.map((page) => (
    <div key={page.name} style={{ flexGrow: 1 }}>
      <p align="center">{page.name}</p>
      <div className="horizontally-spread">{renderPages(page.children)}</div>
    </div>
  ));

const pageExists = (pages, name) => {
  for (const page of pages) {
    if (page.name === name) return true;
    return pageExists(page.children, name);
  }
};

const upperCamelToSnakeCase = (string) =>
  string.replace(/[\w]([A-Z])/g, (m) => m[0] + "-" + m[1]).toLowerCase();

const routes = (pages) =>
  pages
    .map(({ name, path, children }) =>
      children.length > 0
        ? `<Route path="${path}" element={<${name} />}>${routes(
            children
          )}</Route>`
        : `<Route path="${path}" element={<${name} />} />`
    )
    .join();

const generateCode = (pages) => {
  const code = `const App = () => (<BrowserRouter><Routes>${routes(
    pages
  )}</Routes></BrowserRouter>)`;

  return prettier.format(code, {
    parser: "babel",
    plugins: [babelParser],
  });
};

const SiteMapBuilder = () => {
  const [placeholder, setPlaceholder] = useState();
  const [pages, setPages] = useState([]);

  const updatePages = (pages, parent, newPage) => {
    for (const page of pages) {
      if (page.name === parent) {
        page.children.push(newPage);
        return;
      }
      updatePages(page.children, parent, newPage);
    }
  };

  const addPage = (name, path, parent) => {
    if (pageExists(pages, name)) return;
    if (!parent) {
      setPages((prevState) => [...prevState, { name, path, children: [] }]);
    } else {
      let pagesCopy = pages.map((page) => page);
      updatePages(pagesCopy, parent, { name, path, children: [] });
      setPages(pagesCopy);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const { name, path, parent } = event.target.elements;
    addPage(name.value, path.value || placeholder, parent.value);
  };

  return (
    <div style={{ padding: "0 50px" }}>
      <Link to="/ui-builder">UI Builder</Link>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div style={{ padding: "0 10px" }}>
          <h1>New Page</h1>
          <form
            autoComplete="off"
            style={{ display: "flex", flexDirection: "column" }}
            onSubmit={onSubmit}
          >
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              onChange={(e) =>
                setPlaceholder(upperCamelToSnakeCase(e.target.value))
              }
            />
            <label htmlFor="parent">Parent</label>
            <input id="parent" name="parent" />
            <label htmlFor="path">Path</label>
            <input id="path" name="path" placeholder={placeholder} />
            <button type="submit">Add Page</button>
          </form>
        </div>
        <div style={{ padding: "0 10px", flexGrow: 2 }}>
          <h1 align="center">Site Map</h1>
          <div
            style={{ flexGrow: 2, display: "flex", justifyContent: "center" }}
          >
            {renderPages(pages)}
          </div>
        </div>
        <div style={{ padding: "0 10px" }}>
          <h1>Code</h1>
          <code>{generateCode(pages)}</code>
        </div>
      </div>
    </div>
  );
};

export default SiteMapBuilder;
