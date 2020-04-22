const createSpaServer = require("spaserver").createSpaServer;
const apiDenVTydnu = require('./api-denvtydnu').apiDenVTydnu;
const apiCas = require('./api-cas').apiCas;
const apiDb = require('./api-db').apiDb;
const apiDbGen = require('./db-setup/api-db-gen').apiDbGen;
const apiHraci = require("./api-hraci").apiHraci;
const findPlayer = require("./api-hraci").findPlayer;
const listPlayers = require("./api-hraci").listPlayers;

const PORT = 8080; //aplikace na Rosti.cz musi bezet na portu 8080
const API_HEAD = {
    "Content-type": "application/json"
};
const API_STATUS_OK = 0;
const API_STATUS_NOT_FOUND = -1;

const CANVAS_HEIGHT = 480;
const CANVAS_WIDTH = 720;
const MOVE_SPEED = 5;

function processApi(req, res) {
    console.log(req.pathname);
    res.writeHead(200, API_HEAD);
    let obj = {};
    obj.status = API_STATUS_OK;

    if (req.pathname === "/dbgen") { //v ostre aplikaci nebude toto treba
        apiDbGen(req, res, obj);
        return;
    }

    if (req.pathname === "/denvtydnu") {
        apiDenVTydnu(req, res, obj);
    } else if (req.pathname === "/cas") {
        apiCas(req, res, obj);
    } else if (req.pathname.startsWith("/db")) {
        apiDb(req, res, obj);
        return; //MySQL query je asynchronni
    } else if(req.pathname.startsWith("/hraci")){
        apiHraci(req,res,obj);
    }
    else {
        obj.status = API_STATUS_NOT_FOUND;
        obj.error = "API not found";
    }
    res.end(JSON.stringify(obj));
}

let srv = createSpaServer(PORT, processApi);

const WebSocket = require("ws");
const wss = new WebSocket.Server({server:srv});
wss.on('connection', ws => {
    ws.on('message', message => { //prijem zprav
        console.log(`Přijatá zpráva: ${message}`);
        let playerUpdate = JSON.parse(message);
        console.log(playerUpdate);
        let player = findPlayer(playerUpdate.uid);
        console.log(player);

        if (playerUpdate.right){
            if (player.x < CANVAS_WIDTH - player.width) {
                if (player.movDir === "right") {
                    player.sameDirMov = (player.sameDirMov + 1) % 4;
                } else {
                    player.sameDirMov = 0;
                }
                player.movDir = "right";
                player.src = "./sprites/Character/move_right" + player.sameDirMov + ".png";
                player.width = 130;
                player.x += MOVE_SPEED;

            }

            console.log(player.x, player.y);

        }
        if(playerUpdate.left){
            if (player.x > MOVE_SPEED) {
                if (player.movDir === "left") {
                    player.sameDirMov = (player.sameDirMov + 1) % 4;
                } else {
                    player.sameDirMov = 0;
                }
                player.movDir = "left";
                player.src = "./sprites/Character/mov_left" + player.sameDirMov + ".png";
                player.x -= MOVE_SPEED;
            }
            console.log(player.x, player.y);
        }
        if(playerUpdate.up){
            if ( player.y > MOVE_SPEED){
                if(player.movDir === "up"){
                    player.sameDirMov = (player.sameDirMov+1)%4;
                } else {
                    player.sameDirMov = 0;
                }
                player.movDir = "up";
                player.src = "./sprites/Character/move_back" + player.sameDirMov + ".png";
                player.width = 80;
                player.y -= MOVE_SPEED;
            }
            console.log(player.x, player.y);

        }
        if(playerUpdate.down){
            if ( player.y < CANVAS_HEIGHT - player.height) {
                if (player.movDir === "down") {
                    player.sameDirMov = (player.sameDirMov + 1) % 4;
                } else {
                    player.sameDirMov = 0;
                }
                player.movDir = "down";
                player.src = "./sprites/Character/mov_front" + player.sameDirMov + ".png";
                player.width = 80;
                console.log(player.x, player.y);
                player.y += MOVE_SPEED;
            }

        console.log(listPlayers());

    }});
});
let counter = 0;
function broadcast() {
    let json = JSON.stringify(listPlayers());
    //odeslani zpravy vsem pripojenym klientum
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(json);
        }
    });
}

setInterval(broadcast, 10);