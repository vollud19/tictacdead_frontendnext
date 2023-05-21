import React, { useState } from 'react';

// ONLY FOR THE USE OF NOTES!!!

const TicTacToe = () => {
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
        }
    };

    const getPlayerColor = (player) => {
        return player === 'X' ? 'bg-yellow-500' : 'bg-red-500';
    };

    const renderGameBoard = () => {
        const gameBoard = [];
        for (let layer = 0; layer < 4; layer++) {
            const layerRows = [];
            for (let row = 0; row < 4; row++) {
                const cells = [];
                for (let col = 0; col < 4; col++) {
                    const player = board[layer][row][col];
                    const cellColor = getPlayerColor(player);
                    const cell = (
                        <button
                            className={`cell ${cellColor}`}
                            key={`${layer}-${row}-${col}`}
                            onClick={() => handleCellClick(layer, row, col)}
                        >
                            {player}
                        </button>
                    );
                    cells.push(cell);
                }
                const rowElement = <div className="row" key={`${layer}-${row}`}>{cells}</div>;
                layerRows.push(rowElement);
            }
            const layerElement = <div className="layer" key={layer}>{layerRows}</div>;
            gameBoard.push(layerElement);
        }
        return gameBoard;
    };

    return (
        <div className="tic-tac-toe">
            {renderGameBoard()}
            <div className="current-player">Current Player: {currentPlayer}</div>
        </div>
    );
};

// Working

const renderGameBoard = () => {
    const gameBoard = [];

    for (let layer = 0; layer < 4; layer++) {
        const layerRows = [];
        const layerElement = (
            <div className="flex flex-col h-0 ml-3 space-y-[-10px] relative z-10" key={layer}>
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
                        <div className="grid grid-cols-4 gap-4">
                            {rows}
                        </div>
                    );
                })()}
            </div>
        );
        gameBoard.push(layerElement);
    }

    return gameBoard;
};

const renderGameBoard = () => {
    const gameBoard = [];

    for (let layer = 0; layer < 4; layer++) {
        const layerElement = (
            <div className="flex flex-col h-0 ml-3 space-y-[-10px] relative z-10" style={{marginBottom: '20px'}}
                 key={layer}>
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
                        <div className="grid grid-cols-4 gap-4">
                            {rows}
                        </div>
                    );
                })()}
            </div>
        );
        gameBoard.push(layerElement);
    }

    return gameBoard;
};


// OKAYISH FORMAT
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

export default TicTacToe;
