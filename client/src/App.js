import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'

import Login from './pages/Login';
import Navbar from './pages/Navbar';
import Signup from  './pages/Signup';
import HomePage from './pages/HomePage';
import Forgotpassword from './pages/Forgotpassword';
import UpdatedPassword from './pages/Updatepassword'


const App = () => {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Navbar />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgotpassword" element={<Forgotpassword/>}/>
            <Route path="updatepassword" element={<UpdatedPassword/>}/>
          </Route>
          <Route exact path='/home' element={<ProtectedRoutes><HomePage/></ProtectedRoutes>}/>
        
        </Routes>
      </Router>
    </>
  );
}

export function ProtectedRoutes(props){
  if(localStorage.getItem('user')){
    return props.children
  }
  else{
    return <Navigate to="/login"/>
  }
}

export default App;
