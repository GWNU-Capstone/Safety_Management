import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Monitoring.css';

const MonitoringScreen = () => {
  const [step, setStep] = useState(0);
  const [temperature, setTemperature] = useState(null);
  const [alcoholLevel, setAlcoholLevel] = useState(null);
  const [fingerprintScanComplete, setFingerprintScanComplete] = useState(false);
  const [alcoholScanComplete, setAlcoholScanComplete] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [isGuidanceStarted, setIsGuidanceStarted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (step < 6) {
        setStep(prevStep => prevStep + 1);
      } else {
        clearInterval(interval);
      }
    }, 7000);
    
    return () => clearInterval(interval);
  }, [step]);

  const startGuidance = () => {
    setIsGuidanceStarted(true);
    speakStepGuide(); // 안내 시작
  };

  const scanFingerprint = () => {
    setFingerprintScanComplete(true);
    setStep(2);
  };

  const measureTemperature = () => {
    const randomTemperature = Math.floor(Math.random() * (40 - 35 + 1)) + 35;
    setTemperature(randomTemperature);
    setStep(4);
  };

  const measureAlcoholLevel = () => {
    const randomAlcoholLevel = Math.floor(Math.random() * (0.1 - 0.0 + 0.01)) + 0.0;
    setAlcoholLevel(randomAlcoholLevel);
    setStep(6);
  };

  const speak = (text) => {
    const speechSynthesis = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel();
    setCurrentUtterance(utterance);
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
          speak('지문 스캔이 완료되었습니다. 이제 체온을 측정합니다.');
        }
        break;
      case 3:
        speak('지문 인식기 옆에 체온 센서에 가까이 와주시길 바랍니다.');
        break;
      case 4:
        if (temperature === null) {
          speak('체온이 측정되지 않았습니다. 다시 시도해주세요.');
        } else {
          speak(`체온 측정이 완료되었습니다. 현재 체온은 ${temperature}도 입니다.`);
        }
        break;
      case 5:
        speak('이제 알코올 농도를 측정합니다. 붙어 주시길 바랍니다.');
        break;
      case 6:
        if (alcoholLevel === null) {
          speak('알코올 농도가 측정되지 않았습니다. 다시 시도해주세요.');
        } else {
          speak(`알코올 농도 측정이 완료되었습니다. 현재 알코올 농도는 ${alcoholLevel} 입니다.`);
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
  }, [step, temperature, alcoholLevel, isGuidanceStarted]);

  const resetMeasurement = () => {
    setStep(0);
    setTemperature(null);
    setAlcoholLevel(null);
    setFingerprintScanComplete(false);
    setAlcoholScanComplete(false);
    setIsGuidanceStarted(false);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div>
            <p>단계 0: 시작 중...</p>
          </div>
        );
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
            <p>체온 측정으로 진행 중...</p>
            <button onClick={measureTemperature}>체온 측정 시작</button>
          </div>
        );
      case 3:
        return (
          <div>
            <p>단계 3: 체온 측정 중...</p>
            <p>지문 인식기 옆에 체온 센서에 가까이 와주시길 바랍니다.</p>
          </div>
        );
      case 4:
        return (
          <div>
            <p>단계 4: 체온 측정 완료!</p>
            <p>체온: {temperature !== null ? `${temperature}°C` : '--'}</p>
            <button onClick={measureAlcoholLevel}>알코올 농도 측정 시작</button>
          </div>
        );
      case 5:
        return (
          <div>
            <p>단계 5: 알코올 농도 측정 중...</p>
            <p>입에 붙어 주시길 바랍니다.</p>
          </div>
        );
      case 6:
        return (
          <div>
            <p>단계 6: 알코올 농도 측정 완료!</p>
            <p>알코올 농도: {alcoholLevel !== null ? alcoholLevel : '--'}</p>
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
      <Link to="/main" className="logo-container">
        <img src="/img/capston_title.png" alt="로고"/>
      </Link>

      <div className="info-container">
        <div className="square">
          <div className="info-box-1"></div>
          <div className="info-box-2"></div>
          <div className="info-box-3"></div>
          <div className="info-box-4"></div>
          <div className="info-box-5"></div>
          <div className="info-box-6"></div>
        </div>
      </div>

      <div className="help-container">
        {renderStep()}
        {!isGuidanceStarted && <button onClick={startGuidance}>안내 시작</button>}
      </div>
    </div>
  );
};

export default MonitoringScreen;