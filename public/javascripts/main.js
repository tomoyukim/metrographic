var t, t2;
var railway = [];
var trains = [];

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

    trains = [];
    for( var i=0; i < msg.length; i++){
	var stations;
	var fromStation, toStation;
	for( var j=0; j < RAILWAY_DATA.length; j++){
	    if(RAILWAY_DATA[j].odpt_railway == msg[i]['odpt:railway']){
		stations = RAILWAY_DATA[j].stations;
	    }
	}
	for( var k=0; k < stations.length; k++){
	    if(stations[k].odpt_station == msg[i]['odpt:fromStation']){
		console.log('from:' + stations[k].odpt_station);
		fromStation = stations[k];
	    }
	    if(stations[k].odpt_station == msg[i]['odpt:toStation']){
		console.log('to:' + stations[k].odpt_station);
		toStation = stations[k];
	    }
	}
	console.log(toStation);
	trains.push(new Train(fromStation, toStation, msg[i]['odpt:trainNumber'], msg[i]['odpt:trainType'], msg[i]['odpt:delay'], "up"));
    }
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
    for( var j=0; j < trains.length; j++){
	trains[j].draw();
    }

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

