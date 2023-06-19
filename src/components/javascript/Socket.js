/*
    Author: Franz Koinigg
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

/*
       X : Col
       Y : Row
       Z : Layer
*/

// getUsedPlayers, connectPlayer, sendMessage, showMessage, dummyWin, dummyLoose, disconnect
let stompClient = null;


function handlePlayerOne(cond) {
    let _playerOne = cond;
    const player1Div = document.getElementById('player1');
    if (!_playerOne && player1Div) {
        player1Div.style.backgroundColor = 'black';
        player1Div.style.pointerEvents = 'none';
        console.log("_playerOne clicked on select")
    }else{
        player1Div.style.backgroundColor = 'white';
        player1Div.style.pointerEvents = 'auto';
    }
};

 function handlePlayerTwo (cond){
    let _playerTwo = cond;
    const player2Div = document.getElementById('player2');
    if (!_playerTwo && player2Div) {
        player2Div.style.backgroundColor = 'black';
        player2Div.style.pointerEvents = 'none';
        console.log("_playerTwo clicked on select")
    }
    else{
        player2Div.style.backgroundColor = 'white';
        player2Div.style.pointerEvents = 'auto';
    }
}

export var player;

export function getUsedPlayers() {
    var socket = new SockJS(BASE_URL+'/connections');
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


    fetch(BASE_URL+"/usedPlayers", requestOptions)
        .then(response =>  {
            return response.json();
        })
        .then(result => {
            setLobbyConnected(result.player1, result.player2)
        })
        .catch(error => console.log('error', error));
}



export function connectPlayer(playernum) {
    disconnectFromLobby();
    let socket = new SockJS(BASE_URL+'/connections');
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

    console.log("Connecting to Player: " +player);

    fetch(BASE_URL+"/usingPlayer/"+player, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

}

export function sendMessage(layer, row, col, selectedPlayer) {
    const message = col+''+row+''+layer
    const json = {
        "xyz" : message.valueOf(),
        "player": selectedPlayer
    }
    console.log("WATCHOUTFORTHIS!")
    console.log("PlayerNUMBE: " + selectedPlayer)
    stompClient.send(`/app/player`, {}, JSON.stringify(json));
}


export const receiveMessage = async (message) => {

        if (message.x == -4 && message.y == 0 && message.z == 3 && message.player == player) {
            /* ToDo: Wrong Placement from this Player */
            //$("#messages").append("<tr><td>Wrong Placement!</td></tr>");
            // alert("JS: Wrong Placement!")
        } else if (message.x == -4 && message.y == 0 && message.z == 3 && message.player != player) {
            /* ToDo: Wrong Placement from other Player */
        } else if (message.x == -2 && message.y == 0 && message.z == 0) {
            if (player != message.player) {
                // dummyLoose()
                alert("Player " + 1 + " won!")
                //alert("You have Lost!")
            } else {
                // dummyWin()
                alert("Player " + 2 + " won!")
            }
        }
    else {
        // handleCellClick(message.z, message.y, message.x)
        // console.log("MESSAGE");
        // console.log(message.z, message.y, message.x)
       // fillCell(message.z, message.y, message.x)

            document.getElementById('')

    }

}

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

    export function disconnectFromLobby(){
        if (stompClient !== null && stompClient.status === 'CONNECTED') {
            stompClient.disconnect();

        }
    }

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

        fetch(BASE_URL + "/releasePlayer/" + player, requestOptions)
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

    const setLobbyConnected = async (player1, player2) => {
        //$("#disconnect").prop("disabled", true);
        //$("#messages").html("");
        // console.log("AJFKLAJFKLJF")
        await handlePlayerOne(player1);

        await handlePlayerTwo(player2);
    }
