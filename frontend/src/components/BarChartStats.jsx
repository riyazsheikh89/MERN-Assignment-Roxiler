import React, { useEffect, useState } from 'react';
import {Bar, ResponsiveContainer, BarChart, XAxis, YAxis} from 'recharts';

const BarChartStats = () => {
    const [selectedMonth, setSelectedMonth] = useState(3); // March is default
    const [barChart, setBarChart] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://13.201.77.5:4000/api/v1/bar-chart?month=${selectedMonth}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const dataArray = Object.entries(data).map(([range, value]) => ({
                    range,
                    value
                }));
                setBarChart(dataArray);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [selectedMonth]);

    const handleMonthChange = (event) => {
        setSelectedMonth(parseInt(event.target.value));
    };

    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ];

    
  return (
    <div className='flex flex-col justify-center items-center mt-2 py-20 bg-yellow-100'>
        <div className='w-5/12 pb-2 flex justify-end'>
        <select
          className="month-dropdown p-2 border border-black rounded-md"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

        <ResponsiveContainer width="50%" aspect={3}>
            <BarChart data={barChart} width={400} height={400}>
                <XAxis dataKey={"range"} />
                <YAxis />
                <Bar dataKey="value" fill='rgb(21 128 61)' />
            </BarChart>
        </ResponsiveContainer>

    </div>
  )
}

export default BarChartStats;