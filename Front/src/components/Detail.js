import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Detail.css';
import { userApiBaseUrl } from './Api';
import axios from 'axios';

function Detail() {
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
  
      // 프로필 정보 업데이트 요청 보내기
      axios.patch(`${userApiBaseUrl}/update/${inputFields.id}`, {
        userNo: inputFields.id,
        userName: inputFields.name,
        userImage: inputFields.name, // 이미지 정보는 여기서 추가해야 할 듯
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
        // 기타 필요한 필드들도 추가해야 합니다.
      })
      .then(response => {
        console.log('프로필 업데이트 요청 성공:', response.data);
        // 서버로부터 성공적인 응답을 받았을 때 추가적인 작업 수행 가능
      })
      .catch(error => {
        console.error('프로필 업데이트 요청 실패:', error);
        // 서버로부터 오류 응답을 받았을 때 추가적인 처리 가능
      });
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
                  <th>심박수</th>
                  <th>산소포화도</th>
                  <th>상태</th>
                  <th>비고</th>
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