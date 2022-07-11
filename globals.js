// Variables

var canvas;
var ctx;
var storage;
var framesPerSecond;
var player;
var gameInterval;
var map;
var server = false;
var paused = false;
var socket;
var colliderBoxes
var serverProperties = {};
var entityList;
var title;

// Constants 

const scale = 1;

// Classes

class GameMap {
    constructor(pathToMap) {
        this.path = pathToMap;
        this.w = 960;
        this.h = 640;
    }
    draw() {
        draw(this.path, ctx, canvas.clientWidth / 2 - player.x, canvas.clientHeight / 2 - player.y, this.w * scale, this.h * scale);
    }
};
class Sprite {
    constructor(title, tiles, x = 0, y = 0, w = -1, h = -1,  controllable, speed) {
        this.title = title;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dir = tiles;
        this.c = controllable;
        this.speed = speed;
        this.i = 0
        this.arr = ["1", "3"];
        this.tile = {title: "down", num: "0"};
        this.health = 100;
    };
    enableController() {
        if (this.c) {
            window.addEventListener("keydown", (e) => {
                e.preventDefault();
                let x;
                let y;
                switch (e.key) {
                    case "w":
                        x = this.x;
                        y = this.y - this.speed;
                        goto(player, x, y);
                        this.tile.title = "up";
                        this.tile.num = this.arr[this.i % 2]
                        this.i += 1;
                        socket.emit("w");
                        break;
                    case "a":
                        x = this.x - this.speed;
                        y = this.y;
                        goto(player, x, y);
                        this.tile.title = "left";
                        this.tile.num = this.arr[this.i % 2]
                        this.i += 1;
                        socket.emit("a");
                        break;
                    case "s":
                        x = this.x;
                        y = this.y + this.speed;
                        goto(player, x, y);
                        this.tile.title = "down";
                        this.tile.num = this.arr[this.i % 2]
                        this.i += 1;
                        socket.emit("s");
                        break;
                    case "d":
                        x = this.x + this.speed;
                        y = this.y;
                        goto(player, x, y);
                        this.tile.title = "right";
                        this.tile.num = this.arr[this.i % 2]
                        this.i += 1;
                        socket.emit("d");
                        break;
                    default:
                        // do nothing...
                        break;
                };
            });
            window.addEventListener("keyup", (e) => {
                e.preventDefault();
                let x;
                let y;
                switch (e.key) {
                    case "w":
                        if (this.tile.title == "up") {
                            this.tile.num = "0"
                        };
                        break;
                    case "a":
                        if (this.tile.title == "left") {
                            this.tile.num = "0"
                        };
                        break;
                    case "s":
                        if (this.tile.title == "down") {
                            this.tile.num = "0"
                        };
                        break;
                    case "d":
                        if (this.tile.title == "right") {
                            this.tile.num = "0"
                        };
                        break;
                    default:
                        // do nothing...
                        break;
                };
            });
        }
    };
    draw() {
        draw(`${this.dir}/${this.tile.title}-${this.tile.num}.png`, ctx, canvas.clientWidth / 2, canvas.clientHeight / 2, this.w * scale, this.h * scale);
        ctx.font = "monospace 10px"
        ctx.fillText(this.title, canvas.clientWidth / 2, canvas.clientHeight / 2);
    };
};



// Functions

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.w &&
    rect1.x + rect1.w > rect2.x &&
    rect1.y < rect2.y + rect2.h &&
    rect1.h + rect1.y > rect2.y;
};

function goto(player, x, y) {
    let w = player.w;
    let h = player.h
    for (var i = 0; i < colliderBoxes.length; i++) {
        if (checkCollision({x, y, w, h}, colliderBoxes[i])) {
            return false;
        } else {
            continue;
        }
    };
    player.x = x;
    player.y = y;
};

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

function draw(path, ctx, x, y, w = -1, h = -1) {
    let img;
    if (storage[path]) {
        img = storage[path];
        if (w == -1 && h == -1) {
            ctx.drawImage(img, x, y);
        } else if (w == -1 && h != -1) {
            img.height = h;
            ctx.drawImage(img, x, y, img.width, h);
        } else if (w != -1 && h == -1) {
            img.width = w;
            ctx.drawImage(img, x, y, w, img.height);
        } else {
            img.width = w;
            img.height = h;
            ctx.drawImage(img, x, y, img.width, img.height)
        }
    } else {
        img = new Image();
        img.src = path;
        img.onload = () => {
            if (w == -1 && h == -1) {
                ctx.drawImage(img, x, y);
            } else if (w == -1 && h != -1) {
                img.height = h;
                ctx.drawImage(img, x, y, img.width, h);
            } else if (w != -1 && h == -1) {
                img.width = w;
                ctx.drawImage(img, x, y, w, img.height);
            } else {
                img.width = w;
                img.height = h;
                ctx.drawImage(img, x, y, img.width, img.height)
            };
            storage[path] = img;
        };
        storage[path] = img;
    };
};

function getColliderBoxes(colliderMap) {
    let colliderBoxes = [];
    for (var i = 0; i < colliderMap.length; i++) {
        if (colliderMap[i] != 0) {
            let x = (i % 30) * 32;
            let y = (Math.floor(i / 30)) * 32;
            let w = serverProperties.tileWidth * scale;
            let h = serverProperties.tileHeight * scale;
            colliderBoxes.push({
                x: x,
                y: y,
                w: w,
                h: h
            });
        } else {
            continue;
        }
    };
    return colliderBoxes;
};

function downloadImage(url) {
    let img = new Image();
    img.src = url;
    img.onload = () => {
        storage[url] = img;
    };
};
function joinServer(server) {
    if (server) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", server, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status == 0 || (status >= 200 && status <= 400)) {
                    try {
                        serverProperties = JSON.parse(xhr.responseText).gameProperties;
                        console.log(serverProperties)
                        init();
                        gameInterval = setInterval(() => {
                            if (!paused) {
                                update()
                            };
                        }, 1000 / framesPerSecond);
                    } catch (err) {
                        server = prompt("Could not request data to server.\n Please check that if server at given address is up or join another server.", "http://localhost:8080/");
                        joinServer(server);
                    }
                } else {
                    server = prompt("Could not request data to server.\n Please check that if server at given address is up or join another server.", "http://localhost:8080/");
                    joinServer(server);
                };
            };
        };
        xhr.send();
    }
}

function init() {
    title = prompt("Enter username:");
    storage = {};
    if (gameInterval) {
        clearInterval(gameInterval);
    };
    map = new GameMap(serverProperties.mapPath);
    colliderBoxes = getColliderBoxes(serverProperties.colliderMap);
    socket = io(server);
    player = new Sprite(title, serverProperties.tiles, serverProperties.spawnPoint.x, serverProperties.spawnPoint.y, serverProperties.playerWidth, serverProperties.playerHeight, true, 10);
    socket.emit("join", player.title);
    socket.on("titleinuse", () => {
        player.title = prompt("Username in use! Please enter another one:");
        socket.emit("join", player.title);
    })
    player.enableController();
    socket.on("update", e => {
        entityList = e;
    });
};
function update() {
    clear();
    map.draw();
    player.draw();
    var entityTitles = Object.keys(entityList);
    for (var i = 0; i < entityTitles.length; i++) {
        let o = entityList[entityTitles[i]];
        if (o.title != player.title) {
            let x = canvas.clientWidth / 2 - player.x + o.x;
            let y = canvas.clientHeight / 2 - player.y + o.y;
            draw(o.path, ctx, x, y, serverProperties.playerWidth, serverProperties.playerHeight);
            ctx.fillText(o.title, x, y);
        };
    };
    socket.emit("update", {
        title: player.title,
        path: `${player.dir}/${player.tile.title}-${player.tile.num}.png`,
        x: player.x,
        y: player.y
    });
};
function pause() {
    // pause
};
