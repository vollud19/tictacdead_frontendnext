import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import fillCell from 'src/app/playgame/page'
// import handlePlayer1 from 'src/app/playerselect/page'
import handlePlayer2 from 'src/app/playerselect/page'
import Page from "src/app/playerselect/page";
import PlayerSelectMenu from "src/app/playerselect/page";

// export const BASE_URL = 'http://192.168.82.241:8080'
export const BASE_URL = 'localhost'

/*
       X : Col
       Y : Row
       Z : Layer
*/

// getUsedPlayers, connectPlayer, sendMessage, showMessage, dummyWin, dummyLoose, disconnect
var stompClient = null;


function handlePlayer1(cond) {
    let _playerOne = cond;
    const player1Div = document.getElementById('player1');
    if (!_playerOne && player1Div) {
        player1Div.style.backgroundColor = 'black';
        player1Div.style.pointerEvents = 'none';
        console.log("_playerOne clicked on select")
    }
};

export var player;

export function getUsedPlayers(){
    var socket = new SockJS(BASE_URL+'/connections');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/player/msg', function (message) {
            console.log(message.body);
            receiveMessage(JSON.parse(message.body));
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

export function sendMessage(layer, row, col){
    const message = col+''+row+''+layer
    const json ={
        "xyz" : message.valueOf(),
        "player": 1
    }
    stompClient.send("/app/player", {}, JSON.stringify(json));
}


/*export function showMessage(message) {

    if (message.x < 0){
        if (message.z == 3){
            if (message.player == 1){
                // setConnected(false, null);
                handlePlayer1(true)
            }
            else {
                // setConnected(null, false);

                handlePlayer2(true)
            }
        }
        else if(message.z == 2) {
            if (message.player == 1){
                // setConnected(true, null);
                // handlePlayer(false)
            }
            else {
                // setConnected(null, true);
                handlePlayer2(false)
            }
        }
        if (message.x == -4 && message.y == 0 && message.z == 3 && message.player == player){
            /* ToDo: Wrong Placement from this Player
            //$("#messages").append("<tr><td>Wrong Placement!</td></tr>");
           // alert("JS: Wrong Placement!")
        }else if (message.x == -4 && message.y == 0 && message.z == 3 && message.player != player){
            /* ToDo: Wrong Placement from other Player
        }
        else if (message.x == -2 && message.y == 0 && message.z == 0){
            if (player != message.player){
                // dummyLoose()
            }
            else{
                // dummyWin()
            }
        }
    }
    else{
        fillCell(message.z, message.y, message.x);
        //$("#messages").append("<tr><td>" + message.x + message.y + message.z + " player: "+ message.player +"</td></tr>");
    }
}*/

export const receiveMessage = async (message) => {

    if (message.x < 0) {
        if (message.z == 3) {
            if (message.player == 1) {
                // setConnected(false, null);
                handlePlayer1(false)
            } else {
                // setConnected(null, false);
                handlePlayer2(false)
            }
        } else if (message.z == 2) {
            if (message.player == 1) {
                // setConnected(true, null);
                handlePlayer1(true)
            } else {
                // setConnected(null, true);
                handlePlayer2(true)
            }
        }
        if (message.x == -4 && message.y == 0 && message.z == 3 && message.player == player) {
            /* ToDo: Wrong Placement from this Player */
            //$("#messages").append("<tr><td>Wrong Placement!</td></tr>");
            // alert("JS: Wrong Placement!")
        } else if (message.x == -4 && message.y == 0 && message.z == 3 && message.player != player) {
            /* ToDo: Wrong Placement from other Player */
        } else if (message.x == -2 && message.y == 0 && message.z == 0) {
            if (player != message.player) {
                // dummyLoose()
            } else {
                // dummyWin()
            }
        }
    }
}

export function dummyWin(){
    //$("#messages").append("<tr><td>YOU SURVIVED!</td></tr>");
}

export function dummyLoose(){
    //$("#messages").append("<tr><td>YOU ARE DEAD!</td></tr>");
}

export function disconnect() {
    stompClient.send(BASE_URL+"/app/player", {}, JSON.stringify({'xyz': -202, 'player': player}));
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    if (player == 1){
        setConnected(true, null);
    }
    else {
        setConnected(null, true);
    }
    console.log("Disconnected");

    //$("#disconnect").prop("disabled", false);

    var requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };

    fetch(BASE_URL+"/releasePlayer/"+player, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

export function setConnected(player1, player2) {
    //$("#disconnect").prop("disabled", false);
    //$("#messages").html("");
    if (player1 != null){
        //$("#connect1").prop("disabled", !player1);
    }
    if (player2 != null){
        //$("#connect2").prop("disabled", !player2);
    }
}

const setLobbyConnected = async (player1, player2) => {
    //$("#disconnect").prop("disabled", true);
    //$("#messages").html("");
    console.log("AJFKLAJFKLJF")
        await handlePlayer1(player1);
        await handlePlayer2(player2)

}

export function disconnectFromLobby() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
}
