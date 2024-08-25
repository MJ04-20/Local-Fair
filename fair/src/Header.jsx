'use client'

import React from 'react'
import {  Menu, X } from 'lucide-react'
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

  return (
    <div className="relative w-full bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="inline-flex items-center space-x-2">
      
          <span className="font-extrabold">LocalFair</span>
        </div>
        <div className="hidden grow items-start lg:flex">
         
        </div>
        <div className="hidden lg:block">
        <ul className="ml-12 inline-flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link  to={item.href}
                  className="text-sm font-semibold text-gray-800 hover:text-gray-900">
                     {item.name}
                </Link>
                  
                 
                
                 
               
              </li>
            ))}
          </ul>
          
          <button
            type="button"
            className="rounded-md bg-black px-3 py-2 text-sm font-semibold ml-7 text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <Link to={"/login"}>
            Login
            </Link>
            
          </button>
          
        </div>
        <div className="lg:hidden">
          <Menu onClick={toggleMenu} className="h-6 w-6 cursor-pointer" />
        </div>
        {isMenuOpen && (
          <div className="absolute inset-x-0 top-0 z-50 origin-top-right transform p-2 transition lg:hidden">
            <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center space-x-2">
                   
                    
                    <span className="font-bold">DevUI</span>
                  </div>
                  <div className="-mr-2">
                 
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-4">
                    {menuItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-m-3 flex items-center rounded-md p-3 text-sm font-semibold hover:bg-gray-50"
                      >
                        <span className="ml-3 text-base font-medium text-gray-900">
                          {item.name}
                        </span>
                      </a>
                    ))}
                  </nav>
                </div>
             
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default Header