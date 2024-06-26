import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './Statistics.css';
import { userApiBaseUrl } from './Api';

// 필요한 스케일 및 플러그인 수동 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function StatisticsPage() {
  const [showTodayDataModal, setShowTodayDataModal] = useState(false);
  const [showWorkerDataModal, setShowWorkerDataModal] = useState(false);
  const [showAlcoholAbusersModal, setShowAlcoholAbusersModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [todayData, setTodayData] = useState([]);
  const [alcoholData, setAlcoholData] = useState({ alcoholAbuserCount: 0, alcoholAbusers: [] });
  const [avgData, setAvgData] = useState({ averageOxygen: 0, averageHeartRate: 0, averageTemp: 0 });
  const [totalResultCount, setTotalResultCount] = useState({ 정상: 0, 주의: 0, 심각: 0 });
  const [workerData, setWorkerData] = useState([]);
  const [yesterdayWorkTime, setYesterdayWorkTime] = useState({ hours: 0, minutes: 0 });
  const [yesterdayWorkTimeMessage, setYesterdayWorkTimeMessage] = useState('');

  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [fineDustData, setFineDustData] = useState([]);
  const [sunshineData, setSunshineData] = useState([]);

  const [feedbackData, setFeedbackData] = useState([]);
  const [currentFeedbackIndex, setCurrentFeedbackIndex] = useState(0);
  const feedbackRef = useRef(null);

  useEffect(() => {
    const fetchData = () => {
      // 출근 현황
      fetch(`${userApiBaseUrl}/today/user-status`)
        .then(response => response.json())
        .then(data => {
          const combinedData = [
            ...data.presentUsersList.map(user => ({ ...user, status: '출근' })),
            ...data.departedUsersList.map(user => ({ ...user, status: '퇴근' })),
            ...data.yetStartedUsersList.map(user => ({ ...user, status: '출근 전' }))
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
      fetch(`${userApiBaseUrl}/yesterday/average-worktime`)
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            setYesterdayWorkTimeMessage(data.message);
          } else {
            setYesterdayWorkTime(data);
          }
        })
        .catch(error => console.error('Error fetching data:', error));
  
      // 환경 데이터
      fetch(`${userApiBaseUrl}/data`)
        .then(response => response.json())
        .then(data => {
          const temperatures = data.map(entry => entry.data.temperature);
          const humidities = data.map(entry => entry.data.humidity);
          const fineDusts = data.map(entry => entry.data.fineDust);
          const sunshines = data.map(entry => entry.data.sunshine);
  
          setTemperatureData(temperatures);
          setHumidityData(humidities);
          setFineDustData(fineDusts);
          setSunshineData(sunshines);
        })
        .catch(error => console.error('Error fetching data:', error));
      console.log('Data fetched at:', new Date());
    };
  
    // 최초 1회 데이터 요청
    fetchData();
  
    // 1분마다 데이터 다시 요청
    const interval = setInterval(fetchData, 60000);
  
    // 컴포넌트가 unmount될 때 interval 정리
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(`${userApiBaseUrl}/ai`)
      .then(response => response.json())
      .then(data => setFeedbackData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeedbackIndex(prevIndex => (prevIndex + 1) % feedbackData.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [feedbackData]);



  const calculateMinMax = (data) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    return { min: min - 10, max: max + 10 };
  };

  const getChartOptions = (data) => {
    const { min, max } = calculateMinMax(data);
    return {
      scales: {
        y: {
          min: min,
          max: max,
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    };
  };

  const lineChartData = (label, data) => ({
    labels: ['10m', '9m', '8m', '7m', '6m', '5m', '4m', '3m', '2m', '1m'],
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

  const toggleTodayDataModal = () => {
    setShowTodayDataModal(!showTodayDataModal);
  };

  const toggleWorkerDataModal = () => {
    setShowWorkerDataModal(!showWorkerDataModal);
  };

  const toggleAlcoholAbusersModal = () => {
    setShowAlcoholAbusersModal(!showAlcoholAbusersModal);
  };

  const toggleAIModal = () => {
    setShowAIModal(!showAIModal);
  };

  const resetAIData = () => {
    if (showAIModal) {
      fetch(`${userApiBaseUrl}/ai/refresh`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          console.log('Refresh successful');
          alert('AI데이터 재설정이 완료되었습니다. 10초 뒤에 AI분석 데이터가 변경됩니다.');
          setTimeout(() => {
            fetch(`${userApiBaseUrl}/ai`)
              .then(response => {
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                return response.json();
              })
              .then(data => {
                setFeedbackData(data);
                setCurrentFeedbackIndex(0); // 인덱스를 초기화
              })
              .catch(error => console.error('Error fetching data:', error));
          }, 10000);
        })
        .catch(error => console.error('Error refreshing data:', error));
    }
  }

  return (
    <div className="statistic-container-main">
      <header className="statistic-header">
        <div className="logo-section">
          <Link to="/main">
            <img src="/img/capstone_title.png" alt="logo" className="statistic-logo" />
          </Link>
        </div>

        <div className="statistic-rightSection">
          <div className="statistic-ai-message clickable ai" onClick={toggleAIModal}>
            <div className="statistic-ai-message-content">
              <img src="/img/ai.png" alt="icon" className="statistic-container-top-content-icon" />
            </div>
            {feedbackData.length > 0 && (
              <div className="feedback-item" ref={feedbackRef}>
                {feedbackData[currentFeedbackIndex].feedback.contents}
              </div>
            )}
          </div>
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

          <div className="statistic-container-top-content clickable" onClick={toggleTodayDataModal}>
            <div className="statistic-container-top-content-title">
              <img src="/img/today.png" alt="icon" className="statistic-container-top-content-icon" />
              <h2>Today 출근 현황</h2>
            </div>

            <div className="statistic-container-top-content-item">
              <div className="statistic-container-top-content-item-content">
                <h1>출근: {todayData.filter(data => data.status === '출근').length}명</h1>
              </div>
              <div className="statistic-container-top-content-item-content">
                <h1>퇴근: {todayData.filter(data => data.status === '퇴근').length}명</h1>
              </div>
              <div className="statistic-container-top-content-item-content">
                <h1>출근 전: {todayData.filter(data => data.status === '출근 전').length}명</h1>
              </div>
            </div>
          </div>

          {showTodayDataModal && (
            <div className="statistics-modal" onClick={toggleTodayDataModal}>
              <div className="statistics-modal-todayData" onClick={(e) => e.stopPropagation()}>
                <div className="statistics-modal-title">
                  <img src="/img/today.png" alt="icon" className="statistic-container-top-content-icon" />
                  <h2>Today 출근 현황</h2>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th className="column-userNo">사원번호</th>
                      <th className="column-userName">이름</th>
                      <th className="column-status">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayData.map((employee) => (
                      <tr key={employee.userNo} onClick={() => window.location.href = `/detail/${employee.userNo}`} style={{ cursor: 'pointer' }}>
                        <td className="column-userNo">{employee.userNo}</td>
                        <td className="column-userName">{employee.userName}</td>
                        <td className="column-status">{employee.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="statistic-container-top-content clickable" onClick={toggleWorkerDataModal}>
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

          {showWorkerDataModal && (
            <div className="statistics-modal" onClick={toggleWorkerDataModal}>
              <div className="statistics-modal-workerData" onClick={(e) => e.stopPropagation()}>
                <div className="statistics-modal-title">
                  <img src="/img/total.png" alt="icon" className="statistic-container-top-content-icon" />
                  <h2>근로자 종합 데이터</h2>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th className="column-userNo">사원번호</th>
                      <th className="column-userName">이름</th>
                      <th>알코올</th>
                      <th>체온</th>
                      <th>산소포화도</th>
                      <th>심박수</th>
                      <th>결과</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workerData.map((employee) => (
                      <tr key={employee.userNo} onClick={() => window.location.href = `/detail/${employee.userNo}`} style={{ cursor: 'pointer' }}>
                        <td className="column-userNo">{employee.userNo}</td>
                        <td className="column-userName">{employee.userName}</td>
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
            </div>
          )}

          <div className="statistic-container-top-content clickable" onClick={toggleAlcoholAbusersModal}>
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

          {showAlcoholAbusersModal && (
            <div className="statistics-modal" onClick={toggleAlcoholAbusersModal}>
              <div className="statistics-modal-alcoholAbusers" onClick={(e) => e.stopPropagation()}>
                <div className="statistics-modal-title">
                  <img src="/img/alcoholic.png" alt="icon" className="statistic-container-top-content-icon" />
                  <h2>근로자 알코올 이상자</h2>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th className="column-userNo">사원번호</th>
                      <th className="column-userName">이름</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alcoholData.alcoholAbusers.map((employee) => (
                      <tr key={employee.userNo} onClick={() => window.location.href = `/detail/${employee.userNo}`} style={{ cursor: 'pointer' }}>
                        <td className="column-userNo">{employee.userNo}</td>
                        <td className="column-userName">{employee.userName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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

          {showAIModal && (
            <div className="statistics-modal" onClick={toggleAIModal}>
              <div className="statistics-modal-ai" onClick={(e) => e.stopPropagation()}>
                <div className="statistics-modal-title">
                  <img src="/img/ai.png" alt="icon" className="statistic-container-top-content-icon" />
                  <h2>AI 분석</h2>
                </div>
                {feedbackData.map(feedback => (
                  <div key={feedback.feedbackId} className="feedback-item-modal" style={{ display: 'inline-block', margin: '0 10px' }}>
                    <p>● {feedback.feedback.contents}</p>
                  </div>
                ))}
                <button className="modal-close-button" onClick={resetAIData}>AI데이터 재설정</button>
              </div>
            </div>
          )}
        </div>

        <div className="statistic-container-bottom">
          <div className="statistic-container-bottom-content">
            <div className="statistic-container-bottom-content-title">
              <img src="/img/temperature.png" alt="icon" className="statistic-container-bottom-content-icon" />
              <h2>기온</h2>
            </div>
            <div className="statistic-container-bottom-content-item">
              <Line data={lineChartData('Temperature', temperatureData)} options={getChartOptions(temperatureData)} className="line-chart" />
            </div>
          </div>
          <div className="statistic-container-bottom-content">
            <div className="statistic-container-bottom-content-title">
              <img src="/img/humidity.png" alt="icon" className="statistic-container-bottom-content-icon" />
              <h2>습도</h2>
            </div>
            <div className="statistic-container-bottom-content-item">
              <Line data={lineChartData('Humidity', humidityData)} options={getChartOptions(humidityData)} className="line-chart" />
            </div>
          </div>
          <div className="statistic-container-bottom-content">
            <div className="statistic-container-bottom-content-title">
              <img src="/img/airPollution.png" alt="icon" className="statistic-container-bottom-content-icon" />
              <h2>미세먼지</h2>
            </div>
            <div className="statistic-container-bottom-content-item">
              <Line data={lineChartData('Air Pollution', fineDustData)} options={getChartOptions(fineDustData)} className="line-chart" />
            </div>
          </div>
          <div className="statistic-container-bottom-content">
            <div className="statistic-container-bottom-content-title">
              <img src="/img/sunlight.png" alt="icon" className="statistic-container-bottom-content-icon" />
              <h2>일조량</h2>
            </div>
            <div className="statistic-container-bottom-content-item">
              <Line data={lineChartData('Sunlight', sunshineData)} options={getChartOptions(sunshineData)} className="line-chart" />
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