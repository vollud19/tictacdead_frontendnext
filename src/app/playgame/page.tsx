"use client"
import React from 'react'
import styles from "@/app/styles/Home.module.css";
import Link from "next/link";
import Navbar from '../../components/ui/Navbar'

export default function PlayGame() {
    return (
        <>
            <Navbar></Navbar>
            <div className='flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white'>
                <h1>Coming soon...</h1>
            </div>
        </>
    );
}