import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Monitoring.css';

const MonitoringScreen = () => {
  const [step, setStep] = useState(0); // 0단계로 초기화
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

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const url = 'http://localhost:8080/fingerprint';
        const response = await axios.get(url);
        // 응답이 성공적으로 왔을 때
        if (response.status === 200) {
          // 응답 데이터에서 사용자 ID 추출
          const data = response.data;
          // 사용자 ID 설정
          setUserId(data.userId);
          // 콘솔에 가져온 사용자 ID 표시
          console.log('Fetched user ID:', data.userId);
        } else {
          // 응답이 실패했을 때 에러 처리
          console.error('Failed to fetch user ID');
        }
      } catch (error) {
        // 네트워크 오류 등에 대한 예외 처리
        console.error('Error fetching user ID:', error);
      }
    };
    // 컴포넌트가 마운트될 때 한 번만 사용자 ID 요청을 보냄
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
    if (step === 4 || step === 5 || step === 6) {
      const timer = setTimeout(() => {
        resetStatesAndScan();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const startGuidance = () => {
    setStep(0); // 0단계로 시작
  };

  useEffect(() => {
    startGuidance();
  }, []);

  const scanFingerprint = () => {
    setFingerprintScanComplete(true);
    axios.get(`http://localhost:8080/user/fingerprint`)
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
          // UserInfo 객체나 userImage 속성이 존재하지 않는 경우에 대한 처리
          // 예를 들어 기본 이미지를 설정하거나 에러를 처리할 수 있습니다.
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
    setStep(1); // 1단계로 변경
  };

  const formatTime = (time) => {
    const hour = time.getHours().toString().padStart(2, '0');
    const minute = time.getMinutes().toString().padStart(2, '0');
    const second = time.getSeconds().toString().padStart(2, '0');
    return `${hour}:${minute}:${second}`;
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
            <p>오늘 출근 및 퇴근절차가 완료되었습니다.</p>
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
      setStep(3); 
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

      axios.post('http://localhost:8080/user/go', {
        userNo: employeeID,
        userDrink: alcoholLevel,
        userHeartRate: heartRate,
        userTemp: temperature,
        date: formatDate(new Date()), 
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
    return date.toISOString().split('T')[0];
  };

  // 0단계 버튼 클릭 시 호출되는 함수
  const handleScanButtonClick = () => {
    // 버튼 클릭 시 1단계로 이동
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