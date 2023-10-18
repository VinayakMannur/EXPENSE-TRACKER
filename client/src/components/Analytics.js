import React, { useRef, useState, useEffect } from 'react'
import moment from 'moment'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Table } from 'antd';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import axios from "axios";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = ({ allExpenses, frequency }) => {

    const pdfRef = useRef();

    const totalExpenses = allExpenses.length;

    const [allIncome, setAllIncome] = useState([]);

    const categoryName = ['bills', 'shopping', 'food', 'grocery', 'invest', 'other'];
    const categoryWiseExpense = [];
    categoryName.map((cat) => {
        const amount = allExpenses.filter((expense) => expense.category === cat)
            .reduce((acc, expense) => acc + expense.amount, 0)
        return categoryWiseExpense.push(amount)
    })

    const getIncome = async () => {
        await axios.post('http://54.221.64.90:5000/get-income', {
            frequency: frequency
        }, {
            headers: {
                authToken: localStorage.getItem('authToken')
            }
        })
            .then(result => {
                // console.log(result.data);
                const reverseData = result.data.income
                setAllIncome(reverseData.reverse());
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        getIncome()
         // eslint-disable-next-line  
    }, [])

    const data = {
        labels: ['bills', 'shopping', 'food', 'grocery', 'invest', 'other'],
        datasets: [
            {
                label: "Expense",
                data: categoryWiseExpense,
                backgroundColor: [
                    'rgba(255, 99, 132)',
                    'rgba(54, 162, 235)',
                    'rgba(255, 206, 86)',
                    'rgba(75, 192, 192)',
                    'rgba(153, 102, 255)',
                    'rgba(255, 159, 64)',
                ],
                borderColor: "black",
                borderWidth: 1,
                hoverOffset: 4,
                animateRotate: true,
            },
        ],
    }

    var getDaysArray = function (start, end) {
        for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
            arr.push(moment(new Date(dt)).format('YYYY-MM-DD'));
        }
        return arr;
    };

    function organizeExpensesByWeeks(monthData) {
        const weeklyExpenses = {};
        for (const date in monthData) {
            const weekNumber = moment(date).format('W')
            if (!weeklyExpenses[weekNumber]) {
                weeklyExpenses[weekNumber] = 0;
            }
            weeklyExpenses[weekNumber] += monthData[date];
        }
        return weeklyExpenses;
    }

    function organizeExpensesByMonths(yearData) {
        const monthlyExpenses = {};

        for (const date in yearData) {
            const [year, month] = date.split('-');
            const monthKey = `${year}-${month}`;

            if (!monthlyExpenses[monthKey]) {
                monthlyExpenses[monthKey] = 0;
            }
            monthlyExpenses[monthKey] += yearData[date];
        }
        return monthlyExpenses;
    }

    let barData;

    if (frequency === '7') {
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() - `${frequency - 1}` * 24 * 60 * 60 * 1000);
        const sDate = moment(startDate).format('YYYY-MM-DD')
        const eDate = moment(endDate).format('YYYY-MM-DD')
        console.log(sDate, eDate);
        const daylist = getDaysArray(new Date(eDate), new Date(sDate));
        // console.log(daylist);
        let dayWiseAmount = [];
        daylist.map((dat) => {
            const amt = allExpenses.filter((exp) => moment(exp.date).format('YYYY-MM-DD') === dat)
                .reduce((acc, expense) => acc + expense.amount, 0)
            return dayWiseAmount.push(amt)
        })
        // console.log(dayWiseAmount);

        barData = {
            labels: daylist,
            datasets: [
                {
                    label: "Expense",
                    data: dayWiseAmount,
                    backgroundColor: [
                        'rgba(255, 99, 132)',
                        'rgba(54, 162, 235)',
                        'rgba(255, 206, 86)',
                        'rgba(75, 192, 192)',
                        'rgba(153, 102, 255)',
                        'rgba(255, 159, 64)',
                    ],
                    borderColor: "black",
                    borderWidth: 1,
                    hoverOffset: 4,
                    animateRotate: true,
                },
            ],
        }

    }
    else if (frequency === '30') {
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() - `${frequency - 1}` * 24 * 60 * 60 * 1000);
        const sDate = moment(startDate).format('YYYY-MM-DD')
        const eDate = moment(endDate).format('YYYY-MM-DD')
        const monthList = getDaysArray(new Date(eDate), new Date(sDate));
        const obj = {}
        monthList.map((dat) => {
            const amt = allExpenses.filter((exp) => moment(exp.date).format('YYYY-MM-DD') === dat)
                .reduce((acc, expense) => acc + expense.amount, 0)
            return obj[dat] = amt;
        })
        // console.log(obj);
        const weeklyExp = organizeExpensesByWeeks(obj)
        // console.log(weeklyExp);
        const weekList = Object.keys(weeklyExp);
        const weeksExpense = Object.values(weeklyExp);

        barData = {
            labels: weekList,
            datasets: [
                {
                    label: "Expense",
                    data: weeksExpense,
                    backgroundColor: [
                        'rgba(255, 99, 132)',
                        'rgba(54, 162, 235)',
                        'rgba(255, 206, 86)',
                        'rgba(75, 192, 192)',
                        'rgba(153, 102, 255)',
                        'rgba(255, 159, 64)',
                    ],
                    borderColor: "black",
                    borderWidth: 1,
                    hoverOffset: 4,
                    animateRotate: true,
                },
            ],
        }
    }
    else if (frequency === '365') {
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() - `${frequency - 1}` * 24 * 60 * 60 * 1000);
        const sDate = moment(startDate).format('YYYY-MM-DD')
        const eDate = moment(endDate).format('YYYY-MM-DD')
        // console.log(sDate, eDate);
        const yearList = getDaysArray(new Date(eDate), new Date(sDate));
        // console.log(yearList);
        const obj1 = {}
        yearList.map((dat) => {
            const amt = allExpenses.filter((exp) => moment(exp.date).format('YYYY-MM-DD') === dat)
                .reduce((acc, expense) => acc + expense.amount, 0)
            return obj1[dat] = amt;
        })
        console.log(obj1);
        const monthlyExp = organizeExpensesByMonths(obj1)
        // console.log(monthlyExp);
        const monthList = Object.keys(monthlyExp);
        const monthExpense = Object.values(monthlyExp);

        barData = {
            labels: monthList,
            datasets: [
                {
                    label: "Expense",
                    data: monthExpense,
                    backgroundColor: [
                        'rgba(255, 99, 132)',
                        'rgba(54, 162, 235)',
                        'rgba(255, 206, 86)',
                        'rgba(75, 192, 192)',
                        'rgba(153, 102, 255)',
                        'rgba(255, 159, 64)',
                    ],
                    borderColor: "black",
                    borderWidth: 1,
                    hoverOffset: 4,
                    animateRotate: true,
                },
            ],
        }
    }
    else {
        barData = {
            labels: ['bills', 'shopping', 'food', 'grocery', 'invest', 'other'],
            datasets: [
                {
                    label: "Expense",
                    data: categoryWiseExpense,
                    backgroundColor: [
                        'rgba(255, 99, 132)',
                        'rgba(54, 162, 235)',
                        'rgba(255, 206, 86)',
                        'rgba(75, 192, 192)',
                        'rgba(153, 102, 255)',
                        'rgba(255, 159, 64)',
                    ],
                    borderColor: "black",
                    borderWidth: 1,
                    hoverOffset: 4,
                    animateRotate: true,
                },
            ],
        }
    }

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
        }
    ]

    const columnsIncome = [
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
            title: "Description",
            dataIndex: 'description',
            key: 'description'
        }
    ]

    async function generatePDF() {

        const input = pdfRef.current;

        await html2canvas(input, { height: 1500 }).then(async (canvas) => {

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = pdf.internal.pageSize.getHeight()
            const imgWidth = canvas.width
            const imgHeight = canvas.height
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
            const imgX = (pdfWidth - imgWidth * ratio)
            const imgY = 10;
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

            // Convert the PDF content to a Uint8Array
            const pdfContent = pdf.output('arraybuffer');
        
            // Create a Blob from the Uint8Array
            const pdfBlob = new Blob([pdfContent], { type: 'application/pdf' });
        
            // Create a File from the Blob
            const pdfFile = new File([pdfBlob], 'expense_report.pdf', { type: 'application/pdf' });
        
            const formData = new FormData();
            formData.append('pdfFile', pdfFile);

            // console.log(formData.get('pdfFile'));

            await axios.post("http://54.221.64.90:5000/download", formData ,{
                headers: {
                    authToken: localStorage.getItem("authToken"),
                    " Content-Type ": 'multipart/form-data',
                },
            })
            .then((result) => {
                var a = document.createElement("a");
                a.href = result.data.fileURL;
                a.target = "_blank"
                // a.download = "myexpenses.csv";
                a.click();
            })
            .catch((err) => {
                console.log(err);
            });

            // pdf.save("ExpenseTracker.pdf")
        })
    }

    const totalExpenseAmount = allExpenses.reduce((acc, expense) => acc + expense.amount, 0)
    const totalIncomeAmount = allIncome.reduce((acc, income) => acc + income.amount, 0)

    return (
        <>
            <div className="card" ref={pdfRef} >
                <div className="card-header">
                    {frequency.length > 0 && <h6 className='text-center mt-3'>Your Expense of Last {frequency} Days</h6>}
                    {frequency.length === 0 && <h6 className='text-center mt-3'>Your overall expenses</h6>}
                </div>
                <div className="card-body">
                    <h6 className="card-title text-start">Your max Expense was {Math.max(...categoryWiseExpense)}</h6>
                    <div className="row mt-3">
                        <div className="col">
                            <div className="card mb-3 ">
                                <div className="card-header">
                                    <h6>
                                        Total Expense : {totalExpenses}
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <Doughnut data={data} />
                                </div>
                            </div>
                        </div>
                        <div className="col">
                            <div className="card">
                                <div className="card-header font-weight-bold">
                                    <h6>
                                        Total Expense : {totalExpenseAmount}
                                    </h6>
                                </div>
                                <div className="card-body">
                                    {barData &&
                                        <Bar data={barData} />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <h5 className="card-title text-center m-3">Your Expense</h5>
                    <Table columns={columns} dataSource={allExpenses} rowKey="id"/>
                    <h5 className="card-title text-center m-3">Your Income</h5>
                    <Table columns={columnsIncome} dataSource={allIncome} rowKey="id"/>
                </div>
                <h5 className="card-title mx-5 my-3 text-start">Summing up your Income & Expenses!</h5>
                <div className="card mx-5" style={{ width: "18rem" }}>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">Total Income : {totalIncomeAmount}</li>
                        <li className="list-group-item">Total Expense : {totalExpenseAmount}</li>
                    </ul>
                    <div className="card-footer">
                        Total Savings : {totalIncomeAmount - totalExpenseAmount}
                    </div>
                </div>
                <div className="container my-5">
                    <div className="row">
                        <div className="col text-center">
                            <button type='button' className='btn btn-success btn-sm' onClick={generatePDF}>Download PDF Report</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Analytics