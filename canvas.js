let canvas;
let ctx;
const HOST = window.location.protocol + "//" + window.location.hostname + ((window.location.port) ? ":" + window.location.port : "");
const WS_HOST = "ws://" + window.location.hostname + ((window.location.port) ? ":" + window.location.port : "");
let connection;

let imgUp = [];
let imgDown = [];
let imgLeft = []
let imgRight =  [];

let play = true;

let player = {};
const pauseTime = 0;

function preloadImgs(arr, direction){
    for (let i = 0; i < 4; i++){
        let frame = new Image;
        frame.src = "./sprites/Character/move_" + direction + i + ".png";
        arr.push(frame);
    }
    console.log(arr);
}
function onLoad() {
    preloadImgs(imgUp, "back");
    preloadImgs(imgDown, "front");
    preloadImgs(imgLeft, "left");
    preloadImgs(imgRight, "right");

    player.x = 0;
    player.y = 0;
    let img = new Image();
    img.src = "./sprites/Character/move_front1.png";
    player.src = "./sprites/Character/move_front1.png";
    player.img = img;
    player.movDir = "down";
    player.sameDirMov = 0;
    player.up = false;
    player.down = false;
    player.left = false;
    player.right = false;

    let url = `${HOST}/hraci/add?name=Robin`;
    fetch(url).then(function (response) {
        response.text().then(function (text) {
            let obj = JSON.parse(text);
            player.uid = obj.uid;
            console.log("uid: "+player.uid);
            setInterval(posliWsZpravu, 10);
        }).catch((error) => {
            ukazChybu(error);
        });
    });

canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");


    connection = new WebSocket(WS_HOST);
    connection.onmessage = e => {
        let players = JSON.parse(e.data);
        document.getElementById("dialog_window").innerHTML = "";
        document.getElementById("dialog_window").innerHTML = "Dialogové&#10 okno:&#10 " ;

        for (let o of players){

            if (o.uid === player.uid){
                player = o;
            }
            drawPlayer(o);
        }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

}
/*
function startGame(){
       setTimeout(anim, pauseTime); // starts the "paused loop"
}
function anim(){
    drawPlayer(player); // what the "paused while loop" should do
    if (play){ // condition of "paused while loop"
       startGame(); // goes back to startGame(), pausing to script by pauseTime
    }
}
*/
 */
function drawPlayer(player){
    ctx.clearRect(0,0, canvas.width, canvas.height);

    switch (player.movDir) {
        case "up":
          //  player.src = "./sprites/Character/move_back" + player.sameDirMov + ".png";
            player.img = imgUp[player.sameDirMov];
            break;
        case "down":
          //  player.src = "./sprites/Character/move_front" + player.sameDirMov + ".png";
            player.img = imgDown[player.sameDirMov];
            break;
        case "left":
           // player.src = "./sprites/Character/move_left" + player.sameDirMov + ".png";
            player.img = imgLeft[player.sameDirMov];
            break;
        case "right":
           // player.src = "./sprites/Character/move_right" + player.sameDirMov + ".png";
            player.img = imgRight[player.sameDirMov];
            break;

    }
        ctx.drawImage(player.img, player.x, player.y);
}

function setMove (event, state){
    switch (event.key){
        case "ArrowUp":
            player.up = state;
            break;
        case "ArrowDown":
            player.down = state;
            break;
        case "ArrowLeft":
                player.left = state;
            break;
        case "ArrowRight":
                player.right = state;
            break;
        case "Escape":
            play = false;
            break;
        case "Enter":
            play = true;
            startGame();
            break;
        default:
            console.log(event);
    }
}
function onKeyDown(event){
        setMove(event, play);
}
function onKeyUp(event){
        setMove(event, false);
}

function posliWsZpravu() {
    if(player.up || player.down || player.left || player.right) {
        connection.send(JSON.stringify(player));
    }
}