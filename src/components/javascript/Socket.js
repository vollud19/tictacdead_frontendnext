/*
    Author: Franz Koinigg,
    TICTACDEAD
 */

import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import handleCellClick from 'src/app/playgame/page'
import fillCell from 'src/app/playgame/page'
// import handlePlayer1 from 'src/app/playerselect/page'
import handlePlayer2 from 'src/app/playerselect/page'
import Page from "src/app/playerselect/page";
import PlayerSelectMenu from "src/app/playerselect/page";

export const BASE_URL = 'http://localhost:8080'
let audio = new Audio("Audiio_GongPluse.wav");
let audio2 = new Audio("CreepyLaughter.mp3");
export let winCnt1 = 0;
export let winCnt2 = 0;

/*
       X : Col
       Y : Row
       Z : Layer
*/

// getUsedPlayers, connectPlayer, sendMessage, showMessage, dummyWin, dummyLoose, disconnect
let stompClient = null;

// To set the color of Player 1 in the Playerselect menu field black and unclickable if one player already clicked (Disable from the websocket)
function handlePlayerOne(cond) {
    let _playerOne = cond;
    const player1Div = document.getElementById('player1');
    try {
        if (!_playerOne && player1Div) {
            player1Div.style.backgroundColor = 'black';
            player1Div.style.pointerEvents = 'none';
            console.log("_playerOne clicked on select")
        } else {
            player1Div.style.backgroundColor = 'white';
            player1Div.style.pointerEvents = 'auto';
        }
    } catch (e) {
        console.log("Color set!")
    }

}

// To set the color of Player 2 in the Playerselect menu field black and unclickable if one player already clicked (Disable from the websocket)
function handlePlayerTwo(cond) {

    let _playerTwo = cond;
    const player2Div = document.getElementById('player2');
    try {
        if (!_playerTwo && player2Div) {
            player2Div.style.backgroundColor = 'black';
            player2Div.style.pointerEvents = 'none';
            console.log("_playerTwo clicked on select")
        } else {
            player2Div.style.backgroundColor = 'white';
            player2Div.style.pointerEvents = 'auto';
        }
    } catch (e) {
        console.log("Color set!")
    }
}

export var player;

// To get the players that are currently in use. Make a new connection
export function getUsedPlayers() {
    var socket = new SockJS(BASE_URL + '/connections');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/player/msg', function (message) {
            console.log(message.body);
            receiveLobbyMessage(JSON.parse(message.body));
        });
    });

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(BASE_URL + "/usedPlayers", requestOptions)
        .then(response => {
            return response.json();
        })
        .then(result => {
            setLobbyConnected(result.player1, result.player2)
        })
        .catch(error => console.log('error', error));
}


// To connect the player that registered for the game
export function connectPlayer(playernum) {
    disconnectFromLobby();
    let socket = new SockJS(BASE_URL + '/connections');
    player = playernum;
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        // setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/player/msg', function (message) {
            console.log(message.body);
            receiveMessage(JSON.parse(message.body));
        });
        stompClient.send("/app/player", {}, JSON.stringify({"xyz": -203, "player": player}));
    });

    let requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };

    console.log("Connecting to Player: " + player);

    fetch(BASE_URL + "/usingPlayer/" + player, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

}

// Send the message to the backend which contains the coordinates of the player and the player Number to validate
export function sendMessage(layer, row, col, selectedPlayer) {
    const message = col + '' + row + '' + layer
    const json = {
        "xyz": message.valueOf(),
        "player": selectedPlayer
    }
    console.log("Playernumber: " + selectedPlayer)
    stompClient.send(`/app/player`, {}, JSON.stringify(json));
}


// Receive the messages from the websocket backend to check if there is a winner, then we play a sound and increase the counter of the
// specific person that won

// Codes for the Backend
/*
    # -200 Win
    # -404 Loose
    # -409 Draw (if all fields are filled)
    # -403 Wrong Placement

    # XYZ Position if valid Placement

    # -201 Player 1 already in use
    # -202 Player 2 already in use
 */
export const receiveMessage = async (message) => {
    if (message.x === -4 && message.y === 0 && message.z === 3 && message.player == player) {
        // Wrong placement is handled by the frontend already!
        //$("#messages").append("<tr><td>Wrong Placement!</td></tr>");
        // alert("JS: Wrong Placement!")
    } else if (message.x === -4 && message.y === 0 && message.z === 3 && message.player != player) {
        // Wrong placement is handled by the frontend already!
    } else if (message.x === -2 && message.y === 0 && message.z === 0) {
        let msgCnt = 1;
        if (player == message.player) {
            // dummyLoose()
            if (msgCnt === 1) {
                await audio.play();
                await audio2.play();
                alert("Player " + 1 + " won!");
                msgCnt = 0;
                winCnt1++;
            }
            //alert("You have Lost!")
        } else {
            // dummyWin()
            if (msgCnt === 1) {
                await audio.play();
                await audio2.play();
                await alert("Player " + 2 + " won!")
                msgCnt = 0;
                winCnt2++;
            }
        }
    } else if (message.x === -4 && message.y === 0 && message.z === 9) {
        await audio.play();
        alert("It's a draw!")
    } else {
        // handleCellClick(message.z, message.y, message.x)
        // fillCell(message.z, message.y, message.x)
    }
}

// To set the color of the player select fields black, so the next person cannot select the same player
export const receiveLobbyMessage = async (message) => {
    if (message.x < 0) {
        if (message.z == 3) {
            if (message.player == 1) {
                // setConnected(false, null);
                handlePlayerOne(false)
            } else {
                // setConnected(null, false);
                handlePlayerTwo(false)
            }
        } else if (message.z == 2) {
            if (message.player == 1) {
                // setConnected(true, null);
                handlePlayerOne(true)
            } else {
                // setConnected(null, true);
                handlePlayerTwo(true)
            }
        }
    }
}

/*export function dummyWin() {
    //$("#messages").append("<tr><td>YOU SURVIVED!</td></tr>");
}

export function dummyLoose() {
    //$("#messages").append("<tr><td>YOU ARE DEAD!</td></tr>");
}*/

// After a player has clicked on the player on playerselect it disconnects from the lobby and connects to the game
export function disconnectFromLobby() {
    if (stompClient !== null && stompClient.status === 'CONNECTED') {
        stompClient.disconnect();
    }
}

// Is called when the game gets exited (Wins resetted to 0)
export function setInitialWins() {
    winCnt1 = 0;
    winCnt2 = 0;
}

// If the player decides to exit the game, the players get disconnected
export function disconnect() {
    stompClient.send("/app/player", {}, JSON.stringify({'xyz': -202, 'player': player}));
    if (stompClient !== null) {
        stompClient.disconnect();
    }

    console.log("Disconnected");

    //$("#disconnect").prop("disabled", false);

    var requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };

    fetch(BASE_URL + "/releasePlayer/" + 1, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

    fetch(BASE_URL + "/releasePlayer/" + 2, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}


export function setConnected(player1, player2) {
    //$("#disconnect").prop("disabled", false);
    //$("#messages").html("");
    if (player1 != null) {
        //$("#connect1").prop("disabled", !player1);
    }
    if (player2 != null) {
        //$("#connect2").prop("disabled", !player2);
    }
}

// Wait until the player loaded into the gamescreen then set the color of the field in playerselect to either black or white
const setLobbyConnected = async (player1, player2) => {
    //$("#disconnect").prop("disabled", true);
    //$("#messages").html("");
    // console.log("AJFKLAJFKLJF")
    await handlePlayerOne(player1);

    await handlePlayerTwo(player2);
}
