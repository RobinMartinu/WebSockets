const uniqid = require("uniqid");

let players= [];
let playersIndex = [];

let initX = 50;
let initY = 50;

exports.apiHraci = function (req, res, obj){
    if (req.pathname.endsWith("/add")){
        obj.uid = uniqid();
        let player = {};

        player.name = req.parameters.name;
        console.log(player.name + ": " + obj.uid);
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