import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyComponent from './MyComponent';
import Learn from './pages/Learn';
import News from './pages/News';
import Scan from './pages/Scan';
import User from './pages/User';
import Map from './pages/map/Map';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import QuizCard from './components/QuizCard';
import Study from './pages/Study';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MyComponent />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/news" element={<News />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/user" element={<User />} />
        <Route path="/find" element={<Map />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quiz/1" element={<QuizCard unit= {1} />} />
        <Route path="/quiz/2" element={<QuizCard unit= {2} />} />
        <Route path="/quiz/3" element={<QuizCard unit= {3} />} />
        <Route path="/learn/1" element={<Study unit= {1} />} />  
        <Route path="/learn/2" element={<Study unit= {2} />} />  
        <Route path="/learn/3" element={<Study unit= {3} />} />        
      </Routes>
    </Router>
  );
}

export default App;