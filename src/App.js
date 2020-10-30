import React, { useState } from "react";
import RouteBuilder from "./RouteBuider";
import UiBuilder from "./UiBuilder";

const App = () => {
  const [selectedPage, setSelectedPage] = useState(null);
  const [pageElements, setPageElements] = useState({});

  const onSetElements = (elements) => {
    setPageElements((prevState) => ({
      ...prevState,
      [selectedPage.name]: elements,
    }));
  };

  return (
    <>
      <RouteBuilder
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
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
    </>
  );
};

export default App;
