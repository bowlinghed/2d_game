// Variables

var canvas;
var ctx;
var storage;
var framesPerSecond;
var player;
var gameInterval;
var map;
var colliders;
var tileWidth; // default: 32
var tileHeight; // default: 32
var colliderBoxes; // default: []


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
    constructor(tilesDir, x = 0, y = 0, w = -1, h = -1, colliderBox,  controllable, speed) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dir = tilesDir;
        this.c = controllable;
        this.speed = speed;
        this.colliderBox = colliderBox;
        this.i = 0
        this.arr = ["1", "3"];
        this.tile = {title: "down", num: "0"};
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
                        break;
                    case "a":
                        x = this.x - this.speed;
                        y = this.y;
                        goto(player, x, y);
                        this.tile.title = "left";
                        this.tile.num = this.arr[this.i % 2]
                        this.i += 1;
                        break;
                    case "s":
                        x = this.x;
                        y = this.y + this.speed;
                        goto(player, x, y);
                        this.tile.title = "down";
                        this.tile.num = this.arr[this.i % 2]
                        this.i += 1;
                        break;
                    case "d":
                        x = this.x + this.speed;
                        y = this.y;
                        goto(player, x, y);
                        this.tile.title = "right";
                        this.tile.num = this.arr[this.i % 2]
                        this.i += 1;
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
        /*colliderBoxes[i].x += canvas.clientWidth / 2 - player.x;
        colliderBoxes[i].y += canvas.clientHeight / 2 - player.y*/
        if (checkCollision({x, y, w, h}, colliderBoxes[i])) {
            return false;
        } else {
            continue;
        }
    };
    player.x = x;
    player.y = y;
    player.colliderBox.x = x;
    player.colliderBox.y = y;
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



function init() {
    player.enableController();
};
function update() {
    clear();
    map.draw();
    player.draw();
};
function pause() {
    // pause
};

var colliders = [3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703,
    3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703,
    3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703,
    3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703,
    3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703,
    3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703,
    3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703,
    3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703,
    3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703,
    3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703, 3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703,
    3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703, 3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703,
    3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703,
    3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703,
    3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703,
    3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703,
    3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703,
    3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703,
    3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703,
    3703, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3703,
    3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703, 3703]
var tileWidth = 32;
var tileHeight = 32;
var colliderBoxes = [];
for (var i = 0; i < colliders.length; i++) {
    if (colliders[i] != 0) {
        let x = (i % 30) * 32;
        let y = (Math.floor(i / 30)) * 32;
        let w = tileWidth * scale;
        let h = tileHeight * scale;
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