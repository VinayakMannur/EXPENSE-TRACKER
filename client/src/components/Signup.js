import React from 'react';
import axios from "axios";
import { useNavigate } from 'react-router';

const Signup = () => {

  const navigate = useNavigate();

  const signUpBtn = async (e) => {
    e.preventDefault()
    function handleClick(){
      navigate("/login")
    }

    const email = document.getElementById('signUpEmail').value;
    const name = document.getElementById('signUpName').value;
    const password = document.getElementById('signUpPassword').value;

    if((email && name && password) !== ''){
      await axios.post('http://localhost:5000/signup', {
        email: email,
        name: name,
        password: password
      })
      .then(responce => {
        // console.log(responce);
        alert(responce.data.msg)
        if(responce.status === 200){
          handleClick()
        }  
      })
      .catch(err => console.log(err))
    }
  }


  return (
    <div id="intro" className="bg-image shadow-2-strong">
      <div className="mask d-flex align-items-center h-100" id='introDiv' >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-5 col-md-8">
              <form className="bg-white py-4 rounded-5 shadow-5-strong p-5">
                <h4 className='text-center'>Sign Up</h4>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="signUpEmail">Email address</label>
                  <input type="email" id="signUpEmail" className="form-control" required />
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="signUpName">Name</label>
                  <input type="text" id="signUpName" className="form-control" required />
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="signUpPassword">Password</label>
                  <input type="password" id="signUpPassword" className="form-control" required/>
                </div>
                <button type="submit" onClick={signUpBtn} className="btn btn-primary btn-block">Sign Up</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup