import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { Link } from 'react-router-dom';
import './Member.css';
import { fingerprintApiBaseUrl, userApiBaseUrl } from './Api';
import axios from 'axios';


function Member() {
  // 데이터와 컬럼 정의
  const [membersData, setMembersData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [deleteId, setDeleteId] = useState('');
  const [employeeId, setEmployeeId] = useState(''); // 사원번호 상태 추가
  const [phonePart1, setPhonePart1] = useState('');
  const [phonePart2, setPhonePart2] = useState('');
  const [phonePart3, setPhonePart3] = useState('');

  const sortMembersData = (data) => {
    return data.slice().sort((a, b) => a.id - b.id);
  };

  // 사원번호 상태 초기화
  useEffect(() => {
    setEmployeeId('');
  }, [showRegistrationModal]); // 모달이 열릴 때마다 사원번호 상태 초기화

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${userApiBaseUrl}/user/all`);
        const userData = response.data.map(user => ({
          id: user.userNo,
          pos: user.userPosition,
          name: user.userName,
          age: user.userAge,
          gender: user.userGender,
          pNumber: user.userTelNo,
          email: user.userEmail,
          address: user.userAddress
        }));
        setMembersData(userData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  /*
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 여기서 데이터를 가져와서 membersData 상태에 설정
        const dummyData = [
          { id: 1, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 2, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 3, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 4, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 5, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 6, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 7, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 8, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 9, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 10, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 11, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 12, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 13, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 14, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 15, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 16, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 17, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 18, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 19, pos: 'Owner', name: '테스트2', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 20, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 21, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' },
          { id: 22, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)' }
        ];
        setMembersData(dummyData);
      } catch (error) {
        console.log("네트워크 오류 [Join]", error);
      }
    };

    fetchData();
  }, []);
  */
  const columns = React.useMemo(
    () => [
      {
        Header: '사원번호',
        accessor: 'id'
      },
      {
        Header: '직위',
        accessor: 'pos'
      },
      {
        Header: '이름',
        accessor: 'name'
      },
      {
        Header: '나이',
        accessor: 'age'
      },
      {
        Header: '성별',
        accessor: 'gender'
      },
      {
        Header: '전화번호',
        accessor: 'pNumber'
      },
      {
        Header: '이메일',
        accessor: 'email'
      },
      {
        Header: '주소',
        accessor: 'address'
      }
    ],
    []
  );

  // useTable 훅을 사용하여 테이블 생성
  const table = useTable({ columns, data: membersData });

  // 모달 열기/닫기 함수
  const toggleRegistrationModal = () => {
    setShowRegistrationModal(!showRegistrationModal);
  };

  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const handleFingerprintRegistration = async () => {
    try {
      const response = await axios.get(
        `${fingerprintApiBaseUrl}/fingerprint/add/?location=`
      );
      if (response.data.fingerprint_addresults.startsWith("Stored model at")) {
        const storedEmployeeId = response.data.fingerprint_addresults.match(/\d+/)[0];
        setEmployeeId(storedEmployeeId); // # 뒤에 있는 값을 추출하여 사원번호로 설정
      } else if (response.data.fingerprint_addresults === "False") {
        alert('지문 센서에 손을 올려주세요.');
      } else {
        // 다른 예외 상황에 대한 처리
      }
      console.log(response.data);
    } catch (error) {
      console.error('지문 등록 오류:', error);
      alert('지문 센서에 손을 올려주세요.');
    }
  };

  const handleFingerprintRemoval = async (location) => {
    try {
      const response = await axios.get(
        `${fingerprintApiBaseUrl}/fingerprint/rm/?location=${location}`
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error removing fingerprint:', error);
    }
  };

  const employeeRemoval = async (location) => {
    try {
      const response = await axios.delete(
        `${userApiBaseUrl}/delete/${location}`
      );
      console.log(response.data);
    } catch (error) {
      console.error('Error removing employee:', error);
    }
  };

  const handleSubmit = async () => {
    if (!name || !phonePart1 || !phonePart2 || !phonePart3 || !position || !age || !gender || !employeeId) {
      alert("입력되지 않은 부분이 있습니다. 모든 필수 입력값을 입력해주세요.");
      return;
    }
  
    const fullPhoneNumber = `${phonePart1}-${phonePart2}-${phonePart3}`;
  
    try {
      const response = await axios.post(`${userApiBaseUrl}/user/create`, {
        userNo: parseInt(employeeId),
        userPosition: position,
        userName: name,
        userAge: age,
        userGender: gender,
        userTelNo: fullPhoneNumber,
        userEmail: email,
        userAddress: address
      });
  
      // 성공적으로 등록되면 서버에서 받은 데이터를 콘솔에 출력합니다.
      console.log("직원 등록 성공:", response.data);
  
      // 입력된 데이터를 새로운 객체로 만듭니다.
      const newData = {
        id: parseInt(employeeId),
        pos: position,
        name: name,
        age: age,
        gender: gender,
        pNumber: fullPhoneNumber,
        email: email,
        address: address
      };
  
      // 기존 데이터에 새로운 데이터를 추가합니다.
      setMembersData(prevData => sortMembersData([...prevData, newData]));
  
      // 입력 필드 초기화
      setPosition('');
      setName('');
      setAge('');
      setGender('');
      setPhonePart1('');
      setPhonePart2('');
      setPhonePart3('');
      setEmail('');
      setAddress('');
      setEmployeeId('');
  
      // 모달 닫기
      setShowRegistrationModal(false);
    } catch (error) {
      console.error('직원 등록 오류:', error);
    }
  };  

  const handleDelete = () => {
    if (!deleteId) {
      alert("사원번호를 입력해주세요.");
      return;
    }

    // 입력된 사원번호와 일치하는 행을 찾습니다.
    const indexToDelete = membersData.findIndex(member => member.id.toString() === deleteId);

    // 사원번호와 일치하는 행이 없으면 알림을 표시하고 종료합니다.
    if (indexToDelete === -1) {
      alert("일치하는 사원번호가 없습니다.");
      return;
    }

    handleFingerprintRemoval(deleteId);
    employeeRemoval(deleteId);

    // 사원번호와 일치하는 행을 삭제하고 업데이트된 데이터를 설정합니다.
    const updatedData = [...membersData];
    updatedData.splice(indexToDelete, 1);
    setMembersData(sortMembersData(updatedData));

    // 입력 필드 초기화
    setDeleteId('');

    // 모달 닫기
    setShowDeleteModal(false);
  };

  return (
    <div className="member-container">
      <header className="member-header">
        <div className="member-logo-section">
          <Link to="/main">
            <img src="/img/capstone_title.png" alt="로고" className="member-logo" />
          </Link>
        </div>
        <div className="member-search-left">
          <button className="new-profile-button" onClick={toggleRegistrationModal}>직원 등록</button>
          <button className="delete-button" onClick={toggleDeleteModal}>직원 삭제</button>
        </div>
        <div className="member-search">
          <div className="member-search-container">
            <img src="/img/search.png" alt="icon" className="member-search-icon" />
            <h> 데이터 검색</h>
          </div>
          <input
            type="text"
            placeholder="데이터를 입력하세요."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            title="사원번호, 직위, 이름을 통해 직원을 검색할 수 있습니다."
          />
        </div>
        <div className="member-header-menu">
          <div className="member-menu-wrapper">
            <Link to="/statistics" className="member-menu-item">
              <img src="/img/statistics.png" alt="statistics" className="member-menu-icon" />
              <span>통계</span>
            </Link>
            <Link to="/monitoring" className="member-menu-item">
              <img src="/img/monitoring.png" alt="monitoring" className="member-menu-icon" />
              <span>모니터링</span>
            </Link>
          </div>
        </div>
      </header>
      <div className="member-main-content">
        <div className="member-table-wrapper">
          <table>
            <thead className="member-table-header">
              {table.headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="member-table-body">
              {table.rows.map((row, rowIndex) => {
                if (
                  row.original.id.toString().includes(searchTerm) ||
                  row.original.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  row.original.pos.toLowerCase().includes(searchTerm.toLowerCase())
                ) {
                  table.prepareRow(row);
                  return (
                    <tr {...row.getRowProps()} key={rowIndex}>
                      {row.cells.map((cell, cellIndex) => {
                        return (
                          <td {...cell.getCellProps()} key={cellIndex}>
                            <Link to={`/detail/${row.original.id}`}>{cell.render('Cell')}</Link>
                          </td>
                        )
                      })}
                    </tr>
                  )
                } else {
                  return null;
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* 직원 등록 모달창 */}
      {showRegistrationModal && (
        <div className="member-modal">
          <div className="member-modal-content">
            <span className="close" onClick={toggleRegistrationModal}>&times;</span>
            <h2>직원 등록</h2>
            <div className="form-group">
              <label htmlFor="employeeId">*사원번호:</label>
              <input
                type="text"
                id="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              //readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">*이름:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">*전화번호:</label>
              <div className="phone-number-inputs">
                <input
                  type="text"
                  id="phonePart1"
                  value={phonePart1}
                  onChange={(e) => setPhonePart1(e.target.value)}
                  maxLength={3}
                  placeholder="010"
                />
                -
                <input
                  type="text"
                  id="phonePart2"
                  value={phonePart2}
                  onChange={(e) => setPhonePart2(e.target.value)}
                  maxLength={4}
                  placeholder="XXXX"
                />
                -
                <input
                  type="text"
                  id="phonePart3"
                  value={phonePart3}
                  onChange={(e) => setPhonePart3(e.target.value)}
                  maxLength={4}
                  placeholder="XXXX"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="position">*직위:</label>
              <br></br>
              <select
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                <option value="">직위를 선택하세요.</option>
                <option value="현장 관리자">현장 관리자</option>
                <option value="기술자">기술자</option>
                <option value="일용직">일용직</option>
                <option value="사무원">사무원</option>
                <option value="안전 감독관">안전 감독관</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="age">*나이:</label>
              <input
                type="text"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">*성별:</label>
              <br></br>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="null">성별을 선택해주세요.</option>
                <option value="남자">남자</option>
                <option value="여자">여자</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="email">이메일:</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">주소:</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="member-modalButton">
              <button className="fingerprint-button" onClick={handleFingerprintRegistration}>지문 측정 시작</button>
              <br></br>
              <button className="new-profile-button" onClick={handleSubmit}>등록</button>
            </div>
          </div>
        </div>
      )}
      {/* 직원 삭제 모달창 */}
      {showDeleteModal && (
        <div className="member-modal">
          <div className="member-modal-content">
            <span className="close" onClick={toggleDeleteModal}>&times;</span>
            <h2>직원 삭제</h2>
            <div className="form-group">
              <label htmlFor="deleteId">*사원번호:</label>
              <input
                type="text"
                id="deleteId"
                value={deleteId}
                onChange={(e) => setDeleteId(e.target.value)}
              />
            </div>
            <div className="member-modalButton">
              <button className="delete-button" onClick={handleDelete}>삭제</button>
            </div>
          </div>
        </div>
      )}
      <footer>
        <div className="member-footer">
          Ⓒ 안전하조. 캡스톤 디자인 프로젝트
        </div>
      </footer>

    </div>
  );
}

export default Member;