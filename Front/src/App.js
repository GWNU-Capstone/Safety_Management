import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main'; // Main 컴포넌트 import
import Member from './components/Member'; // Member 컴포넌트 import
import Detail from './components/Detail'; // Detail 컴포넌트 import
import Statistics from './components/Statistics'; // Statistics 컴포넌트 import
import Monitoring from './components/Monitoring'; // Monitoring 컴포넌트 import

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Main/>} />
          <Route path="/member" element={<Member/>} />
          <Route path="/main" element={<Main/>} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/Monitoring" element={<Monitoring />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;