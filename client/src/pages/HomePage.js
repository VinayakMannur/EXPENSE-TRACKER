import React, { useState, useEffect } from 'react'
import { Select, Table} from 'antd';
import { UnorderedListOutlined, PieChartOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import axios from "axios";
import moment from 'moment'
import Layout from '../components/layout/Layout'
import Analytics from '../components/layout/Analytics';

// const { RangePicker } = DatePicker;

const HomePage = () => {

    const userId = JSON.parse(localStorage.getItem('user')).id;

    const [allExpenses, setAllExpenses] = useState([]);
    const [frequency, setFrequency] = useState([]);
    const [viewData, setViewData] = useState('table');
    const [edit, setEdit] = useState('normal')
    const [expenseEditId, setExpenseEditId] = useState(0);
    
    // const [rangeDate, setRangeDate] = useState([]);

    const columns = [
        {
            title: "Date",
            dataIndex: 'date',
            key: 'date',
            render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>
        },
        {
            title: "Amount",
            dataIndex: 'amount',
            key: 'amount'
        },
        {
            title: "Category",
            dataIndex: 'category',
            key: 'category'
        },
        {
            title: "Description",
            dataIndex: 'description',
            key: 'description'
        },
        {
            title: "Actions",
            key: 'action',
            render: (text, record)=>(
                <div className='d-flex'>
                    <button data-bs-toggle="modal" data-bs-target="#exampleModal" >
                        <EditOutlined onClick={()=>{
                            editExpense(record)
                        }}/>
                    </button>
                    <DeleteOutlined className='mx-2' onClick={()=>{
                        deleteExpense(record)
                    }}/>
                </div>
            )
        }
    ]

    const getExpenses = async () => {
        await axios.post(`http://localhost:5000/get-expense/${userId}`, {
            frequency: frequency
        })
            .then(result => {
                setAllExpenses(result.data);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        getExpenses()
    }, [frequency])

    const deleteExpense = async (record)  => {
        await axios.post('http://localhost:5000/delete-expense', {
            id: record.id
        })
            .then(result => {
                alert(result.data.msg)
                getExpenses()
            })
            .catch(err => {
                console.log(err);
            })
    }

    const editExpense1 = async(e)=>{
        e.preventDefault()
        console.log(expenseEditId);
        const amount = document.getElementById('expenseAmount').value
        const category = document.getElementById('category').value
        const description = document.getElementById('description').value
        const date = document.getElementById('date').value 

        await axios.post(`http://localhost:5000/edit-expense/${userId}`, {
            id: expenseEditId,
            amount: amount,
            category: category,
            description: description,
            date: date
        })
            .then(result => {
                alert(result.data.msg);
                getExpenses()
            })
            .catch(err => console.log(err))

    }

    const editExpense = async (record) =>{
        setEdit('edit')
        // console.log(record.id);
        setExpenseEditId(record.id)
        const date = record.date.split(' ');
        document.getElementById('expenseAmount').value = record.amount
        document.getElementById('category').value = record.category
        document.getElementById('description').value = record.description
        document.getElementById('date').value = date[0]
    }

    const submitExpense = async (e) => {
        e.preventDefault()
        const amount = document.getElementById('expenseAmount').value;
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;

        await axios.post(`http://localhost:5000/add-expense/${userId}`, {
            amount: amount,
            category: category,
            description: description,
            date: date
        })
            .then(result => {
                alert(result.data.msg);
                getExpenses()
            })
            .catch(err => console.log(err))

    }

    return (
        <Layout>
            <div className="container">
                <div className="filters mt-1">
                    <div className='selectingFilter ml-2'>
                        <h6>Select Frequency |</h6>
                        <Select placeholder="Select Frequency" value={frequency} onChange={(values) => setFrequency(values)}>
                            <Select.Option value="7">Last 1 Week</Select.Option>
                            <Select.Option value="30">Last 1 Month</Select.Option>
                            <Select.Option value="365">Last 1 Year</Select.Option>
                            <Select.Option value="custom">Custom</Select.Option>
                        </Select>
                        {/* {frequency === 'custom' && <RangePicker value={rangeDate} onChange={(values) => setRangeDate(values)} />} */}
                    </div>
                    <div className="giveMargin">
                    <UnorderedListOutlined className={`mx-2 ${viewData === 'table'?'active-icon':'inactive-icon'}`} onClick={()=>setViewData('table')}/>
                    </div>
                    <PieChartOutlined className={`mx-2 ${viewData === 'analytics'?'active-icon':'inactive-icon'}`} onClick={()=>setViewData('analytics')}/>
                    <button className='btn btn-outline-success btn-sm' data-bs-toggle="modal" data-bs-target="#exampleModal">Add expense</button>
                </div>
                <div className="content mt-2">
                    {viewData === 'table'? <Table columns={columns} dataSource={allExpenses} />:
                        <Analytics allExpenses={allExpenses}/>
                    }
                    
                </div>
                <div>
                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">{edit === 'edit'?"Edit Expense":"Add Expense"}</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <form className="bg-white rounded-5 shadow-5-strong">
                                        <div className="form-outline mb-2">
                                            <label className="form-label text-black" htmlFor="expenseAmount">Amount</label>
                                            <input type="number" id="expenseAmount" className="form-control" required />
                                        </div>
                                        <div className="form-outline mb-2">
                                            <label className="form-label   text-black" htmlFor="category">Category</label>
                                            <select className="form-select" id='category' defaultValue={'DEFAULT'} aria-label="Default select example" required>
                                                <option value="DEFAULT" disabled>Open this select menu</option>
                                                <option value="bills">Bills</option>
                                                <option value="shopping">Shopping</option>
                                                <option value="food">Food</option>
                                                <option value="grocery">Grocery</option>
                                                <option value="invest">Invenstment</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div className="form-outline mb-2">
                                            <label className="form-label  text-black" htmlFor="description">Description</label>
                                            <input type="text" id="description" className="form-control" required />
                                        </div>
                                        <div className="form-outline mb-2">
                                            <label htmlFor="date">Date</label>
                                            <input type="date" className="form-control" id="date" required />
                                        </div>
                                        <div className="modal-footer p-1">
                                            {edit === 'edit'? <button type="submit" onClick={editExpense1} className="btn btn-success btn-sm" data-bs-dismiss="modal" aria-label="Close">Update Expense</button>:
                                                <button type="submit" onClick={submitExpense} className="btn btn-success btn-sm" data-bs-dismiss="modal" aria-label="Close">Add Expense</button>
                                            }
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default HomePage