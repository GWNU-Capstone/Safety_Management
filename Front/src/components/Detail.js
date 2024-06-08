import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Detail.css';
import { userApiBaseUrl } from './Api';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Detail() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeSection2, setActiveSection2] = useState('main');
  const [isMemoEditing, setIsMemoEditing] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

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
    account: '',
    memo: ''  // 메모 내용을 저장할 상태
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
          account: data.userAccount,
          memo: data.memo 
        });
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, [id]);

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
        userName: newName,
        userImage: newName,  // 이미지 정보 업데이트
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
        memo: inputFields.memo 
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
    empDate: '입사일자',
    memo: '메모'  // 추가된 메모 레이블
  };

  useEffect(() => {
    if (inputFields.id) {
      console.log(inputFields.id);
      axios.get(`${userApiBaseUrl}/user/data/${inputFields.id}`)
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
          console.log(newData);
          setAttendanceRecords(newData);
          console.log(attendanceRecords);
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, [inputFields.id]);  

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
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="시작일"
              dateFormat="yyyy-MM-dd"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="종료일"
              dateFormat="yyyy-MM-dd"
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
                            key === 'gender' ? ( // Check if the current field is gender
                              <select
                                value={inputFields.gender}
                                onChange={(e) => handleInputChange('gender', e.target.value)}
                              >
                                <option value="">성별을 선택하시오.</option>
                                <option value="남자">남자</option>
                                <option value="여자">여자</option>
                              </select>
                            ) : key === 'pos' ? ( // Check if the current field is position
                              <select
                                value={inputFields.pos}
                                onChange={(e) => handleInputChange('pos', e.target.value)}
                              >
                                <option value="">직위를 선택하세요.</option>
                                <option value="현장 관리자">현장 관리자</option>
                                <option value="기술자">기술자</option>
                                <option value="일용직">일용직</option>
                                <option value="사무원">사무원</option>
                                <option value="안전 감독관">안전 감독관</option>
                              </select>
                            ) : key === 'memo' ? ( // Check if the current field is memo
                              <textarea
                                value={value}
                                onChange={(e) => handleInputChange('memo', e.target.value)}
                                placeholder="메모를 입력하세요."
                                style={{ backgroundColor: editMode ? '#e7f4ff' : 'transparent', border: editMode ? '1px dashed #007bff' : 'transparent' }}
                              />
                            ) : (
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => handleInputChange(key, e.target.value)}
                                placeholder="데이터를 입력하세요"
                              />
                            )
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
        </div>

        <div className="attendance-records">
          <div className="personal-info-div">
            <h2>Attendance Records</h2>
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
                    const recordDate = new Date(record.date);
                    const adjustedStartDate = startDate ? new Date(startDate) : null;
                    const adjustedEndDate = endDate ? new Date(endDate) : null;
                    if (adjustedStartDate && adjustedEndDate) {
                      recordDate.setHours(0, 0, 0, 0); // 시간을 자정으로 설정합니다
                      adjustedStartDate.setHours(0, 0, 0, 0);
                      adjustedEndDate.setHours(0, 0, 0, 0);
                      return recordDate >= adjustedStartDate && recordDate <= adjustedEndDate;
                    } else {
                      // If either start date or end date is not set, show all records
                      return true;
                    }
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
