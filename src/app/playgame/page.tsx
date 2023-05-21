"use client"
import React, {useState} from 'react'
import Link from "next/link";
import Navbar from '../../components/ui/Navbar'
import styles from '../../app/styles/Game.module.css'
import Typed from "react-typed";
import {router} from "next/client";
import {useRouter} from "next/navigation";
import {TileLayer, FeatureGroup} from "react-leaflet"
import {EditControl} from "react-leaflet-draw"
import Square from "@/components/ui/Square";
import {render} from "react-dom";

export default function PlayGame() {
    let playerName1 = localStorage.getItem('playerName1');
    let playerName2 = localStorage.getItem('playerName2');
    let player1Wins = 0;
    let player2Wins = 0;
    const router = useRouter();

    const [turnPlayer, setTurnPlayer] = useState(playerName1)
    const [turnObject, setTurnObject] = useState('/BtnGrey.svg')

    const position: number[][][] = [];

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
// XYZ Koordinaten!
    const GameField = ({stageNum}) => {
        return <div className="flex flex-col h-0 ml-3 space-y-[-10px] relative z-10">
            <div className='max-w-[1240px] mx-auto grid md:grid-cols-1 gap-4'>
                <img id="00" src={turnObject} className="w-14" onClick={() => handleClick(stageNum, 0)}/>
            </div>
            <div className='max-w-[1240px] mx-auto grid md:grid-cols-2 gap-8'>
                <img id="01" src={turnObject} className="w-14" onClick={() => handleClick(stageNum, 1)}/>
                <img id="10" src={turnObject} className="w-14" onClick={() => handleClick(stageNum, 2)}/>
            </div>
            <div className='max-w-[1240px] mx-auto grid md:grid-cols-3 gap-10'>
                <img id="02" src="/BtnGrey.svg" className="w-14" onClick={() => handleClick(stageNum, 3)}/>
                <img id="03" src="/BtnGrey.svg" className="w-14" onClick={() => handleClick(stageNum, 4)}/>
                <img id="5" src="/BtnGrey.svg" className="w-14" onClick={() => handleClick(stageNum, 5)}/>
            </div>
            <div className='max-w-[1240px] mx-auto grid md:grid-cols-4 gap-10'>
                <img id="6" src="/BtnGrey.svg" className="w-14" onClick={() => handleClick(stageNum, 6)}/>
                <img id="7" src="/BtnGrey.svg" className="w-14" onClick={() => handleClick(stageNum, 7)}/>
                <img id="8" src="/BtnGrey.svg" className="w-14" onClick={() => handleClick(stageNum, 8)}/>
                <img id="9" src="/BtnGrey.svg" className="w-14" onClick={() => handleClick(stageNum, 9)}/>
            </div>
            <div className='max-w-[1240px] mx-auto grid md:grid-cols-3 gap-10'>
                <img id="10" src="/BtnGrey.svg" className="w-14" onClick={() => handleClick(stageNum, 10)}/>
                <img id="11" src="/BtnGrey.svg" className="w-14" onClick={() => handleClick(stageNum, 11)}/>
                <img id="12" src="/BtnGrey.svg" className="w-14" onClick={() => handleClick(stageNum, 12)}/>
            </div>
            <div className='max-w-[1240px] mx-auto grid md:grid-cols-2 gap-8'>
                <img id="13" src="/BtnGrey.svg" className="w-14" onClick={() => handleClick(stageNum, 13)}/>
                <img id="14" src="/BtnGrey.svg" className="w-14" onClick={() => handleClick(stageNum, 14)}/>
            </div>
            <div className='max-w-[1240px] mx-auto grid md:grid-cols-1 gap-4'>
                <img id="15" src="/BtnGrey.svg" className="w-14" onClick={() => handleClick(stageNum, 15)}/>
            </div>
        </div>
    }

    const initialBoard = Array(4)
        .fill(null)
        .map(() =>
            Array(4)
                .fill(null)
                .map(() => Array(4).fill(null))
        );

    const [board, setBoard] = useState(initialBoard);
    const [currentPlayer, setCurrentPlayer] = useState('X');

    const handleCellClick = (layer, row, col) => {
        if (!board[layer][row][col]) {
            const newBoard = [...board];
            newBoard[layer][row][col] = currentPlayer;
            setBoard(newBoard);
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
            console.log(layer + '' + row + '' + col)
            handleClick()
        } else {
            alert("Already filled!")
        }
    };

    const handleRestart = () => {
        setBoard(initialBoard)
    }

    const getPlayerColor = (player) => {
        if (player === 'X') {
            return '/BtnYellow.svg';
        } else if (player === 'O') {
            return 'BtnRed.svg';
        } else {
            return 'BtnGrey.svg';
        }
    };


    const renderGameBoard = () => {
        const gameBoard = [];

        for (let layer = 0; layer < 4; layer++) {
            const layerElement = (
                <div className="grid-container" key={layer}>
                    {(() => {
                        const rows = [];
                        for (let row = 0; row < 4; row++) {
                            const cells = [];
                            for (let col = 0; col < 4; col++) {
                                const player = board[layer][row][col];
                                const cellColor = getPlayerColor(player);
                                const id = `${layer}-${row}-${col}`; // Generate the id for the image
                                const cell = (
                                    <div className="cell" key={id}>
                                        <img
                                            id={id}
                                            src={cellColor}
                                            className="w-14"
                                            onClick={() => handleCellClick(layer, row, col)} // Pass the id to the click handler
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
                            <div className="grid grid-cols-4">
                                {rows}
                            </div>
                        );
                    })()}
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


    return (
        <>
            <Navbar></Navbar>
            <div className='text-white gameBackground'>
                <div className='bg-black/50'>
                    <div
                        className='max-w-[1100px] mt-[-96px] w-full h-screen mx-auto grid md:grid-cols-3 gap-7 text-center flex justify-center'>
                        <div className='flex flex-col p-4 my-4 mt-80'>
                            Turn: {turnPlayer}
                            <p>{playerName1}</p>
                            <p>{playerName2}</p>
                            <p>{player1Wins}</p>
                            <p>{player2Wins}</p>
                            <Square></Square>
                            <button
                                className='bg-black text-yellow-700 w-[200px] h-12 rounded-md font-medium my-6 mx-auto md:mx-0 py-3'
                                onClick={() => handleRestart()}>Restart
                            </button>
                            <button
                                className='bg-black text-yellow-700 w-[200px] h-12 rounded-md font-medium my-6 mx-auto md:mx-0 py-3'
                                onClick={() => router.push('/')}>Exit
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

                            <img className="object-contain mt-[-30px]" src="/BlankGamefield.svg" alt=""/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}