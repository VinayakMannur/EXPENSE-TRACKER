import React,{useState, useEffect} from 'react'
import { UserOutlined } from '@ant-design/icons';
import { Avatar} from 'antd';
import {Outlet, useNavigate } from "react-router-dom";
import memeber from '../assets/membership.png'


const Navbar = () => {

    const navigate = useNavigate()

    const [loginUser, setLoginUser] = useState('');
    const [success, setSuccess] = useState(false)

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem('user'));
        if(user){
            setLoginUser(user)
            setSuccess(user.isPremium)
        }
    },[success])

    const logoutHandler = ()=>{
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        navigate('/login')
    }

    return (
        <>
        <nav id='sticky' className="navbar bg-dark  navbar-expand-lg px-5 py-0 bg-body-tertiary" data-bs-theme="dark">
            <div className="container-fluid my-2">
                <a className="navbar-brand ml-5" href="/">
                     Expense-Tracker
                </a>
                {success && 
                    <img src={memeber} alt="Premium User" width="35" height="35" className="d-inline-block align-text-top mx-2" />
                }
                <div className="collapse navbar-collapse d-flex ml-5" id="navbarNav">
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