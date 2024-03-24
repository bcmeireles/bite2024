import React, { useState, useEffect } from 'react'
import Navbar from '../components/navbar/Navbar'
import background from '../background.svg'

interface UserSafe {
  quizzes: boolean[]
}

function Learn() {
  const [userSafe, setUserSafe] = useState<UserSafe>({
    quizzes: [false, false, false]
  });
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:5000/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 401) {
        window.location.href = '/login';
      }

      const data = await response.json();
      if (data.status === 'success') {
        setUserSafe(data.data);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="h-screen bg-white flex items-center justify-center px-6 relative">
      <img src={background} alt="Waves" className="absolute bottom-0 left-0 w-full h-full" />
      <div className="z-10 relative">
        <Navbar selected={1}/>
        <h1 className="text-3xl font-bold text-center mb-8">Learning Path</h1>
        {userSafe && (
          <div className="flex flex-col space-y-4">
            {userSafe.quizzes.map((unitCompleted, index) => (
              <div key={index} className="flex items-center space-x-2 w-full">
                <div className="bg-gray-200 text-center p-4 rounded-lg w-full relative">
                <button
                    type="button"
                    className="text-lg text-center font-semibold"
                    onClick={() => window.location.href = `/learn/${index + 1}`}
                  >
                    Unit {index + 1}
                  </button>
                  {unitCompleted && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle checkmark" width="24px" height="24px">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
)}


      </div>
    </div>
  )
}

export default Learn
