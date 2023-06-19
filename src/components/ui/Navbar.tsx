/*
    Author: Lucas Vollmann-Oswald
    TICTACDEAD
 */

import React, {useEffect, useState} from 'react'
import WebFont from 'webfontloader'
import {Link} from "react-scroll/modules";
import {useRouter} from 'next/navigation'

import {AiOutlineClose, AiOutlineMenu} from 'react-icons/ai'


// This is the component for the Navbar, which gets displayed across all pages
const Navbar = () => {
    const router = useRouter();
    const [nav, setNav] = useState(true); // To turn the responsive navabar on and off
    // to get to know the screenwidth for responsive design

    const [screenWidth, setScreenWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        // Add event listener to update screenWidth on window resize
        window.addEventListener('resize', handleResize);

        // Set initial screenWidth value
        setScreenWidth(window.innerWidth);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

        const handleNav = () => {
        setNav(!nav);
    }

    return (
        <div className='flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white'>
            <div>{screenWidth}</div>
            <h1 onClick={() => router.push("/")} className='w-full font-redundead md:text-4xl sm:text-2xl text-2xl font-bold text-yellow-700'>TIC·TAC·<span className='text-red-950'>Dead</span></h1>
            <ul className='hidden md:flex'> {/*}when collapsing the navbar on the top which would also collapse hides*/}
                <li className='p-4'><button onClick={() => router.push("/")}>Home</button></li>
                <li className='p-4'><button><Link to="description" spy={true} smooth={true} offset={50} duration={200}>Description</Link></button></li>
                <li className='p-4'><button><Link to="about" spy={true} smooth={true} offset={50} duration={200}>About</Link></button></li>
                <li className='p-2'>
                    <button onClick={() => router.push("/playerselect")}
                        className="whitespace-nowrap break-keep bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-10 border border-gray-400 rounded shadow">
                        START GAME
                    </button></li>
            </ul>
            <div onClick={handleNav} className='block md:hidden'> {/*}That's for the Icon change*/}
                {!nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20}/>} {/*}Responsive design for small screen, show or do not show the menu*/}
            </div>
            <div className={
                !nav ? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000100] ease-in-out duration-500 z-10': 'fixed left-[-100%]'}> {/*Mobile View*/}
                <h1 className='w-full font-redundead md:text-4xl sm:text-2xl text-2xl font-bold text-yellow-700 m-4'>TIC·TAC·<span className='text-red-950'>Dead</span></h1>
                <ul className='uppercase p-4'>
                    <li className='p-4 border-b border-gray-600'><button><Link to="home" spy={true} smooth={true} offset={50} duration={2}>Home</Link></button></li>
                    <li className='p-4 border-b border-gray-600'><button><Link to="description" spy={true} smooth={true} offset={50} duration={200}>Description</Link></button></li>
                    <li className='p-4 border-b border-gray-600'><button><Link to="about" spy={true} smooth={true} offset={50} duration={200}>About</Link></button></li>
                    <li className='p-4'><button onClick={() => router.push("/playerselect")}>PLAY</button></li>
                </ul>
            </div>
        </div>
    );
}

export default Navbar