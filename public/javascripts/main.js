var t, t2;
var railway = [];

var MAP_SIZE_X = 2800;
var MAP_SIZE_Y = 2100;
var gFullScreen = true;
var gX = -500;
var gY = -500;
var _x = 0;
var _y = 0;
var prevX = -500;
var prevY = -500;

var socket = io.connect('http://192.168.33.10:3000');
socket.on('trains', function(msg) {
    console.log('trains');
    console.log(msg);
});

function preload() {
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    t = new Train(450, windowHeight/2, "A2098S4", "LOCAL", 10, "up");
    t2 = new Train(1150, 660, "A2098S4", "LOCAL", 0, "down");

    for( var i=0; i < RAILWAY_DATA.length; i++){
	railway.push(new Railway(RAILWAY_DATA[i]));
    }
}

function draw() {
    background(0);
    smooth();

    for( var i=0; i < railway.length; i++){
	railway[i].draw();
    }
    t.draw();
    t2.draw();


    //title
    var titleX = 25;
    var titleY = 50;
    noStroke();
    fill(230);
    textFont('Helvetica');
    textSize(32);
    text("TIME-GRAPHIC SUBWAY", titleX, titleY);
    textSize(12);
    text("powered by Tokyo Metro", titleX, titleY + 15);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyTyped() {
    if(key === 'd'){
	gFullScreen = !gFullScreen;
    }
}


function mouseDragged() {
    gX = mouseX - _x + prevX;
    gY = mouseY - _y + prevY;
}

function mousePressed() {
    _x = mouseX;
    _y = mouseY;
}

function mouseReleased() {
    prevX = gX;
    prevY = gY;
}

