import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Login from './components/Login';
import Navbar from './components/Navbar';
import Signup from "./components/Signup";


const App = () => {

  return (
    <>
    <Router>
        <Navbar/>
        <Routes>
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/signup" element={<Signup/>}/>
        </Routes>
    </Router>
    </>
  );
}

export default App;
