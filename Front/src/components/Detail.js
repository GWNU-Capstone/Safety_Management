import React from 'react';
import { Link } from 'react-router-dom';
import './Detail.css';

const Detail = () => {
  return (
    <div>
      <header className="header">
        <Link to="/main">
          <img src="/img/capston_title.png" alt="로고"/>
        </Link>
      </header>
      <div className="container">
        <div className="profile-img">
          <img src="https://via.placeholder.com/150" alt="Profile" className="rounded" />
        </div>
        <div className="profile-info">
          <table className="info-table">
            <tr>
              <th colSpan="2" className="info-heading">Personal Info</th>
            </tr>
            <tr>
              <td>Name</td>
              <td>Test</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>Test@example.com</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>010-1234-5678</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>주소 입력</td>
            </tr>
          </table>
        </div>
        <div className="attendance-record">
          <h2 className="record-heading">Attendance Record</h2>
          <table className="record-table">
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
            <tr>
              <td>2023-01-01</td>
              <td>Present</td>
            </tr>
            <tr>
              <td>2023-01-02</td>
              <td>Absent</td>
            </tr>
            <tr>
              <td>2023-01-03</td>
              <td>Present</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Detail;
