import React, { useState, useEffect } from 'react'
import Navbar from '../components/navbar/Navbar'
import background from '../background.svg'

interface INews {
  title: string;
  date: string;
  picture: string;
  url: string
}

function News() {
  const [news, setNews] = useState<INews[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const response = await fetch('http://localhost:5000/news');

      if (!response.ok) {
        console.error('Error fetching news');
        return;
      }

      const data = await response.json();
      setNews(data);
    };

    fetchNews();
  }, []);

  if (news.length === 0) {
    return (
      <div className="h-screen bg-white flex items-center justify-center px-6 relative">
      <img src={background} alt="Waves" className="absolute bottom-0 left-0 w-full h-full" />
      <div className="z-10 relative">
        <Navbar selected={2} />
        <h1>Loading...</h1>
      </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white flex items-center justify-center px-6 relative">
      <img src={background} alt="Waves" className="absolute bottom-0 left-0 w-full h-full" />
      <div className="z-10 flex flex-col h-auto">
        <Navbar selected={2}/>
        <h1 className="text-3xl font-bold text-center mb-8">News</h1>
        <div className="flex-shrink-0 overflow-y-auto h-[calc(100vh-160px)]">
          {news.map((item, index) => (
            <div key={index} className="mb-4 flex flex-col bg-gray-200 rounded-lg shadow-md border-2 border-gray-400">
              <a href={item.url} target='_blank'>
                <div className="flex-1">
                  <img src={item.picture} alt="News" className="w-full h-full object-cover rounded-t-lg"/>
                </div>
              </a>
              <div className="flex-1 flex flex-col justify-between p-4">
                <h2 className="text-xl font-bold">{item.title}</h2>
                <p className="text-sm text-gray-600">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default News;
