import React from 'react'

// TODO:
// Insert in extra components and add the custom properties

function About() {
    return (
        <div id="about" className='w-full h-screen py-[10rem] px-4 bg-black'>
            <div className='mx-auto text-center flex flex-col justify-center pb-32'>
                <h1 className='text-white font-medium text-5xl'>Roles</h1>
            </div>
            <div className='max-w-[1200px] mx-auto grid md:grid-cols-3 gap-7'>
                <div
                    className='w-full bg-gray-100 shadow-amber-100 flex flex-col p-4 my-4 rounded-lg text-white border bg-white hover:scale-105 duration-200'>
                    <img className='w-20 mx-auto mt-[-3rem] bg-white' src="design-thinking.png"/>
                    <h3 className='text-4xl font-bold text-center py-4 text-[#000000]'>Otto Allwinger</h3>
                    <p className='text-center text-2xl font-medium text-[#000000]'>Backend Developer</p>
                    <div className='py-10 text-[#000000] text-center font-medium'>
                        <p className='py-10 border-b mx-8'>Spring Boot</p>
                        <p className='py-10'>Java</p>
                    </div>
                </div>
                <div
                    className='w-full bg-gray-200 shadow-amber-100 flex flex-col p-4 my-4 rounded-lg text-white border bg-white hover:scale-105 duration-200'>
                    <img className='w-20 mx-auto mt-[-3rem] bg-white' src="design-thinking.png"/>
                    <h3 className='text-4xl font-bold text-center py-4 text-[#000000]'>Franz Koinigg</h3>
                    <p className='text-center text-2xl font-medium text-[#000000]'>Multiplayer Integration</p>
                    <div className='py-10 text-[#000000] text-center font-medium'>
                        <p className='py-10 border-b mx-8'>Websockets</p>
                        <p className='py-10'>Java</p>
                    </div>
                </div>
                <div
                    className='w-full bg-gray-300 shadow-amber-100 flex flex-col p-4 my-4 rounded-lg text-white border bg-white hover:scale-105 duration-200'>
                    <img className='w-20 mx-auto mt-[-3rem] bg-white' src="design-thinking.png"/>
                    <h3 className='text-4xl font-bold text-center py-4 text-[#000000]'>Lucas Vollmann-Oswald</h3>
                    <p className='text-center text-2xl font-medium text-[#000000]'>Frontend Developer</p>
                    <div className='py-10 text-[#000000] text-center font-medium'>
                        <p className='py-10 border-b mx-8'>React</p>
                        <p className='py-10'>Next.js</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About
