window.onload = () => {

    canvas = document.getElementById("canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx = canvas.getContext("2d");
    framesPerSecond = 60;
    storage = {};

    server = prompt("Server Address:", "http://localhost:8080/");
    
    joinServer(server);
};
