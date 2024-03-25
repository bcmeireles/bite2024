import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar/Navbar'
import background from '../background.svg'

type HistoryItem = {
  date: string;
  change: number;
  reason: string;
};

type User = {
  name: string;
  points: number;
  history: HistoryItem[];
};

function User() {
  const [user, setUser] = useState<User>({
    name: "",
    points: 0,
    history: []
  });

  useEffect(() => {
    const fetchUser = async () => {
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
        setUser(data.data);
      }
    };
    fetchUser();
  }, []);

  const HistoryCard: React.FC<{ item: HistoryItem }> = ({ item }) => {
    const date = new Date(item.date).toLocaleString();
  
    return (
      <div className={`p-4 rounded-lg mb-4 ${item.change > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
        <div className="flex justify-between items-center mb-1"> {/* Reduced margin-bottom to mb-1 */}
          <div>{item.reason}</div> {/* Moved the "reason" text to the top row */}
          <div className="flex items-center">
            <div className="text-md text-gray-500">{date}</div> {/* Moved the "date" text to the left */}
            <div
              className={`flex text-right ml-2 ${
                item.change > 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {item.change > 0 ? '+' : '-'}
              {Math.abs(item.change)}
            </div> {/* Added margin-left to ml-2 */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-white flex items-center justify-center px-6 relative">
      <img src={background} alt="Waves" className="absolute bottom-0 left-0 w-full h-full" />
      <div className="z-10 flex flex-col h-auto w-full">
        <Navbar selected={5}/>
        <h1 className="text-3xl font-bold text-center mb-8">Welcome, {user.name}</h1>
        <div className="text-xl font-bold text-center mb-4">Points: {user.points}</div>
        <div className="text-lg font-bold text-center mb-2">History</div>
        <div className="flex-shrink-0 overflow-y-auto h-[calc(100vh-192px)]"> {/* Set the height to be a percentage of the screen height */}
            {
              user.history.map((item, index) => (
                <HistoryCard key={index} item={item} />
              ))
            }
          </div>
        </div>
      </div>
    );
}

export default User
