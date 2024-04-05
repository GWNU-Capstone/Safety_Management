import React from 'react';

function StatisticsPage() {
    return (
        <div>
            <h1>통계 페이지</h1>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px', backgroundColor: '#f2f2f2' }}>항목</th>
                        <th style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px', backgroundColor: '#f2f2f2' }}>값</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>총 방문자 수</td>
                        <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>100</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>평균 근무 시간 (분)</td>
                        <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>365.4</td>
                    </tr>
                    <tr>
                        <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>페이지 뷰 수</td>
                        <td style={{ border: '1px solid #dddddd', textAlign: 'left', padding: '8px' }}>300</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default StatisticsPage;