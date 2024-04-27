import React from 'react';
import { Link } from 'react-router-dom'; // Link 컴포넌트 import
import './Main.css';


function Main() {

  return (
    <div className="Main">
      <div className="main-container">
        <img src="/img/capstone_title.png" alt="logo" className="logo" />
        <div className="main-header-menu">
          <div className="main-menu-wrapper">
            <Link to="/member" className="main-menu-item">
              <img src="/img/member.png" alt="member" className="main-menu-icon" />
              <span>직원 관리</span>
            </Link>

            <Link to="/statistics" className="main-menu-item">
              <img src="/img/statistics.png" alt="statistics" className="main-menu-icon" />
              <span>통계</span>
            </Link>

            <Link to="/monitoring" className="main-menu-item">
              <img src="/img/monitoring.png" alt="monitoring" className="main-menu-icon" />
              <span>모니터링</span>
            </Link>
          </div>
        </div>

        <div className="notice">
          Ⓒ 안전하조. 캡스톤 디자인 프로젝트
        </div>
      </div>
    </div>
  );
}

export default Main;