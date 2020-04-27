const uniqid = require("uniqid");

let players= [];
let playersIndex = [];

let initX = 50;
let initY = 50;

let player = {};
player.uid = "block";
player.name = "block";
player.x = 320;
player.y = 5;
player.width = 400;
player.height = 470;
player.fillStyle = "#000000"; //#ADD8E6 = lightblue = background
playersIndex[player.uid] = players.push(player) - 1;


exports.apiHraci = function (req, res, obj){
    if (req.pathname.endsWith("/add")){
        obj.uid = uniqid();
        let player = {};
        player.name = req.parameters.name;
        console.log(player.name + ": " + obj.uid);
        if(player.name !== "D O R I M E") {
            player.uid = obj.uid;
            player.x = initX;
            player.y = initY;
            player.src = req.parameters.host + "/sprites/Character/move_front1.png";
            player.height = 140;
            player.width = 80;
            player.movDir = "down";
            player.sameDirMov = 0;
            player.up = false;
            player.down = false;
            player.left = false;
            player.right = false;
            player.damage = false;
        } else {
            players = [];
            playersIndex = [];
            player.x = 320;
            player.y = 5;
            player.src = req.parameters.host + "/res/dorime.png";
        }

        playersIndex[obj.uid] = players.push(player) - 1;

    }
}

exports.findPlayer = function (uid){
    console.log(players[playersIndex[uid]]);
    return players[playersIndex[uid]];
}

exports.listPlayers = function () {
    console.log(players);
    return players;
}