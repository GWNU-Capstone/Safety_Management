import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { Link } from 'react-router-dom';
import './Member.css';

function Member() {
  // 데이터와 컬럼 정의
  const [membersData, setMembersData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="member-container">
      <header className="member-header">
        <div className="member-logo-section">
          <Link to="/main">
            <img src="/img/capstone_title.png" alt="로고" className="member-logo" />
          </Link>
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

      {/* 테이블 컨테이너 */}
      <div className="member-main-content">

        <div className="member-table-wrapper">
          <table>
            {/* 테이블 헤더 렌더링 */}
            <thead className="member-table-header">
              {table.headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {/* 각 컬럼 헤더 렌더링 */}
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            {/* 테이블 바디 렌더링 */}
            <tbody className="member-table-body">
              {table.rows.map((row, rowIndex) => {
                // 테이블 행 필터링
                if (
                  row.original.id.toString().includes(searchTerm) ||
                  row.original.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  row.original.pos.toLowerCase().includes(searchTerm.toLowerCase())
                ) {
                  table.prepareRow(row); // 각 행 준비
                  return (
                    <tr {...row.getRowProps()} key={rowIndex}>
                      {/* 각 셀 렌더링 */}
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
                  return null; // 검색어와 일치하지 않으면 해당 행을 렌더링하지 않습니다.
                }
              })}
            </tbody>

          </table>
        </div>

      </div>


      <footer>
        <div className="member-footer">
          Ⓒ 안전하조. 캡스톤 디자인 프로젝트
        </div>
      </footer>

    </div>
  );
}

export default Member;