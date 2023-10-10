import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router';
import '../css/Loginsign.css'

const Login = () => {

    const navigate = useNavigate();

    const [success, setSuccess] = useState(false);

    const submitBtn = async (e) => {
        e.preventDefault()

        const email = document.getElementById('loginEmail').value;

        await axios.post('http://localhost:5000/password/forgotpassword', {
            email: email
        })
            .then(responce => {
                // console.log(responce);
                if(responce.data.success){
                    setSuccess(responce.data.success)
                }
                else{
                    alert(responce.data.msg)
                    navigate("/signup")
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    const updatedPassword = async (e) =>{
        e.preventDefault()
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        await axios.post('http://localhost:5000/password/updatepassword', {
            email: email,
            password: password
        })
            .then(responce => {
                alert(responce.data.msg);
                navigate("/home")
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        if (localStorage.getItem('user')) {
            navigate('/home')
        }
    }, [navigate])

    return (
        <div id="intro" className="bg-image shadow-2-strong text-dark">
            <div className="mask d-flex align-items-center h-100" id='introDiv' >
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-5 col-md-8">
                            <form className="bg-white py-4 rounded-5 shadow-5-strong p-5">
                                <h4 className='text-center'>Forgot Password</h4>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="loginEmail">Email address</label>
                                    <input type="email" id="loginEmail" className="form-control" required />
                                </div>
                                {success &&
                                    <div className="form-outline mb-4">
                                        <label className="form-label" htmlFor="loginPassword">Password</label>
                                        <input type="password" id="loginPassword" className="form-control" required />
                                    </div>
                                }
                                {success ===true ?  <button type="submit" onClick={updatedPassword} className="btn btn-sm btn-primary btn-block">Submit</button>:
                                    <button type="submit" onClick={submitBtn} className="btn btn-sm btn-primary btn-block">Submit</button>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login