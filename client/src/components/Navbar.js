import React from 'react'
import { Link } from "react-router-dom";
import logo from '../png/logo1.png'

const Navbar = () => {
    return (
        
        <nav className="navbar bg-dark navbar-expand-lg px-5 py-0 bg-body-tertiary" data-bs-theme="dark">
            <div className="container-fluid my-2">
                <a className="navbar-brand" href="/">
                    <img src={logo} alt="Logo" width="30" height="24" className="d-inline-block align-text-top" /> Expense-Tracker
                </a>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/home">Home</a>
                        </li>
                    </ul>
                </div>
                <form className="d-flex">
                    <Link className="btn btn-sm btn-success me-2" to="/login">Login</Link>
                    <Link className="btn btn-sm btn-success me-2" to="/signup">Sign Up</Link>
                </form>
            </div>
        </nav>

    )
}

export default Navbar