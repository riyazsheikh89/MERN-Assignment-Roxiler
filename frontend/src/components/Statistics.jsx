import React, { useEffect, useState } from 'react'

const Statistics = () => {
    const [selectedMonth, setSelectedMonth] = useState(3);
    const [totalSale, setTotalSale] = useState(0);
    const [soldItems, setSoldItems] = useState(0);
    const [unsoldItems, setUnsoldItems] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://13.201.77.5:4000/api/v1/statistics?month=${selectedMonth}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setTotalSale(jsonData.data.totalSaleAmount);
                setSoldItems(jsonData.data.totalSoldItems);
                setUnsoldItems(jsonData.data.totalNotSoldItems);
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
    <div className="statistics-container bg-sky-100 flex flex-col justify-center items-center mt-2 py-6 pb-10">
      <p className="text-3xl font-bold text center py-6">Statistics</p>

      <div className='month-dropdown pb-4'>
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


          {/* transaction statistics */}
      <div className="w-1/2 p-6 py-16 mb-6 bg-amber-100 rounded-lg flex">
        <div className="w-1/2">
          <p className='text-xl font-bold'>Total Sale:</p>
          <p className='text-xl font-bold'>Total sold items:</p>
          <p className='text-xl font-bold'>Total not sold items:</p>
        </div>
        <div className="w-1/2">
          <p className='text-xl'>{totalSale}</p>
          <p className='text-xl'>{soldItems}</p>
          <p className='text-xl'>{unsoldItems}</p>
        </div>
      </div>

    </div>
  );
}

export default Statistics;