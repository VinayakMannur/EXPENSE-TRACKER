import React, { useRef } from 'react'
import moment from 'moment'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Table } from 'antd';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = ({ allExpenses, frequency }) => {

    const pdfRef = useRef();

    console.log(allExpenses);

    const categoryName = ['bills', 'shopping', 'food', 'grocery', 'invest', 'other'];
    const categoryWiseExpense = [];
    categoryName.map((cat) => {
        const amount = allExpenses.filter((expense) => expense.category === cat)
            .reduce((acc, expense) => acc + expense.amount, 0)
        return categoryWiseExpense.push(amount)
    })

    const totalExpenses = allExpenses.length;

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
        // console.log(sDate, eDate);
        const monthList = getDaysArray(new Date(eDate), new Date(sDate));
        // console.log(monthList);
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

    async function generatePDF() {

        const input = pdfRef.current;

        await html2canvas(input, { height: 1500 }).then((canvas) => {

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
            pdf.save("ExpenseTracker.pdf")
        })
    }

    const totalExpenseAmount = allExpenses.reduce((acc, expense) => acc + expense.amount, 0)

    return (
        <>
            <div class="card" ref={pdfRef} >
                <div class="card-header">
                    {frequency.length > 0 && <h6 className='text-center mt-3'>Your Expense of Last {frequency} Days</h6>}
                    {frequency.length === 0 && <h6 className='text-center mt-3'>Your overall expenses</h6>}
                </div>
                <div class="card-body">
                    <h6 class="card-title">Your max Expense was {Math.max(...categoryWiseExpense)}</h6>
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
                            <div class="container my-5">
                                <div class="row my-5">
                                    <div class="col text-center">
                                        <button type='button' className='btn btn-success btn-sm my-5' onClick={generatePDF}>Download Report</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <Table columns={columns} dataSource={allExpenses} />
                </div>
            </div>
        </>
    )
}

export default Analytics

