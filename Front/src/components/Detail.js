import React, { useState, useEffect } from 'react'; // React와 필요한 훅들을 import합니다.
import { useParams } from 'react-router-dom';

function Detail() {
  const { id } = useParams(); // React Router를 통해 전달된 URL 파라미터(id)를 가져옵니다.
  const [member, setMember] = useState(null); // 멤버 정보를 저장할 상태 변수

  useEffect(() => {
    // 실제로는 여기에서 멤버 데이터를 가져오는 API 호출 등을 수행해야 합니다.
    // 여기에서는 임시 데이터를 사용합니다.
    const fetchMemberData = async () => {
      try {
        // 임시 데이터를 사용하여 멤버 정보를 설정합니다.
        const members = [
          { id: 1, name: '민서1', tmp: 36, alcohol: "O" }, // 예시 데이터
          { id: 2, name: '민서2', tmp: 37, alcohol: "X" }  // 추가 데이터
        ];

        // URL 파라미터로 전달된 ID에 해당하는 멤버를 찾습니다.
        const foundMember = members.find(member => member.id === parseInt(id));
        if (!foundMember) {
          throw new Error('Member not found');
        }
        setMember(foundMember); // 가져온 멤버 데이터를 상태 변수에 저장합니다.
      } catch (error) {
        console.error(error);
        // 오류 처리를 여기에 추가할 수 있습니다.
      }
    };

    fetchMemberData(); // 멤버 데이터를 가져오는 함수를 호출합니다.
  }, [id]); // URL 파라미터인 id가 변경될 때마다 실행됩니다.

  // 멤버 데이터가 없을 경우를 처리합니다.
  if (!member) {
    return <div>멤버를 찾을 수 없습니다.</div>;
  }

  // 멤버 데이터를 표시합니다.
  return (
    <div>
      <h2>멤버 상세 정보</h2>
      <ul>
        <li>ID: {member.id}</li>
        <li>이름: {member.name}</li>
        <li>체온: {member.tmp}</li>
        <li>음주여부: {member.alcohol}</li>
      </ul>
    </div>
  );
}

export default Detail;