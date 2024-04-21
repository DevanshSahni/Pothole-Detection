import { Routes, Route } from "react-router-dom";
import React from "react";
import Dashboard from "./Components/Dashboard";
import Navbar from "./Components/Navbar";
import Contact from "./Components/Contact";
import PotholeData from "./Components/PotholeData";
import ProofOfWork from "./Components/ProofOfWork";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/potholedata" element={<PotholeData />}></Route>
        <Route path="/proofofwork" element={<ProofOfWork />}></Route>
      </Routes>
    </>
  );
};

export default App;
