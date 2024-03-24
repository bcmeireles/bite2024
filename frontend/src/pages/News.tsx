import React from 'react'
import Navbar from '../components/navbar/Navbar'
import background from '../background.svg'

function News() {
  return (
    <div className="h-screen bg-white flex items-center justify-center px-6 relative">
      <img src={background} alt="Waves" className="absolute bottom-0 left-0 w-full h-full" />
        <div className="z-10 relative">
            <Navbar selected={2}/>
            <h1 className="text-3xl font-bold text-center mb-8">Coming Soon</h1>            
        </div>
    </div>
  )
}

export default News