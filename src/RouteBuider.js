import React, { useState } from "react";
import prettier from "prettier";
import babelParser from "prettier/parser-babel";

const Node = ({ pages, selectedPage, setSelectedPage }) => (
  <>
    {pages.map((page) => (
      <div key={page.name} style={{ flexGrow: 1 }}>
        <p
          onClick={() => setSelectedPage(page)}
          style={{ marginBottom: "2rem", textAlign: "center" }}
        >
          {page.name}
        </p>
        <div className="horizontally-spread">
          <Node
            pages={page.children}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
          />
        </div>
      </div>
    ))}
  </>
);

const pageExists = (pages, name) => {
  for (const page of pages) {
    if (page.name === name) return true;
    pageExists(page.children, name);
  }
  return false;
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
    .join("");

const GeneratedCode = ({ pages }) => {
  const code = `const App = () => (<BrowserRouter><Routes>${routes(
    pages
  )}</Routes></BrowserRouter>)`;

  return (
    <>
      <pre>
        {prettier.format(code, {
          parser: "babel",
          plugins: [babelParser],
        })}
      </pre>
    </>
  );
};

const RouteBuilder = ({ selectedPage, setSelectedPage }) => {
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
              required
            />
            <label htmlFor="parent">Parent</label>
            <input id="parent" name="parent" />
            <label htmlFor="path">Path</label>
            <input id="path" name="path" placeholder={placeholder} />
            <button type="submit">Add Page</button>
          </form>
        </div>
        <div style={{ padding: "0 10px", flexGrow: 2 }}>
          <h1 align="center">Routes</h1>
          <div
            style={{ flexGrow: 2, display: "flex", justifyContent: "center" }}
          >
            <Node
              pages={pages}
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
          </div>
        </div>
        <div style={{ padding: "0 10px" }}>
          <h1>Code</h1>
          <GeneratedCode pages={pages} />
        </div>
      </div>
    </div>
  );
};

export default RouteBuilder;
