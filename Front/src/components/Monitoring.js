import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Monitoring.css';

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

  const fingerprintApiBaseUrl = 'http://hj020711.iptime.org:5050';
  const userApiBaseUrl = 'http://localhost:8080';

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const url = `${fingerprintApiBaseUrl}/fingerprint`;
        const response = await axios.get(url);
        if (response.status === 200) {
          const data = response.data;
          setUserId(data);
          console.log('Fetched user ID:', data);
        } else {
          console.error('Failed to fetch user ID');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
        setUserId(null);
      }
    };
    fetchUserId();
  }, []);   

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
    else if(step === 2) {
      measureAlcoholLevel();
    }
  }, [step]);

  const startGuidance = () => {
    setStep(0);
  };

  useEffect(() => {
    startGuidance();
  }, []);

  const scanFingerprint = () => {
    if (userId) {
      setFingerprintScanComplete(true);
      axios.get(`${userApiBaseUrl}/user/fingerprint/${userId}`)
        .then(response => {
          const { code, UserInfo, userProfile } = response.data; 
          setCode(code); 
          if (UserInfo && UserInfo.userImage) { 
            const { userImage } = UserInfo;
            const { userName, userNo } = userProfile;
            setEmployeeID(userNo);
            setEmployeeName(userName);
            setEmployeeImage(userImage); 
          } else {
            // Handle case where UserInfo object or userImage property does not exist
          }
          if (code === 102) {
            resetStatesAndScan();
            setStep(6);
          } else if(code === 101) {
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
            <p>버튼을 누르면 지문 측정이 시작됩니다.</p>
            <button onClick={handleScanButtonClick}>지문 스캔 시작</button>
          </div>
        );
      case 1:
        return (
          <div>
            <p>지문 스캔 중...</p>
            <p>지문 센서에 가까이 와주시길 바랍니다.</p>
            <button onClick={scanFingerprint}>지문 스캔 시작</button>
          </div>
        );
      case 2:
        return (
          <div>
            <p>알코올 농도 측정 중...</p>
            <p>입에 붙어 주시길 바랍니다.</p>
            <button onClick={measureAlcoholLevel}>알코올 농도 측정 시작</button>
          </div>
        );
      case 3:
        return (
          <div>
            <p>체온 및 혈압 측정 중...</p>
            <p>체온 센서, 혈압 측정기에 오시길 바랍니다.</p>
            <button onClick={measureTemperatureAndBloodPressure}>체온 및 혈압 측정 시작</button>
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
            <p>오늘 출근과 퇴근절차가 완료되었습니다.</p>
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
      const alcoholLevel = await fetchAlcoholLevel(employeeID);
      if (alcoholLevel !== null) {
        setAlcoholLevel(alcoholLevel);
        setStep(3); 
      }
    } catch (error) {
      console.error('Error measuring alcohol level:', error);
    }
  };

  const measureTemperatureAndBloodPressure = async () => {
    try {
      const { temperature, heartRate } = await fetchTemperatureAndHeartRate(employeeID);
      setTemperature(temperature);
      setBloodPressure(heartRate);
      setStep(5); 

      axios.post(`${userApiBaseUrl}/user/go`, {
        userNo: employeeID,
        userDrink: alcoholLevel,
        userHeartRate: heartRate,
        userTemp: temperature
      })
      .then(response => {
        console.log('출근 등록 성공:', response.data);
      })
      .catch(error => {
        console.error('출근 등록 실패:', error);
      });
    } catch (error) {
      console.error('Error measuring temperature and blood pressure:', error);
    }
  };

  const fetchAlcoholLevel = (id) => {
    return axios.get(`${fingerprintApiBaseUrl}/drink`)
      .then(response => {
        const alcoholLevel = response.data;
        if (alcoholLevel !== null) {
          return alcoholLevel;
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
        const { userTemp, userHeartRate } = response.data;
        return { temperature: userTemp, heartRate: userHeartRate };
      })
      .catch(error => {
        console.error('Error fetching temperature and heart rate:', error);
        return { temperature: null, heartRate: null };
      });
  };

  const handleScanButtonClick = () => {
    setStep(1);
  };

  return (
    <div className="monitoring-container">
      <div className="logo-container">
        <Link to="/main">
          <img src="/img/capston_title.png" alt="로고"/>
        </Link>
      </div>

      <div className="info-container">
        <div className="square">
          <div className="info-box-1">
            {fingerprintScanComplete ? (
              <img src="/img/1.png" alt="Employee" />
            ) : (
              <div className="placeholder"></div>
            )}
          </div>

          <div className="info-box-2">
            {fingerprintScanComplete && employeeID ? (
              <p>사원번호: {employeeID}</p>
            ) : (
              <p>사원번호: 측정 전</p>
            )}
            {fingerprintScanComplete && employeeName ? (
              <p>이름: {employeeName}</p>
            ) : (
              <p>이름: 측정 전</p>
            )}
          </div>

          <div className="info-box-3">
            <img src="/img/alcoholic.png" alt="alcoholic"/>
            <p>Blood Alcohol Content</p>
            {alcoholLevel !== null ? <p2>알코올 농도: {alcoholLevel}</p2> : <p2>측정 전</p2>}
          </div>

          <div className="info-box-4">
            <img src="/img/thermometer.png" alt="thermometer"/>
            <p>Temperature</p>
            {temperature !== null ? <p2>체온: {temperature}°C</p2> : <p2>측정 전</p2>}
          </div>

          <div className="info-box-5">
            <img src="/img/heartrate.png" alt="heartrate"/>
            <p>Heart Rate</p>
            {bloodPressure !== null ? <p2>심박수: {bloodPressure}mmHg</p2> : <p2>측정 전</p2>}
          </div>
        </div>
      </div>

      <div className="help-container">
        <div className="help-square">
          <div className="help-1">
            <p>{renderStep()}</p>
          </div>

          <div className="help-2">
            <p>{currentDate}</p>
            <p2>{formatTime(currentTime)}</p2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringScreen;