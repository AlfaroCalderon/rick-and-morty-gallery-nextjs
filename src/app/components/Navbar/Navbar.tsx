'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export const Navbar = () => {

  const pathname = usePathname();

  const linkClass = (href:string) => `block w-full p-6 h-fit transition-all duration-300 ease-in-out ${
      pathname === href ? 'bg-blue-600 text-white' : 'text-white hover:bg-blue-500'
    }`

  return (
    <nav className='flex justify-center w-full py-4'>
      <div className='flex flex-col w-full md:w-[70%] lg:w-[70%] rounded-lg shadow-lg transition-all duration-300 ease-in-out'>
        <ul className='flex flex-row w-full gap-5 bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg overflow-hidden'>
          <li className='flex-1 hover: hover:bg-blue-500 transition-all duration-300 ease-in-out cursor-pointer font-semibold text-center'>
          <Link className={linkClass('/')} href={'/'} > Characters List </Link> 
          </li>
          <li className='flex-1 hover:bg-blue-500 transition-all duration-300 ease-in-out cursor-pointer font-semibold text-center'>
          <Link className={linkClass('/character_list')} href={'/character_list'} >Episodes List </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
