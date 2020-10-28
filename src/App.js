import React from "react";
import UiBuilder from "./UiBuilder";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SiteMapBuilder from "./SiteMapBuider";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/ui-builder" element={<UiBuilder />} />
      <Route path="site-map-builder" element={<SiteMapBuilder />} />
      <Navigate to="/ui-builder" replace={true} />
    </Routes>
  </BrowserRouter>
);

export default App;