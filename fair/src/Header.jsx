import React from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const menuItems = [
  {
    name: 'Home',
    href: '/home',
  },
  {
    name: 'About',
    href: '/about',
  },
  {
    name: 'Contact',
    href: '/contact',
  },
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <div className="w-full bg-white fixed top-0 left-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="inline-flex items-center space-x-2">
          <img src='B3.png' alt='website logo' className='h-10 w-auto'/>
          <span className="font-extrabold">IdeaHack</span>
        </div>
        <div className="hidden lg:flex">
          <ul className="ml-12 inline-flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className="text-sm font-semibold text-gray-800 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:hidden">
          <Menu onClick={toggleMenu} className="h-6 w-6 cursor-pointer" />
        </div>
        {isMenuOpen && (
          <div className="absolute top-0 right-0 mt-12 w-64 bg-white shadow-lg lg:hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="font-bold">IdeaHack</span>
              <X onClick={closeMenu} className="h-6 w-6 cursor-pointer" />
            </div>
            <nav className="p-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeMenu}  // Close the menu when a link is clicked
                  className="block py-2 text-sm font-semibold text-gray-800 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header
