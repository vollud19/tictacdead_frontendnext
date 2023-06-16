/*
    Editor: Lucas Vollmann-Oswald
*/

"use client"
import React, {useEffect, useState} from 'react'

import {Link} from "react-scroll/modules";
import Navbar from '../../components/ui/Navbar'
import Typed from "react-typed";
import {router} from "next/client";
import {useRouter} from "next/navigation";
import styles from '../../app/styles/Home.module.css'
import {TileLayer, FeatureGroup} from "react-leaflet"
import {EditControl} from "react-leaflet-draw"
import Square from "@/components/ui/Square";
import {render} from "react-dom";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import {disconnect, getUsedPlayers, sendMessage, player} from "@/components/javascript/Socket";
import useSound from 'use-sound'
// eslint-disable-next-line react-hooks/rules-of-hooks
let audio = new Audio("DarkMusic.mp3");

// The gameboard implementation of the TicTacDead game (actual game)
export default function PlayGame() {

    // For the responsive design
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

    // We get the playerName from the LocalStorgage and display it then on the screen
    let playerName1;
    let playerName2;
    if (window !== 'undefined') {
        playerName1 = localStorage.getItem('playerName1');
        playerName2 = localStorage.getItem('playerName2');
    }
    let player1Wins = 0;
    let player2Wins = 0;
    const router = useRouter();

    const [turnPlayer, setTurnPlayer] = useState(playerName1)
    const [turnObject, setTurnObject] = useState('/BtnGrey.svg')
    const [musicV, setMusicV] = useState(0);

    const position: number[][][] = [];

    // Assign the buttons to each player, player 1 gets red player 2 yellow
    /*useEffect(() => {
        if (player == 2) {
            setTurnPlayer(playerName2);
            console.log(playerName2)
            setTurnObject('/BtnYellow.svg');
        } else {
            setTurnPlayer(playerName1);
            console.log(playerName1)
            setTurnObject('/BtnRed.svg');
        }
    }, [turnPlayer]);*/

    useEffect(() => {
        audio.play();
    })

    const handleClick = () => {
        // This is to change the players turns, player 1 starts
        if (turnPlayer === playerName1) {
            setTurnPlayer(playerName2);
            setTurnObject('/BtnYellow.svg');
        } else {
            setTurnPlayer(playerName1);
            setTurnObject('/BtnRed.svg');
        }

    }

    let cnt = 0;
    const muteAudio = () => {
        if (cnt == 0) {
            audio.pause();
            cnt++;
        } else if (cnt == 1) {
            audio.play();
            cnt = 0;
        }
    }

    // We work with XYZ Coordinates so the backend does the wincheck based on the placement and uses coordinates for that
    // First of all we make a blank gameboard we also use that when we want to reset the game
    const initialBoard = Array(8)
        .fill(null)
        .map(() =>
            Array(8)
                .fill(null)
                .map(() => Array(8).fill(null))
        );

    const [board, setBoard] = useState(initialBoard);
    const [currentPlayer, setCurrentPlayer] = useState('X');

    // Each time a button (cell) gets clicked we send the coordinates to the websocket which sends them to the backend
    // If the field is already filled, an alert pops up
    const handleCellClick = (layer, row, col) => {
        if (!board[layer][row][col]) {
            const newBoard = [...board];
            newBoard[layer][row][col] = currentPlayer;
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
            setBoard(newBoard);
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
            console.log(layer + '' + row + '' + col)
            handleClick()

        } else {
            alert("Already filled!")
        }
    };

    // When we click on the restart button the bord gets filled with blank cells again
    const handleRestart = () => {
        setBoard(initialBoard)
    }

    // If we want to exit the game, we get back to the homescreen and disconnect from the Websocket
    const handleExit = () => {
        router.push('/')
        audio.pause();
        audio.currentTime = 0;
        disconnect()
    }

    // To get the player's color
    const getPlayerColor = (player) => {
        if (player === 'X') {
            return '/BtnYellow.svg';
        } else if (player === 'O') {
            return 'BtnRed.svg';
        } else {
            return 'BtnGrey.svg';
        }
    };

    // Gameboard frontend
    // Loop through the 4 layers the 4 rows and 4 cols, then place a cell on each iteration and give the cell a coordinate
    // based on the layer row and col (000, 001, 100, 110...)
    const renderGameBoard = () => {
        const gameBoard = [];

        for (let layer = 0; layer < 4; layer++) {
            const layerElement = (
                <div className="grid-container mb-10" key={layer}>
                    <div className="board-overlay">
                        <img className="object-contain absolute w-full"
                             src="/BlankGameboardSingle.svg" alt=""/>
                        {(() => {
                            const rows = [];
                            for (let row = 0; row < 4; row++) {
                                const cells = [];
                                for (let col = 0; col < 4; col++) {
                                    const player = board[layer][row][col];
                                    const cellColor = getPlayerColor(player);
                                    const id = `${layer}-${row}-${col}`;
                                    const cell = (
                                        <div className="cell" key={id}>
                                            <img
                                                id={id}
                                                src={cellColor}
                                                className="xl:w-14 m-[5px] lg:w-14 m-[5px] md:w-10 sm:w-8"// Adjust the margin here, and the cell size
                                                onClick={() => handleCellClick(layer, row, col)}
                                            />
                                        </div>
                                    );
                                    cells.push(cell);
                                }
                                const rowElement = (
                                    <div className="row" key={`${layer}-${row}`}>
                                        {cells}
                                    </div>
                                );
                                rows.push(rowElement);
                            }
                            return (
                                <div className="grid grid-cols-4 transform skew-x-[-45deg] xl:max-w-[265px] lg:max-w-[250px] lg:mb-10 md:max-w-[230px] ml-[60px] sm:max-w-[200px]">
                                    {rows}
                                </div>

                            );
                        })()}
                    </div>
                </div>
            );
            gameBoard.push(layerElement);
        }

        return (
            <div className="game-board z-10">
                {gameBoard}
            </div>
        );
    };

    // To see who's turn it is, which players are playing and the restart and exit button
    return (
        <>
            <div className='flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white'>
                <div>{screenWidth}</div>
                <h1 onClick={() => router.push("/")} className='w-full font-redundead md:text-4xl sm:text-2xl text-2xl font-bold text-yellow-700'>TIC·TAC·<span className='text-red-950'>Dead</span></h1>
                <ul className='hidden md:flex'> {/*}when collapsing the navbar on the top which would also collapse hides*/}
                    <li className='p-2'>
                        <button onClick={() => handleExit()}
                                className="whitespace-nowrap break-keep bg-black text-yellow-700 hover:bg-gray-100 font-semibold py-2 px-10 rounded shadow">
                            HOME
                        </button></li>
                </ul>
            </div>
            <div className='text-white gameBackground'>
                <div className='bg-black/50'>
                    <div
                        className='max-w-[1220px] mt-[-96px] w-full h-screen mx-auto grid md:grid-cols-3 gap-7 text-center flex justify-center'>
                        <div className='flex flex-col p-4 my-4 mt-56'>
                            <div
                                className='text-yellow-700 w-[250px] h-8 rounded-md font-medium mx-auto md:mx-0 font-redundead md:text-3xl mb-5'>
                                Turn: {turnPlayer}
                            </div>
                            <div
                                className='text-yellow-700 w-[250px] h-8 rounded-md font-bold mx-auto md:mx-0 font-mono'>
                                {playerName1}
                            </div>
                            <div
                                className='text-yellow-700 w-[250px] h-8 rounded-md font-bold mx-auto md:mx-0'>
                                {playerName2}
                            </div>
                            <div
                                className='text-yellow-700 w-[250px] h-8 rounded-md font-bold mx-auto md:mx-0'>
                                {player1Wins}
                            </div>
                            <div
                                className='text-yellow-700 w-[250px] h-8 rounded-md font-bold mx-auto md:mx-0'>
                                {player2Wins}
                            </div>
                            <Square></Square>
                            <button
                                className='bg-black text-yellow-700 w-[250px] h-12 rounded-md font-medium my-6 mx-auto md:mx-0 py-3'
                                onClick={() => muteAudio()}>Mute Audio
                            </button>
                            <button
                                className='bg-black text-yellow-700 w-[250px] h-12 rounded-md font-medium my-6 mx-auto md:mx-0 py-3'
                                onClick={() => handleRestart()}>Restart
                            </button>
                            <button
                                className='bg-black text-yellow-700 w-[250px] h-12 rounded-md font-medium my-6 mx-auto md:mx-0 py-3'
                                onClick={() => handleExit()}>Exit
                            </button>
                        </div>
                        <div
                            className="aspect-w-16 aspect-h-9 mt-32 flex flex-col md:aspect-w-9 md:aspect-h-12 sm:aspect-w-10 sm:aspect-h-10 relative">
                            {renderGameBoard()}
                            {/*<div className="mt-5">
                                <GameField stageNum={0}/>
                            </div>
                            <div className="mt-44">
                                <GameField stageNum={1}/>
                            </div>
                            <div className="mt-80">
                                <GameField stageNum={2}/>
                            </div>*/}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
