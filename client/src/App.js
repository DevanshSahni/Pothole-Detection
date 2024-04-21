import { Routes, Route } from "react-router-dom";
import React from "react";
import Dashboard from "./Components/Dashboard";
import PotholeData from "./Components/PotholeData";
import ProofOfWork from "./Components/ProofOfWork";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}></Route>
      <Route path="/potholedata" element={<PotholeData />}></Route>
      <Route path="/proofofwork" element={<ProofOfWork />}></Route>
    </Routes>
  );
};

export default App;
