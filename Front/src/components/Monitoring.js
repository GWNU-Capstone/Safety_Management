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
  const [isGuidanceStarted, setIsGuidanceStarted] = useState(false);
  const [randomEmployeeID, setRandomEmployeeID] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [errorSpoken, setErrorSpoken] = useState(false); // Add state for tracking error spoken status

  const startGuidance = () => {
    setIsGuidanceStarted(true);
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

  const scanFingerprint = () => {
    setFingerprintScanComplete(true);
    const id = Math.floor(Math.random() * 6) + 1;
    setRandomEmployeeID(id);
    axios.get(`http://localhost:8080/user/fingerprint`)
      .then(response => {
        const { code, UserInfo, userProfile } = response.data;
        const { userImage } = UserInfo;
        const { userName, userNo } = userProfile;
        setEmployeeID(userNo);
        setEmployeeName(userName);
        setEmployeeImage(userImage); 
        if (code === 101 || code === 102) {
          resetStatesAndScan(); // Reset states and restart scanning
        } else if (code === 103) {
          speak("출근 절차를 진행합니다.");
          setStep(2);
        }
      })
      .catch(handleError);
  };

  const handleError = (error) => {
    console.error('Error fetching employee data:', error);
    if (!errorSpoken) {
      speak("서버 오류가 발생했습니다. 지문 스캔을 다시 진행합니다.");
      setErrorSpoken(true); // Set errorSpoken to true after speaking error message
    }
    resetStatesAndScan(); // Reset states and restart scanning
  };

  const resetStatesAndScan = () => {
    setFingerprintScanComplete(false);
    setAlcoholLevel(null);
    setTemperature(null);
    setBloodPressure(null);
    setIsGuidanceStarted(false);
    setStep(1);
    scanFingerprint(); // Restart fingerprint scanning
  };

  const formatTime = (time) => {
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();
    return `${hour}시 ${minute}분 ${second}초`;
  };
  

  const speak = (text) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const speakStepGuide = () => {
    switch (step) {
      case 1:
        speak('지문 스캔을 시작합니다. 지문 센서에 가까이 와주시길 바랍니다.');
        break;
      case 2:
        if (!fingerprintScanComplete) {
          speak('지문 스캔이 완료되지 않았습니다. 다시 시도해주세요.');
        } else {
          speak('지문 스캔이 완료되었습니다. 이제 알코올 농도를 측정합니다.');
        }
        break;
      case 3:
        speak('알코올 농도를 측정합니다. 입에 붙어 주시길 바랍니다.');
        break;
      case 4:
        if (alcoholLevel === null) {
          speak('알코올 농도가 측정되지 않았습니다. 다시 시도해주세요.');
        } else {
          speak(`알코올 농도 측정이 완료되었습니다. 현재 알코올 농도는 ${alcoholLevel} 입니다. 이제 체온과 혈압을 측정합니다.`);
        }
        break;
      case 5:
        speak('체온과 혈압을 측정합니다. 지문 인식기 옆에 체온 센서와 혈압 측정기에 가까이 와주시길 바랍니다.');
        break;
      case 6:
        if (temperature === null || bloodPressure === null) {
          speak('체온 또는 혈압이 측정되지 않았습니다. 다시 시도해주세요.');
        } else {
          speak(`체온과 혈압 측정이 완료되었습니다. 현재 체온은 ${temperature}도이며 혈압은 ${bloodPressure}mmHg입니다.`);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isGuidanceStarted) {
      speakStepGuide();
    }
  }, [step, temperature, bloodPressure, alcoholLevel, isGuidanceStarted]);

  const registerAttendance = () => {
    const requestData = {
      userNo: employeeID,
      userDrink: alcoholLevel,
      userHeartRate: bloodPressure,
      userTemp: temperature,
      date: currentDate,
      userStart: formatTime(currentTime)
    };
  
    axios.post('http://localhost:8080/user/go', requestData)
      .then(response => {
        console.log('Attendance registered successfully:', response.data);
      })
      .catch(error => {
        console.error('Error registering attendance:', error);
        if (!errorSpoken) {
          speak("서버 오류가 발생했습니다. 출퇴근 정보 등록에 실패했습니다.");
          setErrorSpoken(true); // Set errorSpoken to true after speaking error message
        }
      });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <p>단계 1: 지문 스캔 중...</p>
            <p>지문 센서에 가까이 와주시길 바랍니다.</p>
            <button onClick={scanFingerprint}>지문 스캔 시작</button>
          </div>
        );
      case 2:
        return (
          <div>
            <p>단계 2: 지문 스캔 완료!</p>
            <p>알코올 농도 측정으로 진행 중...</p>
            <button onClick={measureAlcoholLevel}>알코올 농도 측정 시작</button>
          </div>
        );
      case 3:
        return (
          <div>
            <p>단계 3: 알코올 농도 측정 중...</p>
            <p>입에 붙어 주시길 바랍니다.</p>
          </div>
        );
      case 4:
        return (
          <div>
            <p>단계 4: 알코올 농도 측정 완료!</p>
            <p>알코올 농도: {alcoholLevel !== null ? alcoholLevel : '--'}</p>
            <button onClick={measureTemperatureAndBloodPressure}>체온 및 혈압 측정 시작</button>
          </div>
        );
      case 5:
        return (
          <div>
            <p>단계 5: 체온과 혈압 측정 중...</p>
            <p>지문 인식기 옆에 체온 센서와 혈압 측정기에 가까이 와주시길 바랍니다.</p>
          </div>
        );
      case 6:
        return (
          <div>
            <p>단계 6: 체온 및 혈압 측정 완료!</p>
            <p>체온: {temperature !== null ? `${temperature}°C` : '--'}</p>
            <p>혈압: {bloodPressure !== null ? `${bloodPressure}mmHg` : '--'}</p>
            <button onClick={registerAttendance}>출근 등록</button>
          </div>
        );
      case 7:
        return (
          <div>
            <p>출근 및 퇴근 절차가 완료되었습니다.</p>
            <button onClick={resetMeasurement}>다음 사람</button>
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

  const resetMeasurement = () => {
    setStep(1);
    setTemperature(null);
    setBloodPressure(null);
    setAlcoholLevel(null);
    setFingerprintScanComplete(false);
    setIsGuidanceStarted(false);
    setEmployeeID('');
    setEmployeeName('');
    setEmployeeImage('');
    setRandomEmployeeID(null);
  };

  const measureAlcoholLevel = async () => {
    try {
      const alcoholLevel = await fetchAlcoholLevel(randomEmployeeID);
      setAlcoholLevel(alcoholLevel);
      setStep(4);
    } catch (error) {
      console.error('Error measuring alcohol level:', error);
    }
  };

  const measureTemperatureAndBloodPressure = async () => {
    try {
      const { temperature, heartRate } = await fetchTemperatureAndHeartRate(randomEmployeeID);
      setTemperature(temperature);
      setBloodPressure(heartRate);
      setStep(6);
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

  return (
    <div className="monitoring-container">
      <div className="logo-container">
        <Link to="/main">
          <img src="/img/capston_title.png" alt="로고"/>
        </Link>
      </div>

      <div className="info-container">
        <div className="square">
        <div className="info-box-1" style={{ width: '100%', height: '100%' }}>
          {fingerprintScanComplete ? (
            <img src="/img/1.png" alt="Employee" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#000' }}>
            </div>
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