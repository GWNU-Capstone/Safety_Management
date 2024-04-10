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
  const [randomEmployeeID, setRandomEmployeeID] = useState(null); // Define randomEmployeeID state

  useEffect(() => {
    startGuidance();
  }, []);

  const startGuidance = () => {
    setIsGuidanceStarted(true);
    //speakStepGuide();
  };

  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const dateString = now.toLocaleDateString('ko-KR', options);
      setCurrentDate(dateString);
    };

    // 페이지 로드될 때 한 번 실행
    updateDate();

    // 1초마다 날짜 업데이트
    const intervalId = setInterval(() => {
      updateDate();
    }, 1000);

    // 컴포넌트가 unmount될 때 interval 정리
    return () => clearInterval(intervalId);
  }, []);

  const [currentTime, setCurrentTime] = useState(new Date()); // 현재 시간 상태 변수 추가

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date()); // 현재 시간 갱신
    }, 1000); // 1초마다 갱신

    return () => clearInterval(intervalId); // 컴포넌트가 언마운트되면 setInterval 정리
  }, []);

  const formatTime = (time) => {
    return time.toLocaleTimeString('ko-KR', { hour12: false });
  };

  const scanFingerprint = () => {
    setFingerprintScanComplete(true);
    const id = Math.floor(Math.random() * 6) + 1; // 1부터 6까지의 랜덤 ID
    setRandomEmployeeID(id); // Update randomEmployeeID state
    axios.get(`http://localhost:8080/members/${id}`)
      .then(response => {
        const { UserInfo, userProfile } = response.data;
        const { userImage } = UserInfo;
        const { userName, userNoPk } = userProfile;
        setEmployeeID(userNoPk);
        setEmployeeName(userName);
        setEmployeeImage(userImage); 
      })
      .catch(error => {
        console.error('Error fetching employee data:', error);
      });
    setStep(2);
  };

  const fetchAlcoholLevel = (id) => {
    return axios.get(`http://localhost:8080/members/${id}/drink`)
      .then(response => {
        return response.data.userDrink;
      })
      .catch(error => {
        console.error('Error fetching alcohol level:', error);
        return null;
      });
  };

  const fetchTemperatureAndHeartRate = (id) => {
    return axios.get(`http://localhost:8080/members/${id}/tempHeart`)
      .then(response => {
        const { userTemp, userHeartRate } = response.data;
        return { temperature: userTemp, heartRate: userHeartRate };
      })
      .catch(error => {
        console.error('Error fetching temperature and heart rate:', error);
        return { temperature: null, heartRate: null };
      });
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
      //speakStepGuide();
    }
  }, [step, temperature, bloodPressure, alcoholLevel, isGuidanceStarted]);

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
    setRandomEmployeeID(null); // Reset randomEmployeeID state
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
              <img src="/img/1.png" alt="Employee" style={{ width: '100%', height: '100%' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}></div>
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

          <div className="help-2" /*onClick={handleNextStep}*/> 
            <p>다음 단계</p>
          </div>

          <div className="help-3">
            {!isGuidanceStarted && <button onClick={startGuidance}>안내 시작</button>}
            <p>{currentDate}</p>
            <p2>{formatTime(currentTime)}</p2>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MonitoringScreen;