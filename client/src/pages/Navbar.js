import React from 'react'
import { Link, Outlet } from "react-router-dom";


const Navbar = () => {
    return (
        <>
        <nav className="navbar bg-dark navbar-expand-lg px-5 py-0 bg-body-tertiary" data-bs-theme="dark">
            <div className="container-fluid my-2">
                <a className="navbar-brand" href="/">
                    Expense-Tracker
                </a>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                    </ul>
                </div>
                <form className="d-flex">
                    <Link className="btn btn-sm btn-success me-2" to="/login">Login</Link>
                    <Link className="btn btn-sm btn-success me-2" to="/signup">Sign Up</Link>
                </form>
            </div>
        </nav>
        <Outlet/>
        </>
    )
}

export default Navbar