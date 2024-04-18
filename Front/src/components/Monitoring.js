import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Monitoring.css';

const MonitoringScreen = () => {
  const [step, setStep] = useState(1);
  const [temperature, setTemperature] = useState(null);
  const [bloodPressure, setBloodPressure] = useState(null);
  const [alcoholLevel, setAlcoholLevel] = useState(null);
  const [fingerprintScanComplete, setFingerprintScanComplete] = useState(false);
  const [employeeID, setEmployeeID] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeImage, setEmployeeImage] = useState(''); 
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [code, setCode] = useState(null); // code 상태 추가

  const startGuidance = () => {
    setStep(1); // 지문 스캔 단계로 초기화
  };

  useEffect(() => {
    startGuidance();
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
    if (step === 4 || step === 5) {
      const timer = setTimeout(() => {
        resetStatesAndScan();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const scanFingerprint = () => {
    setFingerprintScanComplete(true);
    axios.get(`http://localhost:8080/user/fingerprint`)
      .then(response => {
        const { code, UserInfo, userProfile } = response.data; // 서버 응답에서 code 값 가져오기
        setCode(code); // code 값 설정
        const { userImage } = UserInfo;
        const { userName, userNo } = userProfile;
        setEmployeeID(userNo);
        setEmployeeName(userName);
        setEmployeeImage(userImage); 
        if (code === 102) {
          resetStatesAndScan();
        } else if(code === 101) {
          setStep(4);
        } else if (code === 103) {
          setStep(2);
        }
      })
      .catch(handleError);
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
    setEmployeeID(''); // 사원번호 초기화
    setEmployeeName(''); // 이름 초기화
    setEmployeeImage(''); // 이미지 초기화
    setCode(null); // code 초기화
    setStep(1);
  };

  const formatTime = (time) => {
    const hour = time.getHours().toString().padStart(2, '0');
    const minute = time.getMinutes().toString().padStart(2, '0');
    //const second = time.getSeconds().toString().padStart(2, '0');
    return `${hour}시 ${minute}분`;
  };

  const renderStep = () => {
    switch (step) {
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
      setAlcoholLevel(alcoholLevel);
      setStep(3); // 변경된 부분: step을 5로 변경
    } catch (error) {
      console.error('Error measuring alcohol level:', error);
    }
  };

  const measureTemperatureAndBloodPressure = async () => {
    try {
      const { temperature, heartRate } = await fetchTemperatureAndHeartRate(employeeID);
      setTemperature(temperature);
      setBloodPressure(heartRate);
      setStep(5); // 변경된 부분: step을 5로 변경

      // 출근 등록 요청 보내기
      axios.post('http://localhost:8080/user/go', {
        userNo: employeeID,
        userDrink: alcoholLevel,
        userHeartRate: heartRate,
        userTemp: temperature,
        date: formatDate(new Date()), // ISO 8601 형식으로 변환된 날짜 전송
        userStart: formatTime(currentTime)
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
    return axios.get(`http://localhost:8080/user/drink`)
      .then(response => {
        return response.data.userDrink;
      })
      .catch(error => {
        console.error('Error fetching alcohol level:', error);
        return null;
      });
  };

  const fetchTemperatureAndHeartRate = (id) => {
    return axios.get(`http://localhost:8080/user/tempheart`)
      .then(response => {
        const { userTemp, userHeartRate } = response.data;
        return { temperature: userTemp, heartRate: userHeartRate };
      })
      .catch(error => {
        console.error('Error fetching temperature and heart rate:', error);
        return { temperature: null, heartRate: null };
      });
  };

  const formatDate = (date) => {
    // 현재 날짜를 ISO 8601 형식으로 변환
    return date.toISOString().split('T')[0];
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
            {bloodPressure !== null ? <p2>혈압: {bloodPressure}mmHg</p2> : <p2>측정 전</p2>}
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