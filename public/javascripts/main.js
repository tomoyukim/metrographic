var railway = [];
var trains = [];
var selected_railway = "odpt.Railway:TokyoMetro.Ginza";
var selected_direction = ["odpt.RailDirection:TokyoMetro.Shibuya"];
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
	var terminalStation = getStationData(msg[i]['odpt:terminalStation'],stations);
	if(terminalStation === undefined){
	    var ts = msg[i]['odpt:terminalStation'];
	    terminalStation = OTHER_STATION_DATA[ts];
	} else {
	    terminalStation = terminalStation.japanese;
	}
	var odpt_railwayDirection = msg[i]['odpt:railDirection'];
	//TODO:check selected direction
	for( var k=0; k < selected_direction.length; k++){
	    if(odpt_railwayDirection == selected_direction[k]){
		trains.push(new Train(fromStation,
				      toStation,
				      msg[i]['odpt:trainNumber'],
				      RAILWAY_DIRECTION_DATA[odpt_railwayDirection],
				      terminalStation,
				      msg[i]['odpt:delay'],
				      msg[i]['dc:date']));
	    }
	}
    }
}

function getStationData(odpt_station, stationData) {
    for( var i=0; i < stationData.length; i++){
	if(stationData[i].odpt_station == odpt_station){
	    return stationData[i];
	}
    }
}

function getRailwayDirection(odpt_railwayDirection) {
    return 
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
    var labelX_offset = 230;
    var labelY = windowHeight - 60;//710;//50;
    for( var j=0; j < trains.length; j++){
	if(j/6 == 1){ //line2
	    labelX_offset = 460;
	    labelY = windowHeight - 60;
	} else if (j/6 == 2) {//line3(max)
	    labelX_offset = 690;
	    labelY = windowHeight - 60;
	}
	trains[j].draw();
	trains[j].showInfo(windowWidth - labelX_offset, labelY);
	labelY -= 65;
    }
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
	selected_direction = $(this).attr('data-dr').split(',');
	console.log(selected_direction);
	updateTrains(data);
	
        return false;
    });
    $("#fullscreen").on('click',function(event){
	gFullScreen = !gFullScreen;
	if(gFullScreen){
	    $(this).text("拡大図");
	}else{
	    $(this).text("俯瞰図");
	}
    });
    
    //menu animation
    var on = function(){
	$(this).stop().animate({'color':'#999999'},200);
    };
    var off = function(){
	$(this).stop().animate({'color':'#ffffff'},1000);
    };
    $("#railway li a").hover(on,off);
});

