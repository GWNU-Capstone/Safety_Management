import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { Link } from 'react-router-dom';
import './Member.css';
import { fingerprintApiBaseUrl, userApiBaseUrl } from './Api';

function Member() {
  // 데이터와 컬럼 정의
  const [membersData, setMembersData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 여기서 데이터를 가져와서 membersData 상태에 설정
        const dummyData = [
          { id: 1, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 2, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 3, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 4, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 5, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 6, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 7, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 8, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 9, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 10, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 11, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 12, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 13, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 14, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 15, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 16, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 17, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 18, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 19, pos: 'Owner', name: '테스트2', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 20, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 21, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'},
          { id: 22, pos: 'Owner', name: '테스트', age: 25, gender: '남자', pNumber: '010-1234-5678', email: "test@example.com", address: '강원도 원주시 테스트 테스트 11 (11111)'}
        ];
        setMembersData(dummyData);
      } catch (error) {
        console.log("네트워크 오류 [Join]", error);
      }
    };

    fetchData();
  }, []);

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
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // 회원가입 핸들러
  const handleSubmit = () => {
    // 이름과 전화번호를 이용하여 회원가입 처리
    console.log("이름:", name);
    console.log("전화번호:", phoneNumber);
    // 여기에 회원가입 처리 로직을 추가하세요.
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
          <button className="new-profile-button" onClick={toggleModal}>직원 등록</button>
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

      {/* 모달 */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>&times;</span>
            <h2>직원 등록</h2>
            <div className="form-group">
              <label htmlFor="name">이름:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">전화번호:</label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <button className="new-profile-button" onClick={handleSubmit}>가입</button>
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