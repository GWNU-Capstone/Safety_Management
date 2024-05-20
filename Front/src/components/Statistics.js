import React from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './Statistics.css';

// 필요한 스케일 및 플러그인 수동 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function StatisticsPage() {
  const lineChartData = (label, data) => ({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: label,
        data: data,
        borderColor: '#007bff',
        borderWidth: 2,
        fill: false
      }
    ]
  });

  const lineChartOptions = {
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="statistic-container-main">
      <header className="statistic-header">
        <div className="logo-section">
          <Link to="/main">
            <img src="/img/capstone_title.png" alt="logo" className="statistic-logo" />
          </Link>
        </div>

        <div className="statistic-rightSection">
          <div className="statistic-header-menu">
            <div className="statistic-menu-wrapper">
              <Link to="/member" className="statistic-menu-item">
                <img src="/img/member.png" alt="member" className="statistic-menu-icon" />
                <span>직원 관리</span>
              </Link>

              <Link to="/monitoring" className="statistic-menu-item">
                <img src="/img/monitoring.png" alt="monitoring" className="statistic-menu-icon" />
                <span>모니터링</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="statistic-container">
        <div className="statistic-container-top">
          <div className="statistic-container-top-content">
            <div className="statistic-container-top-content-title">
              <img src="/img/today.png" alt="icon" className="statistic-container-top-content-icon" />
              <h2>Today 출근 현황</h2>
            </div>

            <div className="statistic-container-top-content-item">
              <div className="statistic-container-top-content-item-content">
                <h1>출근:</h1>
              </div>
              <div className="statistic-container-top-content-item-content">
                <h1>결근:</h1>
              </div>
            </div>
          </div>

          <div className="statistic-container-top-content">
            <div className="statistic-container-top-content-title">
              <img src="/img/total.png" alt="icon" className="statistic-container-top-content-icon" />
              <h2>근로자 종합 데이터</h2>
            </div>
            <div className="statistic-container-top-content-item">
              <div className="statistic-container-top-content-item-content">
                <h1>정상:</h1>
              </div>
              <div className="statistic-container-top-content-item-content">
                <h1>주의:</h1>
              </div>
              <div className="statistic-container-top-content-item-content">
                <h1>심각:</h1>
              </div>
            </div>
          </div>

          <div className="statistic-container-top-content">
            <div className="statistic-container-top-content-title">
              <img src="/img/average.png" alt="icon" className="statistic-container-top-content-icon" />
              <h2>근로자 평균 수치</h2>
            </div>
            <div className="statistic-container-top-content-item">
              <div className="statistic-container-top-content-item-content">
                <h1>체온: </h1>
              </div>
              <div className="statistic-container-top-content-item-content">
                <h1>심박수:</h1>
              </div>
              <div className="statistic-container-top-content-item-content">
                <h1>산소포화도:</h1>
              </div>
            </div>
          </div>

          <div className="statistic-container-top-content">
            <div className="statistic-container-top-content-title">
              <img src="/img/alcoholic.png" alt="icon" className="statistic-container-top-content-icon" />
              <h2>근로자 알코올 이상자</h2>
            </div>
            <div className="statistic-container-top-content-item">
              <div className="statistic-container-top-content-item-content-center">
                <h1>0명</h1>
              </div>
            </div>
          </div>

          <div className="statistic-container-top-content">
            <div className="statistic-container-top-content-title">
              <img src="/img/yesterday.png" alt="icon" className="statistic-container-top-content-icon" />
              <h2>전날 평균 근무 시간</h2>
            </div>
            <div className="statistic-container-top-content-item">
              <div className="statistic-container-top-content-item-content-center">
                <h1>0시간 0분</h1>
              </div>
            </div>
          </div>

          <div className="statistic-container-top-content">
            <div className="statistic-container-top-content-title">
              <img src="/img/ai.png" alt="icon" className="statistic-container-top-content-icon" />
              <h2>AI 통계</h2>
            </div>
            <div className="statistic-container-top-content-item">

            </div>
          </div>
        </div>
        
        <div className="statistic-container-bottom">
          <div className="statistic-container-bottom-content">
            <div className="statistic-container-bottom-content-title">
              <img src="/img/temperature.png" alt="icon" className="statistic-container-bottom-content-icon" />
              <h2>기온</h2>
            </div>
            <div className="statistic-container-bottom-content-item">
              <Line data={lineChartData('Temperature', [33, 25, 35, 51, 54, 76, 80])} options={lineChartOptions} className="line-chart" />
            </div>
          </div>
          <div className="statistic-container-bottom-content">
            <div className="statistic-container-bottom-content-title">
              <img src="/img/humidity.png" alt="icon" className="statistic-container-bottom-content-icon" />
              <h2>습도</h2>
            </div>
            <div className="statistic-container-bottom-content-item">
              <Line data={lineChartData('Humidity', [45, 30, 50, 60, 70, 80, 90])} options={lineChartOptions} className="line-chart" />
            </div>
          </div>
          <div className="statistic-container-bottom-content">
            <div className="statistic-container-bottom-content-title">
              <img src="/img/airPollution.png" alt="icon" className="statistic-container-bottom-content-icon" />
              <h2>미세먼지</h2>
            </div>
            <div className="statistic-container-bottom-content-item">
              <Line data={lineChartData('Air Pollution', [12, 19, 3, 5, 2, 3, 7])} options={lineChartOptions} className="line-chart" />
            </div>
          </div>
          <div className="statistic-container-bottom-content">
            <div className="statistic-container-bottom-content-title">
              <img src="/img/sunlight.png" alt="icon" className="statistic-container-bottom-content-icon" />
              <h2>일조량</h2>
            </div>
            <div className="statistic-container-bottom-content-item">
              <Line data={lineChartData('Sunlight', [5, 10, 15, 20, 25, 30, 30])} options={lineChartOptions} className="line-chart" />
            </div>
          </div>
          
        </div>
      </div>

      <footer>
        <div className="footer">
          Ⓒ 안전하조. 캡스톤 디자인 프로젝트
        </div>
      </footer>
    </div>
  );
}

export default StatisticsPage;
