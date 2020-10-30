import React, { useState } from "react";

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

const upperCamelToSnakeCase = (string) =>
  string.replace(/[\w]([A-Z])/g, (m) => m[0] + "-" + m[1]).toLowerCase();

const RouteBuilder = ({ selectedPage, setSelectedPage, pages, addPage }) => {
  const [placeholder, setPlaceholder] = useState();

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
      </div>
    </div>
  );
};

export default RouteBuilder;
