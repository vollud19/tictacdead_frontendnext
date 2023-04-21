"use client"
import React from 'react'
import Typed from 'react-typed';
import styles from '../../app/styles/Home.module.css'
import Link from "next/link";
import {useRouter} from 'next/navigation'

const Home = () => {
    const router = useRouter();

    return (
        <div id="hero" className='text-white background-img'>
            <div className='bg-black/50'>
                <div
                    className='max-w-[1100px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center'>
                    <p className='text-yellow-700 font-bold p-2'>A TICTACTOE YOU HAVE NEVER SEEN BEFORE</p>
                    <h1 className="font-redundead md:text-8xl sm:text-6xl text-4xl font-bold md:py-6">TicTac<span
                        className='text-red-950'>Dead</span></h1>
                    <div className='flex justify-center items-center'>
                        <p className='md:text-5xl sm:text-4xl text-xl font-bold pl-2 py-4'>An Extreme game only for </p>
                        <Typed
                            className="md:text-5xl sm:text-4xl text-xl font-bold md:pl-4 pl-2"
                            strings={['adrenaline-junkies', 'daredevils', 'thrill seekers']}
                            typeSpeed={140}
                            backSpeed={100}
                            loop
                        />
                    </div>
                    <p className="md:text-2xl text-xl font-bold text-gray-500">A hardcore version of the most famous
                        game TicTacToe. A strategie game for people who need the next challenge for their mind.</p>
                    <div className='rounded-md font-medium my-6 mx-auto py-4'>
                        <button onClick={() => router.push('/playerselect')} className={styles.button}>
                            PLAY
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Home
