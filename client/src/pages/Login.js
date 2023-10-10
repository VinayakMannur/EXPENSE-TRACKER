import React, { useEffect } from 'react'
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router';
import '../css/Loginsign.css'

const Login = () => {

    const navigate = useNavigate();

    const loginBtn = async (e) => {
        e.preventDefault()

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        // const checked = document.getElementById('loginRemember').checked;

        await axios.post('http://localhost:5000/login', {
            email: email,
            password: password
        })
            .then(responce => {
                localStorage.setItem("authToken", responce.data.authToken)
                localStorage.setItem("user", JSON.stringify({ ...responce.data.user, password: '', id:'', createdAt:'',updatedAt:''}))
                alert(responce.data.msg);
                navigate("/home")
            })
            .catch(err => {
                // console.log(err)
                document.getElementById('loginEmail').value = '';
                document.getElementById('loginPassword').value = '';
                alert(err.response.data.msg)
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
                                <h4 className='text-center'>Login</h4>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="loginEmail">Email address</label>
                                    <input type="email" id="loginEmail" className="form-control" required />
                                </div>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="loginPassword">Password</label>
                                    <input type="password" id="loginPassword" className="form-control" required />
                                </div>
                                <div className="row mb-4">
                                    <div className="col d-flex justify-content-center">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="loginRemember" />
                                            <label className="form-check-label" htmlFor="loginRemember">
                                                Remember me
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col text-center">
                                        <Link to="/forgotpassword">Forgot password?</Link>
                                    </div>
                                </div>
                                <button type="submit" onClick={loginBtn} className="btn btn-sm btn-primary btn-block">Log in</button>
                                <div className='mt-4'>
                                    <p>Dont have an account..?</p>
                                    <Link className="btn btn-sm btn-success me-2" to="/signup">Sign Up</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login