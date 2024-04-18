import React from 'react';
import { Link } from 'react-router-dom';
import './Statistics.css';

function StatisticsPage() {
    return (
        <div>
            <div className="header">
                <Link to="/main">
                    <img src="/img/capston_title.png" alt="로고" className="Logo"/>
                </Link>
            </div>

            <div className="container">
                <div className="item1">aaaaaaaaaaaaaaa1</div>
                <div className="item2">2</div>
                <div className="item3">3</div>
            </div>
        </div>
    );
}

export default StatisticsPage;
