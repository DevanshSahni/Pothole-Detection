import { Routes, Route } from "react-router-dom";
import React from "react";
import Dashboard from "./Components/Dashboard";
import Navbar from "./Components/Navbar";
import Contact from "./Components/Contact";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
      </Routes>
    </>
  );
};

export default App;
