import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './Statistics.css';
import { userApiBaseUrl } from './Api';
import Modal from './Modal'; // 모달 컴포넌트 임포트

// 필요한 스케일 및 플러그인 수동 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function StatisticsPage() {
  const [todayData, setTodayData] = useState([]);
  const [alcoholData, setAlcoholData] = useState({ alcoholAbuserCount: 0, alcoholAbusers: [] });
  const [avgData, setAvgData] = useState({ averageOxygen: 0, averageHeartRate: 0, averageTemp: 0 });
  const [totalResultCount, setTotalResultCount] = useState({ 정상: 0, 주의: 0, 심각: 0 });
  const [workerData, setWorkerData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null); // 모달 내용 상태 추가
  const [yesterdayWorkTime, setYesterdayWorkTime] = useState({ hours: 0, minutes: 0 }); 
  const [yesterdayWorkTimeMessage, setYesterdayWorkTimeMessage] = useState('');

  useEffect(() => {
    // 출근 현황
    fetch(`${userApiBaseUrl}/today/user-status`)
      .then(response => response.json())
      .then(data => {
        const combinedData = [
          ...data.presentUsersList.map(user => ({ ...user, status: '출근' })),
          ...data.departedUsersList.map(user => ({ ...user, status: '퇴근' })),
          ...data.yetStartedUsersList.map(user => ({ ...user, status: '미출근' }))
        ];
        setTodayData(combinedData);
      })
      .catch(error => console.error('Error fetching data:', error));
    
    // 근로자 알코올 이상자
    fetch(`${userApiBaseUrl}/today/alcohol-abusers`)
      .then(response => response.json())
      .then(data => setAlcoholData(data))
      .catch(error => console.error('Error fetching data:', error));
    
    // 근로자 평균 수치
    fetch(`${userApiBaseUrl}/today/data-average`)
      .then(response => response.json())
      .then(data => setAvgData(data))
      .catch(error => console.error('Error fetching data:', error));
    
    // 근로자 건강 상태
    fetch(`${userApiBaseUrl}/today/user-health-status`)
      .then(response => response.json())
      .then(data => {
        setTotalResultCount(data.totalResultCount);
        setWorkerData(data.userStatusList);
      })
      .catch(error => console.error('Error fetching data:', error));

    // 전날 평균 근무 시간
    fetch('http://localhost:8080/yesterday/average-worktime')
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          setYesterdayWorkTimeMessage(data.message);
        } else {
          setYesterdayWorkTime(data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const lineChartData = (label, data) => ({
    labels: ['1m', '2m', '3m', '4m', '5m', '6m', '7m', '8m', '9m', '10m'],
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

  const handleOpenModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
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

          <div className="statistic-container-top-content clickable" onClick={() => handleOpenModal('todayStatus')}>
            <div className="statistic-container-top-content-title">
              <img src="/img/today.png" alt="icon" className="statistic-container-top-content-icon" />
              <h2>Today 출근 현황</h2>
            </div>

            <div className="statistic-container-top-content-item">
              <div className="statistic-container-top-content-item-content">
                <h1>출근: {todayData.filter(data => data.status === '출근').length}명</h1>
              </div>
              <div className="statistic-container-top-content-item-content">
                <h1>퇴근: {todayData.filter(data => data.status === '결근').length}명</h1>
              </div>
              <div className="statistic-container-top-content-item-content">
                <h1>미출근: {todayData.filter(data => data.status === '미출근').length}명</h1>
              </div>
            </div>
          </div>

          <div className="statistic-container-top-content clickable" onClick={() => handleOpenModal('workerData')}>
            <div className="statistic-container-top-content-title">
              <img src="/img/total.png" alt="icon" className="statistic-container-top-content-icon" />
              <h2>근로자 종합 데이터</h2>
            </div>
            <div className="statistic-container-top-content-item">
              <div className="statistic-container-top-content-item-content">
                <h1>정상: {totalResultCount.정상}명</h1>
              </div>
              <div className="statistic-container-top-content-item-content">
                <h1>주의: {totalResultCount.주의}명</h1>
              </div>
              <div className="statistic-container-top-content-item-content">
                <h1>심각: {totalResultCount.심각}명</h1>
              </div>
            </div>
          </div>

          <div className="statistic-container-top-content clickable" onClick={() => handleOpenModal('alcoholAbusers')}>
            <div className="statistic-container-top-content-title">
              <img src="/img/alcoholic.png" alt="icon" className="statistic-container-top-content-icon" />
              <h2>근로자 알코올 이상자</h2>
            </div>
            <div className="statistic-container-top-content-item">
              <div className="statistic-container-top-content-item-content-center">
                <h1>{alcoholData.alcoholAbuserCount}명</h1>
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
                <h1>체온: {avgData.averageTemp}°C</h1>
              </div>
              <div className="statistic-container-top-content-item-content">
                <h1>심박수: {avgData.averageHeartRate}bpm</h1>
              </div>
              <div className="statistic-container-top-content-item-content">
                <h1>산소포화도: {avgData.averageOxygen}%</h1>
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
                <h1>
                  {yesterdayWorkTimeMessage ? yesterdayWorkTimeMessage : `${yesterdayWorkTime.hours}시간 ${yesterdayWorkTime.minutes}분`}
                </h1>
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

      <Modal show={isModalOpen} onClose={handleCloseModal}>
        {modalContent === 'todayStatus' && (
          <div className="statistics-modal">
            <h2>Today 출근 현황</h2>
            <table>
              <thead>
                <tr>
                  <th>사원번호</th>
                  <th>이름</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {todayData.map((employee) => (
                  <tr key={employee.userNo}>
                    <td>{employee.userNo}</td>
                    <td>{employee.userName}</td>
                    <td>{employee.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {modalContent === 'alcoholAbusers' && (
          <div className="statistics-modal">
            <h2>근로자 알코올 이상자</h2>
            <table>
              <thead>
                <tr>
                  <th>사원번호</th>
                  <th>이름</th>
                </tr>
              </thead>
              <tbody>
                {alcoholData.alcoholAbusers.map((employee) => (
                  <tr key={employee.userNo}>
                    <td>{employee.userNo}</td>
                    <td>{employee.userName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {modalContent === 'workerData' && (
          <div className="statistics-modal">
            <h2>근로자 종합 데이터</h2>
            <table>
              <thead>
                <tr>
                  <th>사원번호</th>
                  <th>이름</th>
                  <th>알코올</th>
                  <th>체온</th>
                  <th>산소포화도</th>
                  <th>심박수</th>
                  <th>결과</th>
                </tr>
              </thead>
              <tbody>
                {workerData.map((employee) => (
                  <tr key={employee.userNo}>
                    <td>{employee.userNo}</td>
                    <td>{employee.userName}</td>
                    <td>{employee.userDrink}</td>
                    <td>{employee.userTemp}</td>
                    <td>{employee.userOxygen}</td>
                    <td>{employee.userHeartRate}</td>
                    <td>{employee.totalResult}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      <footer>
        <div className="footer">
          Ⓒ 안전하조. 캡스톤 디자인 프로젝트
        </div>
      </footer>
    </div>
  );
}

export default StatisticsPage;
