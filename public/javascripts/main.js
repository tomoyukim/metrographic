var railway = [];
var trains = [];
var selected_railway = "odpt.Railway:TokyoMetro.Chiyoda";
var data;

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
socket.on('trains', updateTrains);

function updateTrains(msg) {
    data = msg;

    trains = [];
    for( var i=0; i < msg.length; i++){

	if(selected_railway != msg[i]['odpt:railway']){
	    continue;
	}
	
	var stations = [];
	var fromStation, toStation;
	for( var j=0; j < RAILWAY_DATA.length; j++){
	    if(RAILWAY_DATA[j].odpt_railway == msg[i]['odpt:railway']){
		stations = stations.concat(RAILWAY_DATA[j].stations);
	    }
	}

	var fromStation = getStationData(msg[i]['odpt:fromStation'], stations);
	var toStation = getStationData(msg[i]['odpt:toStation'], stations);

	trains.push(new Train(fromStation, toStation, msg[i]['odpt:trainNumber'], msg[i]['odpt:trainType'], msg[i]['odpt:delay'], "up"));
    }
}

function getStationData(odpt_station, stationData) {
    for( var i=0; i < stationData.length; i++){
	if(stationData[i].odpt_station == odpt_station){
	    return stationData[i];
	}
    }
}

function preload() {
}

function setup() {
    createCanvas(windowWidth, windowHeight);

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
/*    var titleX = 25;
    var titleY = 50;
    noStroke();
    fill(230);
    textFont('Helvetica');
    textSize(32);
    text("TIME-GRAPHIC SUBWAY", titleX, titleY);
    textSize(12);
    text("powered by Tokyo Metro", titleX, titleY + 15);

    var a = 0;
    for( var i=0; i < 9; i++){
	ellipse(35 + a, 90, 20, 20);
	a += 30;
    }*/
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

$(function(){
    $(".select").on('click',function(event){
        event.preventDefault();
        event.stopPropagation();

	selected_railway = $(this).attr('href');
	updateTrains(data);
	
        return false;
    });
});
