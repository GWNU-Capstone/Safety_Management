import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Monitoring.css';
import { fingerprintApiBaseUrl, userApiBaseUrl } from './Api';

const MonitoringScreen = () => {
  const [step, setStep] = useState(0);
  const [temperature, setTemperature] = useState(null);
  const [bloodPressure, setBloodPressure] = useState(null);
  const [alcoholLevel, setAlcoholLevel] = useState(null);
  const [fingerprintScanComplete, setFingerprintScanComplete] = useState(false);
  const [employeeID, setEmployeeID] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeImage, setEmployeeImage] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [code, setCode] = useState(null);
  const [userId, setUserId] = useState(null);
  const [spo2, setSpo2] = useState(null);

  useEffect(() => {
    if (!userId && step === 1) {
      const fetchUserId = async () => {
        try {
          const response = await axios.get(`${fingerprintApiBaseUrl}/fingerprint`);
          if (response.status === 200) {
            const data = response.data;
            const userIdFromResponse = data["fingerprint_results"];
            setUserId(userIdFromResponse);
            console.log('Fetched user ID:', userIdFromResponse);
          } else {
            console.error('Failed to fetch user ID');
          }
        } catch (error) {
          console.error('Error fetching user ID:', error);
          setUserId(null);
        }
      };
      fetchUserId();
    }
  }, [userId, step]);

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const dateString = now.toLocaleDateString('ko-KR', options);
      setCurrentDate(dateString);
    };

    updateDate();

    const intervalId = setInterval(() => {
      updateDate();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (step === 1 || step === 2 || step === 3) {
      const timer = setTimeout(() => {
        resetStatesAndScan();
        setStep(0);
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    if (step === 4 || step === 5 || step === 6) {
      const timer = setTimeout(() => {
        resetStatesAndScan();
      }, 2500);
      return () => clearTimeout(timer);
    }
    else if (step === 2) {
      setTimeout(() => {
        measureAlcoholLevel();
      }, 5000);
    }
    else if (step === 3) {
      setTimeout(() => {
        measureTemperatureAndBloodPressure();
      }, 5000);
    }
  }, [step]);

  const startGuidance = () => {
    setStep(0);
  };

  useEffect(() => {
    startGuidance();
  }, []);

  useEffect(() => {
    return () => {
      resetStatesAndScan();
    };
  }, []);

  const scanFingerprint = () => {
    if (userId) {
      axios.get(`${userApiBaseUrl}/user/fingerprint/${userId}`)
        .then(response => {
          console.log('API 응답 전체:', response); // API 응답 전체를 로그로 출력
          const { data } = response;
          const { code, userImage, userNo, userName } = data;
          console.log('API에서 받은 값:', code, userImage, userNo, userName); // 받은 값들을 로그로 출력
          setCode(code);
          setEmployeeImage(userImage);
          setEmployeeID(userNo);
          setEmployeeName(userName);
          setFingerprintScanComplete(true);
          console.log('변수에 지정된 값:', fingerprintScanComplete, code, employeeID, employeeImage, employeeName);
          if (code === 102) {
            setStep(6);
            resetStatesAndScan();
          } else if (code === 101) {
            setStep(4);
          } else if (code === 103) {
            setStep(2);
          }
        })
        .catch(handleError);
    } else {
      console.error('User ID is null. Cannot fetch fingerprint data.');
    }
  };  

  const handleError = (error) => {
    console.error('Error fetching employee data:', error);
    resetStatesAndScan();
  };

  const resetStatesAndScan = () => {
    setFingerprintScanComplete(false);
    setAlcoholLevel(null);
    setTemperature(null);
    setBloodPressure(null);
    setSpo2(null);
    setEmployeeID('');
    setEmployeeName('');
    setEmployeeImage('');
    setCode(null);
    setStep(1);
  };

  const formatTime = (time) => {
    const hour = time.getHours().toString().padStart(2, '0');
    const minute = time.getMinutes().toString().padStart(2, '0');
    return `${hour}시 ${minute}분`;
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <p>이곳을 눌러 지문 측정을 시작하세요.</p>
          </div>
        );
      case 1:
        return (
          <div>
            <p>지문을 스캔합니다.</p>
            <p>센서에 손을 올려주세요.</p>
            <button onClick={scanFingerprint}>지문 스캔 시작</button>
          </div>
        );
      case 2:
        return (
          <div>
            <p>혈중 알코올 농도를 측정합니다.</p>
            <p>센서에 입으로 공기를 불어주세요.</p>
          </div>
        );
      case 3:
        return (
          <div>
            <p>체온과 혈압, 산소포화도를 측정합니다.</p>
            <p>센서에 손을 올려주세요.</p>
          </div>
        );
      case 4:
        return (
          <div>
            <p>퇴근이 완료되었습니다.</p>
          </div>
        );
      case 5:
        return (
          <div>
            <p>출근이 완료되었습니다.</p>
          </div>
        );
      case 6:
        return (
          <div>
            <p>이미 퇴근 처리가 완료된 사용자입니다.</p>
          </div>
        );
      default:
        return (
          <div>
            <p>알 수 없는 단계...</p>
          </div>
        );
    }
  };

  const measureAlcoholLevel = async () => {
    try {
      const alcoholLevel = await fetchAlcoholLevel();
      if (alcoholLevel !== null) {
        setAlcoholLevel(alcoholLevel);
        setStep(3);
      }
    } catch (error) {
      console.error('Error measuring alcohol level:', error);
    }
  };

  const registerAttendance = async (employeeID, alcoholLevel, heartRate, temperature, spo2) => {
    try {
      const response = await axios.post(`${userApiBaseUrl}/user/go`, {
        userNo: employeeID,
        userDrink: alcoholLevel,
        userHeartRate: heartRate,
        userTemp: temperature,
        userOxygen: spo2
      });
      console.log('출근 등록 성공:', response.data);
    } catch (error) {
      console.error('출근 등록 실패:', error);
    }
  };
  
  const measureTemperatureAndBloodPressure = async () => {
    try {
      const { temperature, heartRate } = await fetchTemperatureAndHeartRate();
      setTemperature(temperature);
      setBloodPressure(heartRate);
      setStep(5);
  
      await registerAttendance(employeeID, alcoholLevel, heartRate, temperature, spo2);
    } catch (error) {
      console.error('Error measuring temperature and blood pressure:', error);
    }
  };  

  const fetchAlcoholLevel = () => {
    return axios.get(`${fingerprintApiBaseUrl}/drink`)
      .then(response => {
        const { userdrink } = response.data;
        if (userdrink !== null) {
          setAlcoholLevel(userdrink);
          return userdrink;
        } else {
          return null;
        }
      })
      .catch(error => {
        console.error('Error fetching alcohol level:', error);
        return null;
      });
  };

  const fetchTemperatureAndHeartRate = (id) => {
    return axios.get(`${fingerprintApiBaseUrl}/tempheart`)
      .then(response => {
        console.log(response);
        const { userTemp, userHeartRate, userSpo2 } = response.data;
        setTemperature(userTemp);
        setBloodPressure(userHeartRate);
        setSpo2(userSpo2);
      })
      .catch(error => {
        console.error('Error fetching temperature, heart rate, and spo2:', error);
        setTemperature(null);
        setBloodPressure(null);
        setSpo2(null);
      });
  };

  const handleScanButtonClick = () => {
    setStep(1);
  };

  return (
    <div className="monitoring-container">
      <header className="monitoring-header">
        <div className="monitoring-logo-section">
          <Link to="/main">
            <img src="/img/capstone_title.png" alt="logo" className="monitoring-logo" />
          </Link>
        </div>
        <div className="monitoring-rightSection">
          <div className="monitoring-time">
            <p>{currentDate}</p>
            <p2>{formatTime(currentTime)}</p2>
          </div>
          <div className="monitoring-header-menu">
            <div className="monitoring-menu-wrapper">
              <Link to="/member" className="monitoring-menu-item">
                <img src="/img/member.png" alt="member" className="monitoring-menu-icon" />
                <span>직원 관리</span>
              </Link>

              <Link to="/statistics" className="monitoring-menu-item">
                <img src="/img/statistics.png" alt="statistics" className="monitoring-menu-icon" />
                <span>통계</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="monitoring-content">
        <div className="monitoring-content-div" onClick={handleScanButtonClick}>
          <p>{renderStep()}</p>
        </div>
        <div className="monitoring-content-div2">
          <div className="monitoring-profile-img">
            {fingerprintScanComplete ? (
              <img src="/img/1.png" alt="Employee" />
            ) : (
              <div className="placeholder"></div>
            )}
          </div>
          <div className="monitoring-profile-info">
            <div className="monitoring-profile-img">
              {fingerprintScanComplete ? (
                <img src={employeeImage ? employeeImage : "/img/1.png"} alt="Employee" className="monitoring-user-profile-img" />
              ) : (
                <img src="/img/user.png" alt="" className="monitoring-user-profile-img" />
              )}
            </div>
            {fingerprintScanComplete && employeeName ? (
              <p>{employeeName}</p>
            ) : (
              <p>지문을 스캔하세요.</p>
            )}
            {fingerprintScanComplete && employeeID !== '' ? (
              <p>사원번호<br/>{employeeID}</p>
            ) : (
              <p>{employeeID}</p>
            )}
          </div>
        </div>
      </div>
      <div className="monitoring-content2">
        <div className="monitoring-content2-div">
          <img src="/img/alcoholic.png" alt="alcoholic" className="monitoring-content2-icon" />
          <div className="monitoring-content2-text">
            <p>알코올 농도</p>
            {alcoholLevel !== null ? <p2>{alcoholLevel}%</p2> : <p2>측정 전</p2>}
          </div>
        </div>
        <div className="monitoring-content2-div">
          <img src="/img/thermometer.png" alt="thermometer" className="monitoring-content2-icon" />
          <div className="monitoring-content2-text">
            <p>체온</p>
            {temperature !== null ? <p2>{temperature}°C</p2> : <p2>측정 전</p2>}
          </div>
        </div>
        <div className="monitoring-content2-div">
          <img src="/img/heartrate.png" alt="heartrate" className="monitoring-content2-icon" />
          <div className="monitoring-content2-text">
            <p>심박수</p>
            {bloodPressure !== null ? <p2>{bloodPressure}bpm</p2> : <p2>측정 전</p2>}
          </div>
        </div>
        <div className="monitoring-content2-div">
          <img src="/img/oximeter.png" alt="oximeter" className="monitoring-content2-icon" />
          <div className="monitoring-content2-text">
            <p>산소 포화도</p>
            {spo2 !== null ? <p2>{spo2}%</p2> : <p2>측정 전</p2>}
          </div>
        </div>
      </div>
      <footer className="monitoring-footer">
        Ⓒ 안전하조. 캡스톤 디자인 프로젝트
      </footer>
    </div>
  );
};

export default MonitoringScreen;