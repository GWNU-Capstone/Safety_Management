import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './Statistics.css';

function StatisticsPage() {
    const [dateRange, setDateRange] = useState([
        {
            startDate: null,
            endDate: null,
            key: 'selection'
        }
    ]);

    const [calendarOpen, setCalendarOpen] = useState(false); // State to manage calendar visibility

    const handleSelect = ranges => {
        setDateRange([ranges.selection]);
    };

    const toggleCalendar = () => {
        setCalendarOpen(!calendarOpen); // Toggle calendar visibility
    };

    const data = [
        { id: '부적합 건수', bac: 16, temp: 30, hr: 30 },
        { id: '일평균', bac: 2, temp: 3, hr: 4 }
    ];

    const dataStatistics = [
        { id: 1, name: 'AAA', age: 30, bac: 30, temp: 37.5, hr: 20 },
        { id: 2, name: 'BBB', age: 30, bac: 30, temp: 37.5, hr: 20 },
        { id: 3, name: 'CCC', age: 30, bac: 30, temp: 37.5, hr: 20 },
        { id: 4, name: 'DDD', age: 30, bac: 30, temp: 37.5, hr: 20 },
        { id: 5, name: 'EEE', age: 30, bac: 30, temp: 37.5, hr: 20 },
        { id: 6, name: 'FFF', age: 30, bac: 30, temp: 37.5, hr: 20 }
    ];

    return (
        <div>
            <div className="header">
                <Link to="/main">
                    <img src="/img/capston_title.png" alt="로고" className="Logo"/>
                </Link>
                <div className="calendar-container">
                    <button onClick={toggleCalendar}>Toggle Calendar</button> {/* Icon to toggle calendar */}
                    {calendarOpen && (
                        <div className="calendar-wrapper">
                            <DateRangePicker
                                ranges={dateRange}
                                onChange={handleSelect}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="container">
                <div className="item1">
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>음주</th>
                                <th>체온</th>
                                <th>심박수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.bac}</td>
                                    <td>{item.temp}</td>
                                    <td>{item.hr}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="item2">
                    {/* Additional content */}
                </div>
                <div className="item3">
                    <table>
                        <thead>
                            <tr>
                                <th>사원번호</th>
                                <th>이름</th>
                                <th>나이</th>
                                <th>음주</th>
                                <th>체온</th>
                                <th>심박수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataStatistics.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.age}</td>
                                    <td>{item.bac}</td>
                                    <td>{item.temp}</td>
                                    <td>{item.hr}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default StatisticsPage;
