import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Detail.css';

function Detail() {
  const [editMode, setEditMode] = useState(false);
  const [inputFields, setInputFields] = useState({
    name: 'Test',
    age: '25',
    gender: '남',
    ssn: '000101-3111111',
    id: '1',
    phone: '123-456-7890',
    email: 'test@example.com',
    address: '강원도 원주시 테스트 테스트 1001 (26400)',
    pos: 'Owner',
    empDate: '2024-01-01',
    bank: '농협',
    account: '000-0000-0000-00'
  });

  const handleEditProfile = () => {
    // editMode가 true에서 false로 바뀔 때 상태를 업데이트합니다.
    if (editMode) {
      // profile-name 클래스를 가진 h2 요소의 현재 텍스트 내용을 가져와서
      // inputFields의 name에 저장합니다.
      const newName = document.querySelector('.profile-name').textContent;
      setInputFields(prevFields => ({
        ...prevFields,
        name: newName
      }));
    }
    setEditMode(!editMode);
  };

  const handleInputChange = (key, value) => {
    setInputFields({
      ...inputFields,
      [key]: value
    });
  };

  const fixedLabels = {
    id: '사원번호',
    age: '연령',
    gender: '성별',
    ssn: '주민등록번호',
    phone: '전화번호',
    email: '이메일',
    address: '주소',
    bank: '은행',
    account: '계좌번호',
    pos: '직위',
    empDate: '입사일자'
  };

  const attendanceRecords = [
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', oxy: '??', status: 'Present', note: ''}
  ];

  return (
    <div className="detail-container">
      <header className="header">
        <div className="logo-section">
          <Link to="/main">
            <img src="/img/capston_title.png" alt="logo" className="detail-logo" />
          </Link>
        </div>
        <div className="edit-profile-section">
          <button className="edit-profile-btn" onClick={handleEditProfile}>
            {editMode ? 'Save' : 'Edit Profile'}
          </button>
        </div>
      </header>

      <div className="main-content">

        <div className="profile">
          <div className="profile-img">
            <img src="/path/to/profile-image.jpg" alt="P" className="user-profile-img" />
          </div>

          <h2
            className={`profile-name ${editMode ? "editable" : ""}`}
            contentEditable={editMode}
            suppressContentEditableWarning={true}
          >
            {inputFields.name || '이름 입력...'}
          </h2>

          <div className="personal-info">
            <h2>Personal Information</h2>
            <div className="info">
              <table>
                <tbody>
                  {Object.entries(inputFields).map(([key, value]) => (
                    key !== "name" && ( // name 키를 제외하고 나머지를 매핑합니다.
                      <tr key={key}>
                        <th>{fixedLabels[key]}</th>
                        <td>
                          {editMode ? (
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => handleInputChange(key, e.target.value)}
                              placeholder="데이터를 입력하세요"
                            />
                          ) : (
                            <span>{value || "데이터를 입력하세요"}</span>
                          )}
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="attendance-records">
          <h2>Attendance Records</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>날짜</th>
                  <th>출근시간</th>
                  <th>퇴근시간</th>
                  <th>알코올 농도</th>
                  <th>체온</th>
                  <th>산소포화도</th>
                  <th>상태</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {attendanceRecords.map((record, index) => (
                  <tr key={index}>
                    <td>{record.date}</td>
                    <td>{record.enter}</td>
                    <td>{record.exit}</td>
                    <td>{record.bac}%</td>
                    <td>{record.temp}°C</td>
                    <td>{record.oxy}</td>
                    <td>{record.status}</td>
                    <td>{record.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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

export default Detail;
