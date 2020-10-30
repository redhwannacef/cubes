import prettier from "prettier";
import babelParser from "prettier/parser-babel";
import React from "react";

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

const RoutesCode = ({ pages }) => {
  const code = `const App = () => (<BrowserRouter><Routes>${routes(
    pages
  )}</Routes></BrowserRouter>)`;

  return (
    <>
      {prettier.format(code, {
        parser: "babel",
        plugins: [babelParser],
      })}
    </>
  );
};

export default RoutesCode;
