import React, { useState } from "react";
import { Link } from "react-router-dom";

const renderPages = (pages) =>
  pages.map((page) => (
    <div key={page.name} style={{ flexGrow: 1 }}>
      <p align="center">{page.name}</p>
      <div className="horizontally-spread">{renderPages(page.children)}</div>
    </div>
  ));

const SiteMapBuilder = () => {
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

  const addPage = (name, parent) => {
    if (!parent) {
      setPages((prevState) => [...prevState, { name, children: [] }]);
    } else {
      let pagesCopy = pages.map((page) => page);
      updatePages(pagesCopy, parent, { name, children: [] });
      setPages(pagesCopy);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const { page, parent } = event.target.elements;
    addPage(page.value, parent.value);
  };

  return (
    <div style={{ padding: "0 50px" }}>
      <Link to="/ui-builder">UI Builder</Link>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <form
          autoComplete="off"
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={onSubmit}
        >
          <label htmlFor="page">Page</label>
          <input id="page" name="page" />
          <label htmlFor="parent">Parent</label>
          <input id="parent" name="parent" />
          <button type="submit">Add Page</button>
        </form>
        <div style={{ flexGrow: 2, display: "flex", justifyContent: "center" }}>
          {renderPages(pages)}
        </div>
      </div>
    </div>
  );
};

export default SiteMapBuilder;
