"use client"
import React from 'react'
import Navbar from "@/components/ui/Navbar";

const Page = () => {
    return (
        <>
            <Navbar></Navbar>
            <div id="about" className='w-full h-screen px-4 bg-black'>
                <div className='max-w-[1200px] h-screen mx-auto grid md:grid-cols-1 text-center '>
                    <div
                        className='grid md:grid-cols-2 w-full bg-gray-100 shadow-amber-100 flex flex-col p-4 my-4 rounded-lg text-white
                        duration-200 bg-gradient-to-r from-[#252B24] to-[#000300] gap-6'>
                        <div className='text-2xl font-bold py-4 text-[#000000] text-white'><h3>Enter Name</h3>
                            <div
                                className='w-full bg-gray-200 shadow-amber-100 flex flex-col p-4 my-4 rounded-lg text-white border bg-white duration-200'>
                                <h3 className='text-4xl font-bold text-center py-4 text-[#000000]'>Player 1</h3>
                                <div className='w-full bg-gray-200 shadow-amber-100 flex flex-col p-4 my-4 rounded-lg text-white border bg-white duration-200'>
                                    <img className='h-48 w-96 mx-auto my-4' src='/bearselect.svg' alt='/'/>
                                </div>
                                <p className='text-center text-2xl font-medium text-[#000000]'></p>
                                <div className='py-10 text-[#000000] text-center font-medium'>
                                    <p className='py-10 border-b mx-8'></p>
                                    <p className='py-10'></p>
                                </div>
                            </div>
                        </div>
                        <div className='text-2xl font-bold py-4 text-[#000000] text-white'><h3>Enter Name</h3>
                            <div
                                className='w-full bg-gray-200 shadow-amber-100 flex flex-col p-4 my-4 rounded-lg text-white border bg-white duration-200'>
                                <h3 className='text-4xl font-bold text-center py-4 text-[#000000]'>Player 2</h3>
                                <div className='w-full bg-gray-200 shadow-amber-100 flex flex-col p-4 my-4 rounded-lg text-white border bg-white duration-200'>
                                    <img className='h-48 w-96 mx-auto my-4' src='/catselect.svg' alt='/'/>
                                </div>
                                <p className='text-center text-2xl font-medium text-[#000000]'></p>
                                <div className='py-10 text-[#000000] text-center font-medium'>
                                    <p className='py-10 border-b mx-8'></p>
                                    <p className='py-10'></p>
                                </div>
                            </div>
                        </div>
                        <div className='py-10 text-[#000000] text-center font-medium'>
                            <p className='py-10'></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Page
