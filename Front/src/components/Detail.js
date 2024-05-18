import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Detail.css';
import { userApiBaseUrl } from './Api';
import axios from 'axios';

function Detail() {
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection2, setActiveSection2] = useState('main');
  const [filterMode, setFilterMode] = useState(true);
  const [memo, setMemo] = useState(''); // 메모 내용을 저장할 상태
  const [isMemoEditing, setIsMemoEditing] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);




  const toggleFilterMode = () => {
    setFilterMode(!filterMode);
    setActiveSection2(filterMode ? 'filtering' : 'main');  // 조건에 따라 섹션 설정
  };

  const [inputFields, setInputFields] = useState({
    name: '',
    age: '',
    gender: '',
    ssn: '',
    id: '',
    phone: '',
    email: '',
    address: '',
    pos: '',
    empDate: '',
    bank: '',
    account: ''
  });

  const { id } = useParams();

  useEffect(() => {
    axios.get(`${userApiBaseUrl}/detail/${id}`)
      .then(response => {
        const data = response.data;
        setInputFields({
          name: data.userName,
          age: data.userAge,
          gender: data.userGender,
          ssn: data.userResidentNum,
          id: data.userNo,
          phone: data.userTelNo,
          email: data.userEmail,
          address: data.userAddress,
          pos: data.userPosition,
          empDate: data.userJoinDate,
          bank: data.userBank,
          account: data.userAccount
        });
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, [id]);

  const handleMemoChange = (e) => {
    setMemo(e.target.value);
  };

  const handleEditProfile = () => {
    // 편집 모드가 비활성화된 경우 (편집 시작)
    if (!editMode) {
      setEditMode(true);
      setIsMemoEditing(true);  // 메모 편집도 활성화
    } else {
      // 편집 모드가 활성화된 경우 (저장 로직)
      const newName = document.querySelector('.profile-name').textContent;
      setInputFields(prevFields => ({
        ...prevFields,
        name: newName
      }));

      // 프로필 정보와 메모 데이터 업데이트 요청
      axios.patch(`${userApiBaseUrl}/update/${inputFields.id}`, {
        userNo: inputFields.id,
        userName: inputFields.name,
        userImage: inputFields.name,  // 이미지 정보 업데이트
        userResidentNum: inputFields.ssn,
        userAge: inputFields.age,
        userTelNo: inputFields.phone,
        userGender: inputFields.gender,
        userPosition: inputFields.pos,
        userEmail: inputFields.email,
        userAddress: inputFields.address,
        userBank: inputFields.bank,
        userAccount: inputFields.account,
        userJoinDate: inputFields.empDate,
        memo: memo  // 메모 데이터 추가
      })
        .then(response => {
          console.log('프로필 업데이트 요청 성공:', response.data);
        })
        .catch(error => {
          console.error('프로필 업데이트 요청 실패:', error);
        });

      // 편집 모드와 메모 편집 상태 해제
      setEditMode(false);
      setIsMemoEditing(false);
    }
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

  useEffect(() => {
    axios.get(`http://localhost:8080/user/data/${inputFields.id}`)
      .then(response => {
        const userData = response.data;
        const newData = Object.values(userData).map(item => {
          return {
            date: item.userData.date,
            enter: item.userData.userStart,
            exit: item.userData.userEnd,
            bac: `${item.userData.userDrink}`,
            temp: `${item.userData.userTemp}`,
            hr: `${item.userData.userHeartRate}`,
            oxy: `${item.userData.userOxygen}`,
            status: item.state
          };
        });
        setAttendanceRecords(prevRecords => [...prevRecords, ...newData]);
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, [inputFields.id]);

  /*
  const attendanceRecords = [
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''},
    { date: '2024-01-01', enter: '14:00', exit: '20:20', bac: '0.01', temp: '36.5', hr: '??', oxy: '??', status: 'Present', note: ''}
  ];
  */

  return (
    <div className="detail-container">
      <header className="detail-header">
        <div className="logo-section">
          <Link to="/main">
            <img src="/img/capstone_title.png" alt="logo" className="detail-logo" />
          </Link>
        </div>


        <div className="detail-rightSection">
          <div className="edit-profile-section">
            <button className="edit-profile-btn" onClick={handleEditProfile}>
              {editMode ? 'Save' : 'Edit Profile'}
            </button>
          </div>

          <div className="detail-search">
            <div className="detail-search-container">
              <img src="/img/search.png" alt="icon" className="detail-search-icon" />
              <h> 데이터 검색</h>
            </div>
            <input
              type="text"
              placeholder="데이터를 입력하세요."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              title="날짜 또는 상태를 입력하세요."
            />
          </div>

          <div className="detail-header-menu">
            <div className="detail-menu-wrapper">
              <Link to="/member" className="detail-menu-item">
                <img src="/img/member.png" alt="member" className="detail-menu-icon" />
                <span>직원 관리</span>
              </Link>

              <Link to="/statistics" className="detail-menu-item">
                <img src="/img/statistics.png" alt="statistics" className="detail-menu-icon" />
                <span>통계</span>
              </Link>

              <Link to="/monitoring" className="detail-menu-item">
                <img src="/img/monitoring.png" alt="monitoring" className="detail-menu-icon" />
                <span>모니터링</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="main-content">

        <div className="profile">
          <div className="profile-info">
            <div className="profile-img">
              <img src="/img/user.png" alt="" className="user-profile-img" />
            </div>

            <h2
              className={`profile-name ${editMode ? "editable" : ""}`}
              contentEditable={editMode}
              suppressContentEditableWarning={true}
            >
              {inputFields.name || '이름 입력...'}
            </h2>
          </div>

          <div className="personal-info">
            <div className="personal-info-div">
              <h2>Personal Information</h2>
            </div>
            <div className="personal-info-container">
              <div className="info">
                <table>
                  <tbody>
                    {Object.entries(inputFields).map(([key, value]) => (
                      key !== "name" && (
                        <tr key={key}>
                          <th>{fixedLabels[key]}</th>
                          <td>
                            {editMode && key !== 'id' ? (
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
                {isMemoEditing && editMode ? (
                  <textarea
                    value={memo}
                    onChange={handleMemoChange}
                    placeholder="메모를 입력하세요."
                    style={{ backgroundColor: editMode ? '#e7f4ff' : 'transparent', border: editMode ? '1px dashed #007bff' : 'transparent' }}
                  />
                ) : (
                  <p>{memo || "메모가 없습니다."}</p>
                )}
              </div>
            </div>
          </div>
          
        </div>

        <div className="attendance-records">
          <div className="personal-info-div">
            <h2>Attendance Records</h2>

            <div className="personal-info-button">
              <div className="attendance-button" onClick={toggleFilterMode}>
                {filterMode ? '필터링' : '전체보기'}
              </div>
            </div>
          </div>
          {activeSection2 === 'main' && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>출근시간</th>
                    <th>퇴근시간</th>
                    <th>알코올 농도</th>
                    <th>체온</th>
                    <th>심박수</th>
                    <th>산소포화도</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {attendanceRecords.filter((record) => {
                    return (
                      record.date.includes(searchTerm) ||
                      record.status.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                  }).map((record, index) => (
                    <tr key={index}>
                      <td>{record.date}</td>
                      <td>{record.enter}</td>
                      <td>{record.exit}</td>
                      <td>{record.bac}%</td>
                      <td>{record.temp}°C</td>
                      <td>{record.hr} bpm</td>
                      <td>{record.oxy}%</td>
                      <td>{record.status}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

          {activeSection2 === 'filtering' && (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>출근시간</th>
                    <th>퇴근시간</th>
                    <th>알코올 농도</th>
                    <th>체온</th>
                    <th>심박수</th>
                    <th>산소포화도</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {attendanceRecords.filter((record) => {
                    return (
                      record.date.includes(searchTerm) ||
                      record.status.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                  }).map((record, index) => (
                    <tr key={index} style={{ color: !filterMode ? 'red' : 'black' }}>
                      <td>{record.date}</td>
                      <td>{record.enter}</td>
                      <td>{record.exit}</td>
                      <td>{record.bac}%</td>
                      <td>{record.temp}°C</td>
                      <td>{record.hr} bpm</td>
                      <td>{record.oxy}%</td>
                      <td>{record.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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