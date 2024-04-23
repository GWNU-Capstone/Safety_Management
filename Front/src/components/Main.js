import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Link 컴포넌트 import
import './Main.css';


function Main() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="Main">
      <img src="/img/capston_title.png" alt="logo" className="logo" />
      <div className="menu-wrapper">
        <img src="/img/menu-button.png" alt="menu" className="menu-button" onClick={toggleMenu} />

        {isMenuOpen && (
          <div className="menu-dropdown">
            <Link to="/member" className="menu-item">
              <img src="/img/member.png" alt="member" className="menu-icon" />
              <span>직원 관리</span>
            </Link>

            <Link to="/statistics" className="menu-item">
              <img src="/img/statistics.png" alt="statistics" className="menu-icon" />
              <span>통계</span>
            </Link>

            <Link to="/monitoring" className="menu-item"> {/* Monitoring 화면으로 이동하는 링크 */}
              <img src="/img/monitoring.png" alt="monitoring" className="menu-icon" />
              <span>모니터링</span>
            </Link>
          </div>
        )}
      </div>

      <div className="notice">
        <span>※ Notice</span>
        <span className="additional-text">캡스톤 디자인 7조의 프로젝트 파일입니다.</span>
      </div>
    </div>
  );
}

export default Main;