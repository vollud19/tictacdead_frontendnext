import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

const BASE_URL = 'http://192.168.253.241:8080'


// getUsedPlayers, connectPlayer, sendMessage, showMessage, dummyWin, dummyLoose, disconnect
var stompClient = null;

export var player;

export function getUsedPlayers(){
    var socket = new SockJS(BASE_URL+'/connections');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/player/msg', function (message) {
            console.log(message.body);
            showMessage(JSON.parse(message.body));
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
        .then(result => setLobbyConnected(result.player1, result.player2))
        .catch(error => console.log('error', error));
}



export function connectPlayer(playernum) {
    disconnectFromLobby();

    var socket = new SockJS(BASE_URL+'/connections');
    player = playernum;
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        // setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/player/msg', function (message) {
            console.log(message.body);
            showMessage(JSON.parse(message.body));
        });
        stompClient.send("/app/player", {}, JSON.stringify({'xyz': -203, 'player': player}));
    });



    var requestOptions = {
        method: 'POST',
        redirect: 'follow'
    };

    fetch(BASE_URL+"/usingPlayer/"+player, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));


}

export function sendMessage(layer, row, col){
    const message = col+''+row+''+layer
    stompClient.send("/app/player", {}, JSON.stringify({'xyz': message.valueOf(), 'player': player}));
}

export function showMessage(message) {

    if (message.x < 0){
        if (message.z == 3){
            if (message.player == 1){
                setConnected(false, null);
            }
            else {
                setConnected(null, false);
            }
        }
        else if(message.z == 2) {
            if (message.player == 1){
                setConnected(true, null);
            }
            else {
                setConnected(null, true);
            }
        }
        if (message.x == -4 && message.y == 0 && message.z == 3 && message.player == player){
            /* ToDo: Wrong Placement from this Player */
            //$("#messages").append("<tr><td>Wrong Placement!</td></tr>");
        }
        else if (message.x == -4 && message.y == 0 && message.z == 3 && message.player != player){
            /* ToDo: Wrong Placement from other Player */
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
        //$("#messages").append("<tr><td>" + message.x + message.y + message.z + " player: "+ message.player +"</td></tr>");
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

export function setLobbyConnected(player1, player2) {
    //$("#disconnect").prop("disabled", true);
    //$("#messages").html("");
    if (player1 != null){
        //$("#connect1").prop("disabled", !player1);
    }
    if (player2 != null){
        //$("#connect2").prop("disabled", !player2);
    }
}

export function disconnectFromLobby() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
}
