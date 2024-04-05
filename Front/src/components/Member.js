import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { Link } from 'react-router-dom';
import './Member.css';
import apiClient from "api";

function Member() {
  // 데이터와 컬럼 정의
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`/members/1`);
        setData(response.data);
      } catch (error) {
        console.log("네트워크 오류 [Join]", error);
      } finally {
      }
    };

    fetchData();
  }, []);

  console.log(data);

  /*const data = React.useMemo(
    () => [
      { id: 1, name: '테스트', age: 25, pNumber: '010-1234-5678', tmp: 36, alcohol: "O" },
      { id: 1, name: '테스트', age: 25, pNumber: '010-1234-5678', tmp: 36, alcohol: "O" },
      { id: 1, name: '테스트', age: 25, pNumber: '010-1234-5678', tmp: 36, alcohol: "O" },
      { id: 1, name: '테스트', age: 25, pNumber: '010-1234-5678', tmp: 36, alcohol: "O" },
      { id: 1, name: '테스트', age: 25, pNumber: '010-1234-5678', tmp: 36, alcohol: "O" },
      { id: 1, name: '테스트', age: 25, pNumber: '010-1234-5678', tmp: 36, alcohol: "O" },
      { id: 1, name: '테스트', age: 25, pNumber: '010-1234-5678', tmp: 36, alcohol: "O" },
      { id: 1, name: '테스트', age: 25, pNumber: '010-1234-5678', tmp: 36, alcohol: "O" },
      { id: 1, name: '테스트', age: 25, pNumber: '010-1234-5678', tmp: 36, alcohol: "O" },
      { id: 1, name: '테스트', age: 25, pNumber: '010-1234-5678', tmp: 36, alcohol: "O" },
      { id: 1, name: '테스트', age: 25, pNumber: '010-1234-5678', tmp: 36, alcohol: "O" },
      { id: 1, name: '테스트', age: 25, pNumber: '010-1234-5678', tmp: 36, alcohol: "O" },
      { id: 1, name: '테스트', age: 25, pNumber: '010-1234-5678', tmp: 36, alcohol: "O" },
      { id: 1, name: '테스트', age: 25, pNumber: '010-1234-5678', tmp: 36, alcohol: "O" },
      { id: 1, name: '테스트', age: 25, pNumber: '010-1234-5678', tmp: 36, alcohol: "O" },
      { id: 1, name: '테스트', age: 25, pNumber: '010-1234-5678', tmp: 36, alcohol: "O" },
      { id: 1, name: '테스트', age: 25, pNumber: '010-1234-5678', tmp: 36, alcohol: "O" },
      { id: 2, name: '테스트', age: 25, pNumber: '010-1234-5678', tmp: 36, alcohol: "O" }
    ],
    []
  );*/
  
  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id'
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
        Header: '전화번호',
        accessor: 'pNumber'
      },
      {
        Header: '체온',
        accessor: 'tmp'
      },
      {
        Header: '음주',
        accessor: 'alcohol'
      }
    ],
    []
  );

  // eslint-disable-next-line no-unused-vars
  const [showTemperature, setShowTemperature] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [showAlcohol, setShowAlcohol] = useState(true);


  // 열을 필터링하는 함수
  const filteredColumns = React.useMemo(() => columns.filter(column => {
    if (column.accessor === 'tmp') {
      return showTemperature;
    }
    if (column.accessor === 'alcohol') {
      return showAlcohol;
    }
    return true;
  }), [columns, showTemperature, showAlcohol]);

  // useTable 훅을 사용하여 테이블 생성
  const table = useTable({ columns: filteredColumns, data });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="member-container">
      {/* 로고에 링크 추가 */}
      <Link to="/main">
        <img src="/img/capston_title.png" alt="로고" className="memberLogo" />
      </Link>
      
      <div className="menu-wrapper">
        <img src="/img/menu-button.png" alt="menu" className="menu-button" onClick={toggleMenu} />

        {isMenuOpen && (
          <div className="menu-dropdown">
            <Link to="/statistics" className="menu-item">
              <img src="/img/statistics.png" alt="statistics" className="menu-icon" />
              <span>통계</span>
            </Link>

            <Link to="/monitoring" className="menu-item"> {/* Monitoring 화면으로 이동하는 링크 */}
              <img src="/img/monitoring.png" alt="monitoring" className="menu-icon" />
              <span>모니터링</span>
            </Link>
          </div>
        )}
      </div>

      {/* 테이블 컨테이너 */}
      <div className="table-container">
        <table>
          {/* 테이블 헤더 렌더링 */}
          <thead className="table-header">
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
          <tbody className="table-body">
            {table.rows.map((row, rowIndex) => {
              table.prepareRow(row); // 각 행 준비
              return (
                <tr {...row.getRowProps()} key={rowIndex}>
                  {/* 각 셀 렌더링 */}
                  {row.cells.map((cell, cellIndex) => {
                    if (cellIndex === 1) { // 이름 열에만 링크 추가
                      return (
                        <td {...cell.getCellProps()} key={cellIndex}>
                          <Link to={`/detail/${row.original.id}`}>{cell.render('Cell')}</Link>
                        </td>
                      )
                    } else {
                      return <td {...cell.getCellProps()} key={cellIndex}>{cell.render('Cell')}</td>
                    }
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Member;