/*
    Editor: Lucas Vollmann-Oswald, Franz Koinigg
*/

"use client"
import React, {useEffect, useRef, useState} from 'react'
import Navbar from "@/components/ui/Navbar";
import {Button} from "@chakra-ui/react";
import styles from "@/app/styles/Home.module.css";
import {router} from "next/client";
import {useRouter} from "next/navigation";
import {getUsedPlayers, connectPlayer, disconnectFromLobby} from "@/components/javascript/Socket";
import {Simulate} from "react-dom/test-utils";
import play = Simulate.play;

// This is the page for the Player Select Menu. Here the player can choose his name and start the game with his character
const Page = () => {

    const router = useRouter();
    const [username1, setUsername1] = useState('Player 1');
    const [username2, setUsername2] = useState('Player 2');

    const playerName1 = useRef();

    let player1 = true;
    let player2 = true;

    const handleChange1 = (event) => {
        setUsername1(event.target.value);
    }

    const handleChange2 = (event) => {
        setUsername2(event.target.value);
    }

    // Handles all events like the click action on a specific card of the player and interactions to the Websocket for the players
    const handleClick = (event) => {
        router.push('/playgame')
        let id = event.target.id;
        console.log("Die id " + event.currentTarget.id)
        // Für Websocket
        disconnectFromLobby()
        if (id === 'player1') {
            connectPlayer(2)
            console.log("Player1 clicked!")
            player1 = false;
            handlePlayer1(player1)
        } else {
            connectPlayer(1)
            console.log("Player2 clicked!")
            player2 = false;
            handlePlayer2(player2)
        }
        localStorage.setItem('playerName1', username1);
        localStorage.setItem('playerName2', username2);
    }

    // This is that the card changes its color and can't be clicked anymore by the other player, once one player started his game
    // Franz: Gray out websocket conenction
    const handlePlayer1 = (cond) => {
        player1 = cond;
        const player1Div = document.getElementById('player1');
        if (!player1 && player1Div) {
            player1Div.style.backgroundColor = 'black';
            player1Div.style.pointerEvents = 'none';
        }
    }

    const handlePlayer2 = (cond) => {
        player2 = cond;
        const player2Div = document.getElementById('player2');
        if (!player2 && player2Div) {
            player2Div.style.backgroundColor = 'black';
            player2Div.style.pointerEvents = 'none';
        }
    }

    // To make the one player field grey out once one is pressed
    useEffect(() => {
        getUsedPlayers()
        // handlePlayer2(false)
    }, []);

    return (
        <>
            <Navbar></Navbar>
            <div id="about" className='w-full h-screen px-4 bg-black'>
                <div className='max-w-[1200px] h-screen mx-auto grid md:grid-cols-1 text-center'>
                    <div className="w-full bg-gray-100 shadow-amber-100 flex flex-col rounded-lg text-white
                        duration-200 bg-gradient-to-r from-[#252B24] to-[#000300]">
                        <div
                            className='grid md:grid-cols-2 w-full bg-gray-100 shadow-amber-100 flex flex-col p-4 my-4 rounded-lg text-white
                        duration-200 bg-gradient-to-r from-[#252B24] to-[#000300] gap-6'>
                            <div id="cat-select" disabled={player1}
                                 className='text-2xl font-bold py-4 text-[#000000]  text-yellow-500 hover:text-white'>
                                <input
                                    className="shadow appearance-none border border-yellow-600 border-2 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="username1" onChange={handleChange1} type="text" placeholder="Enter Name"/>
                                <div onClick={handleClick} id='player1'
                                     className='w-full bg-gray-200 shadow-amber-100 flex flex-col p-4 my-4 rounded-lg text-white border bg-white duration-200 hover:scale-105'>
                                    <h3 className='text-4xl font-bold text-center py-4 text-yellow-500'>Player 1</h3>
                                    <div
                                        className='w-full bg-gray-200 shadow-amber-100 flex flex-col p-4 my-4 rounded-lg text-white border bg-white duration-200'>
                                        <img className='h-60 w-96 mx-auto my-4' src='/bearselect.svg' alt='/'/>
                                    </div>
                                    <p className='text-center text-2xl font-medium text-[#000000]'></p>
                                    <div className='py-10 text-[#000000] text-center font-medium'>
                                    </div>
                                </div>
                            </div>
                            <div id="bear-select" className='text-2xl font-bold py-4 text-red-600 hover:text-white'>
                                <input
                                    className="shadow appearance-none border-2  border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="username2" type="text" onChange={handleChange2} placeholder="Enter Name"
                                />
                                <div onClick={handleClick} id='player2'
                                     className='w-full bg-gray-200 shadow-amber-100 flex flex-col p-4 my-4 rounded-lg text-white border bg-white duration-200 hover:scale-105'>
                                    <h3 className='text-4xl font-bold text-center py-4 text-red-600'>Player 2</h3>
                                    <div
                                        className='w-full bg-gray-200 shadow-amber-100 flex flex-col p-4 my-4 rounded-lg text-white border bg-white duration-200'>
                                        <img className='h-60 w-96 mx-auto my-4' src='/catselect.svg' alt='/'/>
                                    </div>
                                    <p className='text-center text-2xl font-medium text-[#000000]'></p>
                                    <div className='py-10 text-[#000000] text-center font-medium'>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='rounded-md font-medium'>
                            <button className={styles.button}>
                                CLICK ON PLAYER
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Page
