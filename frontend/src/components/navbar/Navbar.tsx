import React from 'react'

import Learn from './assets/Learn.svg'
import LearnSelected from './assets/LearnSelected.svg'
import News from './assets/News.svg'
import NewsSelected from './assets/NewsSelected.svg'
import Scan from './assets/Scan.svg'
import ScanSelected from './assets/ScanSelected.svg'
import User from './assets/User.svg'
import UserSelected from './assets/UserSelected.svg'
import Find from './assets/Find.svg'
import FindSelected from './assets/FindSelected.svg'

function Navbar(props: { selected: number }) {
  const icons = [
    {
      name: 'Learn',
      icon: Learn,
      iconSelected: LearnSelected,
      href: '/learn',
    },
    {
      name: 'News',
      icon: News,
      iconSelected: NewsSelected,
      href: '/news',
    },
    {
      name: 'Scan',
      icon: Scan,
      iconSelected: ScanSelected,
      href: '/scan',
    },
    {
      name: 'Find',
      icon: Find,
      iconSelected: FindSelected,
      href: '/find',
    },
    {
      name: 'User',
      icon: User,
      iconSelected: UserSelected,
      href: '/user',
    },
  ]

  const iconSize = 32

  return (
    <div className="fixed bottom-0 inset-x-0 bg-gray-200 bg-opacity-100 flex justify-around py-2">
      {icons.map(({ name, icon, iconSelected, href }, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <a href={href}>
            <div className="flex flex-col items-center" style={{ height: `${iconSize + 16}px` }}>
              <img
                src={props.selected === index + 1 ? iconSelected : icon}
                alt={name}
                className={`w-8 h-8 mb-1 ${props.selected === index + 1 ? 'text-blue-500' : 'text-gray-600'}`}
              />
              <p className={`text-xs font-bold ${props.selected === index + 1 ? 'text-[#15994D]' : 'text-gray-600'}`}>{name}</p>
            </div>
          </a>
        </div>
      ))}
    </div>
  )
}

export default Navbar