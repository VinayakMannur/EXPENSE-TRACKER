import React,{useState, useEffect} from 'react'
import { UserOutlined } from '@ant-design/icons';
import { Avatar} from 'antd';
import {Outlet, useNavigate } from "react-router-dom";

// import logo from '../png/logo1.png'

const Navbar = () => {

    const navigate = useNavigate()

    const [loginUser, setLoginUser] = useState('');

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem('user'));
        if(user){
            setLoginUser(user)
        }
    },[])

    const logoutHandler = ()=>{
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login')
    }

    return (
        <>
        <nav className="navbar bg-dark navbar-expand-lg px-5 py-0 bg-body-tertiary" data-bs-theme="dark">
            <div className="container-fluid my-2">
                <a className="navbar-brand ml-5" href="/">
                    {/* <img  alt="Logo" width="30" height="24" className="d-inline-block align-text-top" /> */}
                     Expense-Tracker
                </a>
                <div className="collapse navbar-collapse d-flex ml-5" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                    </ul>
                </div>
                    <li className='me-2'>
                        <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} /> 
                        <span className="text-white px-2 text-uppercase font-weight-bold">{loginUser && loginUser.name}</span>
                    </li>
                    <li className='me-1'>
                        <button className='btn btn-sm btn-success btn-block' onClick={logoutHandler}>Logout</button>
                        
                    </li>
                
            </div>
        </nav>
        <Outlet/>
        </>
    )
}

export default Navbar