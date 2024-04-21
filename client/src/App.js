import { Routes, Route } from "react-router-dom";
import React from "react";
import Dashboard from "./Components/Dashboard";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}></Route>
    </Routes>
  );
};

export default App;
