import React from 'react'
import { Link } from "react-router-dom";
import '../css/Loginsign.css'

const Login = () => {
    return (
        <div id="intro" className="bg-image shadow-2-strong">
            <div className="mask d-flex align-items-center h-100" id='introDiv' >
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-5 col-md-8">
                            <form className="bg-white py-4 rounded-5 shadow-5-strong p-5">
                                <h4 className='text-center'>Login</h4>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="form1Example1">Email address</label>
                                    <input type="email" id="form1Example1" className="form-control" required/>
                                </div>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="form1Example2">Password</label>
                                    <input type="password" id="form1Example2" className="form-control" required/>
                                </div>
                                <div className="row mb-4">
                                    <div className="col d-flex justify-content-center">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="form1Example3"/>
                                            <label className="form-check-label" htmlFor="form1Example3">
                                                Remember me
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col text-center">
                                        <a href="/forgotpassword">Forgot password?</a>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-sm btn-primary btn-block">Log in</button>
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