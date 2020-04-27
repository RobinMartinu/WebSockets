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
let songNum = 0;
let audio = document.createElement('audio');
let winArr = [];

function preloadImgs(arr, direction){
    for (let i = 0; i < 4; i++){
        let frame = new Image;
        frame.src = HOST + "/sprites/Character/move_" + direction + i + ".png";
        arr.push(frame);
    }
    console.log(arr);
}

function addPlayer(){
    let name = document.getElementById("name_reg").value;
    let url = `${HOST}/hraci/add?name=${name}&host=${HOST}`;
    fetch(url).then(function (response) {
        response.text().then(function (text) {
            let obj = JSON.parse(text);
            player.uid = obj.uid;
            console.log("uid: "+player.uid);
            // setInterval(posliWsZpravu, 10);
        }).catch((error) => {
            console.log(error);
        });
    });
}

function onLoad() {

    preloadImgs(imgUp, "back");
    preloadImgs(imgDown, "front");
    preloadImgs(imgLeft, "left");
    preloadImgs(imgRight, "right");
    let win = new Image;
    win.src = "./res/dorime.png";
    winArr.push(win);


    player.host = HOST;
    player.uid = "";

    /*
    player.x = 0;
    player.y = 0;
    let img = new Image();
    img.src = HOST + "/sprites/Character/move_front1.png";
    player.src = "./sprites/Character/move_front1.png";
    player.img = img;
    player.movDir = "down";
    player.sameDirMov = 0;
    player.up = false;
    player.down = false;
    player.left = false;
    player.right = false;


    let url = `${HOST}/hraci/add?name=Robin&host=${HOST}`;
    fetch(url).then(function (response) {
        response.text().then(function (text) {
            let obj = JSON.parse(text);
            player.uid = obj.uid;
            console.log("uid: "+player.uid);
            //setInterval(posliWsZpravu, 10);
        }).catch((error) => {
           console.log(error);
        });
    });

     */

canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");



    connection = new WebSocket(WS_HOST);
    connection.onmessage = e => {
        let players = JSON.parse(e.data);
        console.log(players);

        document.getElementById("dialog_window").innerHTML = "Dialogové&#10 okno:&#10 &#10 ";
        let introMsg = "Vítejte ve hře Texas McChicken! &#10 Vpravo si " +
            "vyberte jméno a klikněte potvrdit. &#10 Ovládání šipkami, mezerníkem se útočí. &#10 " +
            " &#10 Cílem hry je zbavit se zlého černého bloku.";
        document.getElementById("dialog_window").innerHTML += introMsg;

        ctx.clearRect(0,0, canvas.width, canvas.height);
        for (let o of players){
            if (o.uid !== "block") {
                drawPlayer(o);
                if (o.uid === player.uid) {
                    player = o;
                }
            } else {
                if (o.height > 5) {
                    ctx.fillStyle = o.fillStyle;
                    ctx.fillRect(o.x, o.y, o.width, o.height);
                } else {
                    o.height = 0;
                    let url = `${HOST}/hraci/add?name=D O R I M E&host=${HOST}`;
                    fetch(url).then(function (response) {
                        response.text().then(function (text) {
                        }).catch((error) => {
                            console.log(error);
                        });
                    });

                }
            }
        }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

   playBgMusic(songNum);

}

function playBgMusic(songNum){
    // let audio = document.createElement('audio');
    audio.setAttribute("id", "bgMusic");
    audio.style.display = "none";
    audio.controls = true;
    audio.id = "bgMusic";
    audio.src = HOST + "/res/" + songNum + "_audio.mp3";
    audio.autoplay = true;
    audio.onended = function(){
        // alert("Now played:" + songNum);
        audio.remove();
        if(songNum < 3) {
            songNum++;
            playBgMusic(songNum);
        } else {
            alert("This ain't no place for no Hero.");
            songNum = 0;
            playBgMusic(songNum);
        }
    };
   // document.body.appendChild(audio);
    document.getElementById("audio").play();

    alert("done");
}
function skipSong (){
    audio.pause();
    songNum++;
    songNum %= 4;
    playBgMusic(songNum);
}
function drawPlayer(player){

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
        if (player.name === "D O R I M E"){
            player.img = winArr[0];
        }
        ctx.drawImage(player.img, player.x, player.y);
        ctx.strokeStyle = "yellow";
        ctx.strokeText(player.name, player.x, player.y-8);

       // ctx.fillStyle = "#FF0000";
       // ctx.fillRect(player.x, player.y, player.width, player.height);

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
            break;
        case " ":
            player.damage = state;
            console.log("Space");
            break;
        default:
            console.log(event);
    }
   posliWsZpravu();
}
function onKeyDown(event){
    console.log(event);
        setMove(event, play);
}
function onKeyUp(event){
        setMove(event, false);
}

function posliWsZpravu() {
    if(player.up || player.down || player.left || player.right || player.damage) {
        connection.send(JSON.stringify(player));
    }
}