/*
    Author: Lucas Vollmann-Oswald, Franz Koinigg
    TICTACDEAD
*/

"use client"
import React, {SetStateAction, useEffect, useState} from 'react'

import {useRouter} from "next/navigation";
import {disconnect, connectPlayer, sendMessage, getUsedPlayers, setInitialWins} from "@/components/javascript/Socket";
import {winCnt1, winCnt2} from "@/components/javascript/Socket";
// eslint-disable-next-line react-hooks/rules-of-hooks

import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
let audio: HTMLAudioElement;
if(typeof Audio != "undefined") {
    audio = new Audio("DarkMusic.mp3");
}


// The gameboard implementation of the TicTacDead game (actual game)
export default function PlayGame() {
    // We get the playerName from the LocalStorage and display it then on the screen
    let playerName1: any = "Player1";
    let playerName2: any = "Player2";
    // See who's players turn it is
    const [turnPlayer, setTurnPlayer] = useState(playerName1)
    // To change the placement of the buttons (Color of Player 1 or Player 2)
    const [selectedPlayer, setSelectedPlayer] = useState(1);
    const [oldSelectedPlayer, setOldSelectedPlayer] = useState(1);
    // For the responsive design
    const [screenWidth, setScreenWidth] = useState(0);
    // To check how often each player won
    let player1Wins = winCnt1;
    let player2Wins = winCnt2;
    // Page routing
    const router = useRouter();
    const [turnObject, setTurnObject] = useState('/BtnGrey.svg')
    const [musicV, setMusicV] = useState(0);


    // This is used for responsiveness
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

    // Get the data from the local Storage (The names we set in the Playerselect page)
    let BASE_URL: string | null;
    if (typeof window !== 'undefined') {
        playerName1 = localStorage.getItem('playerName1');
        playerName2 = localStorage.getItem('playerName2');
        // selectedPlayer = localStorage.getItem('selectedPlayer')?.valueOf();
        BASE_URL = localStorage.getItem('BASE_URL');
        console.log(selectedPlayer);
    } else {
        console.log("Server side")
    }

    // To set the initial player (Player 1)
    useEffect(() => {
        setTurnPlayer(playerName1)
        connectPlayer(selectedPlayer)
        if (typeof Audio !== 'undefined') {
            audio.play();
        }
        //alert("Press Start before you play!");
    }, [])

    // Part of the audio Player
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

    // Assign the buttons to each player, player 1 gets red player 2 yellow
    useEffect(() => {
        if (selectedPlayer == 2) {
            // setTurnPlayer(playerName2);
            console.log(playerName2)
            setTurnObject('/BtnYellow.svg');
            setSelectedPlayer(1);
        } else {
            // setTurnPlayer(playerName1);
            console.log(playerName1)
            setTurnObject('/BtnRed.svg');
            setSelectedPlayer(2);
        }
    }, [turnPlayer]);

    const handleClick = () => {
        // This is to change the players turns, player 1 starts
        if (turnPlayer === playerName1) {
            if (playerName2 !== null) {
                setTurnPlayer(playerName2);
                //setOldSelectedPlayer(playerName1)
                // setTurnObject('/BtnYellow.svg');
            }
        } else {
            if (playerName1 !== null) {
                setTurnPlayer(playerName1);
                //setOldSelectedPlayer(playerName2)
                // setTurnObject('/BtnRed.svg');
            }
        }

    }

    // We work with XYZ Coordinates so the backend does the wincheck based on the placement and uses coordinates for that
    // First of all we make a blank gameboard we also use that when we want to reset the game
    // This is the inital Array we have, on this array we set the placement of the buttons and send each coordinate to the websocket
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
    const handleCellClick = (layer: number, row: number, col: number) => {
        if (!board[layer][row][col]) {
            handleClick()
            //console.log(layer + '' + row + '' + col)
            sendMessage(layer, row, col, selectedPlayer); // Send the coordinates and the current Player to the websocket
            const newBoard = [...board];
            newBoard[layer][row][col] = currentPlayer;
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X'); // To check which player's turn it is (X O for simplification)
            setBoard(newBoard);
        } else {
            alert("Already filled!")
        }
    };

    // Websocket fill -> Backup
    const fillCell = (layer: number, row: number, col: number) => {
        const newBoard = [...board];
        newBoard[layer][row][col] = currentPlayer;
        //  setBoard(newBoard);
        // setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }

    // When we click on the restart button the bord gets filled with blank cells again
    // If we restart the game we reconnect each player and start the game again, whilst keeping the winCounter the same
    const handleRestart = async () => {
        let cntStart = localStorage.getItem('cntStart');
        setBoard(initialBoard)
        await sendMessage(0, 1, -4, selectedPlayer)
        await disconnect();
        player1Wins = winCnt1;
        player2Wins = winCnt2;
        await getUsedPlayers();
        await connectPlayer(1)
        await connectPlayer(2)
        if (cntStart == "1") {
            localStorage.setItem('cntStart', "2");
            window.location.reload()
        }
    }

    // If we want to exit the game, we get back to the homescreen and disconnect from the Websocket, music turns off
    // The win Counter gets resetted and the players can reconnect again in the lobby
    const handleExit = () => {
        sendMessage(0, 1, -4, selectedPlayer)
        disconnect();
        setInitialWins();
        router.push('/')
        audio.pause();
        audio.currentTime = 0;
        player1Wins = 0;
        player2Wins = 0;
        localStorage.setItem('cntStart', "1");
    }

    // To get the player's color (for changing the color when setting the buttons)
    const getPlayerColor = (player: any) => {
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
                                <div
                                    className="grid grid-cols-4 transform skew-x-[-45deg] xl:max-w-[265px] lg:max-w-[250px] lg:mb-10 md:max-w-[230px] ml-[60px] sm:max-w-[200px]">
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


    // WEBSOCKET CONNECTION -> Now in Socket.js
    /*let stompClient = null;

    const connectPlayer= (playernum) =>{

        let socket = new SockJS(BASE_URL+'/connections');
        stompClient = Stomp.over(socket as WebSocket);
        stompClient.connect({}, function (frame) {
            // setConnected(true);
            console.log('Connected: ' + frame);
            stompClient.subscribe('/player/msg', function (message) {
                receiveMessage(JSON.parse(message.body));
            });
            stompClient.send("/app/player", {}, JSON.stringify({"xyz": -203, "player": playernum}));
        });

        let requestOptions = {
            method: 'POST',
            redirect: 'follow'
        };

        console.log("Connecting to Player: " +playernum);

        fetch(BASE_URL+"/usingPlayer/"+playernum, requestOptions as RequestInit)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }*/

    /*const sendMessage = (layer, row, col) =>{
        const message = col+''+row+''+layer
        const json ={
            "xyz" : message.valueOf(),
            "player": 1
        }
        if(stompClient != null) {
            stompClient.send("/app/player", {}, JSON.stringify(json) as String);
        }else{
            console.log("socket is not connected!!")
        }
    }*/

    const receiveMessage = (message: any) => {
        if (message.x < 0) {
            if (message.z == 3) {
                if (message.player == 1) {
                    // setConnected(false, null);
                    // handlePlayer(true)
                } else {
                    // setConnected(null, false);
                    // handlePlayer2(true)
                }
            } else if (message.z == 2) {
                if (message.player == 1) {
                    // setConnected(true, null);
                    // handlePlayer(false)
                } else {
                    // setConnected(null, true);
                    // handlePlayer2(false)
                }
            }
            if (message.x == -4 && message.y == 0 && message.z == 3 && message.player == selectedPlayer) {
                /* ToDo: Wrong Placement from this Player */
                //$("#messages").append("<tr><td>Wrong Placement!</td></tr>");
                // alert("JS: Wrong Placement!")
            } else if (message.x == -4 && message.y == 0 && message.z == 3 && message.player != selectedPlayer) {
                /* ToDo: Wrong Placement from other Player */
            } else if (message.x == -2 && message.y == 0 && message.z == 0) {
                if (selectedPlayer != message.player) {
                    // dummyLoose()
                } else {
                    // dummyWin()
                }
            }
        }
    }

    /*const disconnect = () => {
        if (stompClient !== null) {
            stompClient.disconnect();
        }
    }*/

    const hideButton = () => {
        //window.location.reload();
    };

    // To see who's turn it is, which players are playing and the restart and exit button and the gameboard all together
    return (
        <>
            <div className='flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white'>
                <div>{screenWidth}</div>
                <h1 onClick={() => router.push("/")}
                    className='w-full font-redundead md:text-4xl sm:text-2xl text-2xl font-bold text-yellow-700'>TIC·TAC·<span
                    className='text-red-950'>Dead</span></h1>
                <ul className='hidden md:flex'> {/*}when collapsing the navbar on the top which would also collapse hides*/}
                    <li className='p-2'>
                        <button onClick={() => handleExit()}
                                className="whitespace-nowrap break-keep bg-black text-yellow-700 hover:bg-gray-100 font-semibold py-2 px-10 rounded shadow">
                            HOME
                        </button>
                    </li>
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
                                Player 1: {playerName1}
                            </div>
                            <div
                                className='text-yellow-700 w-[250px] h-8 rounded-md font-bold mx-auto md:mx-0 font-mono'>
                                Player 2: {playerName2}
                            </div>
                            <div
                                className='text-yellow-700 w-[250px] h-8 rounded-md font-bold mx-auto md:mx-0'>
                                Wins {playerName1}: {player1Wins}
                            </div>
                            <div
                                className='text-yellow-700 w-[250px] h-8 rounded-md font-bold mx-auto md:mx-0'>
                                Wins {playerName2}: {player2Wins}
                            </div>
                            <button
                                className='bg-black text-yellow-700 w-[250px] h-12 rounded-md font-medium my-6 mx-auto md:mx-0 py-3'
                                onClick={() => muteAudio()}>Mute Audio
                            </button>
                            <button
                                className='bg-black text-yellow-700 w-[250px] h-12 rounded-md font-medium my-6 mx-auto md:mx-0 py-3'
                                onClick={() => handleRestart()}>Start / Restart
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
