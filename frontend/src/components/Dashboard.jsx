import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(3); // March is default
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://13.201.77.5:4000/api/v1/get-all?month=${selectedMonth}&search=${searchTerm}&page=${page}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setData(jsonData.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [searchTerm, selectedMonth, page]);

    // Transaction table column heading
    const columns = [
        {
            name: "ID",
            selector: row => row.id,
            width: "70px"
        },
        {
            name: "Title",
            selector: row => row.title,
            width: "350px"
        },
        {
            name: "Description",
            selector: row => row.description,
            width: "500px"
        },
        {
            name: "Price",
            selector: row => row.price,
            width: "100px"
        },{
            name: "Category",
            selector: row => row.category,
            width: "150px"
        },{
            name: "Sold",
            selector: row => row.sold ? "YES" : "NO",
            width: "70px"
        }
    ]

    // months
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

    // Event handler for changing selected month
    const handleMonthChange = (event) => {
        console.log("in: ", event.target.value);
        setSelectedMonth(parseInt(event.target.value));
    };

    
    return (
      <div className="dashboard-container bg-slate-200 w-full px-10 flex flex-col">
        {/* Search and month dropdown */}
        <div className="flex justify-between py-6">
          <input
            type="text"
            placeholder="Search transactions..."
            className="border-slate-500 border-2 rounded-md px-2 py-1"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />

          <select 
            value={selectedMonth} 
            onChange={handleMonthChange}
            className='px-4 py-2  border-slate-400 border-2 rounded-md cursor-pointer'
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        {/* Table Data */}
        <DataTable columns={columns} data={data}></DataTable>

        {/* Pagination Button */}
        <div className="flex justify-end gap-10 py-6">
          <button
            className="bg-blue-600 rounded-md px-3 py-2 text-white"
            onClick={() => setPage(page > 1 ? page - 1 : page)}
            disabled={page === 1}
            style={{
              backgroundColor:
                page === 1 ? "rgb(107 114 128)" : "rgb(37 99 235)",
            }}
          >
            Previous
          </button>
          <button
            className="bg-blue-600 rounded-md px-6 py-2 text-white"
            onClick={() => setPage(page + 1)}
            disabled={page === 5}
            style={{
              backgroundColor:
                page === 5 ? "rgb(107 114 128)" : "rgb(37 99 235)",
            }}
          >
            Next
          </button>
        </div>
      </div>
    );
}

export default Dashboard;