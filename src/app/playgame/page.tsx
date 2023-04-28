"use client"
import React from 'react'
import Link from "next/link";
import Navbar from '../../components/ui/Navbar'
import styles from '../../app/styles/Game.module.css'

export default function PlayGame() {
    let playerName1 = localStorage.getItem('playerName1');
    let playerName2 = localStorage.getItem('playerName2');

    return (
        <>
            <Navbar></Navbar>
            <div className='text-white background-img'>
                <h1 className="text-white">{playerName1}</h1>
                <h1 className="text-white">{playerName2}</h1>
                <div className='flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white'>

                </div>
            </div>
        </>
    );
}