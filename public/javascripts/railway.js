Railway = function(_railway) {
    this.color = color(_railway.color[0], _railway.color[1], _railway.color[2]);
    this.stations = _railway.stations;
    this.stations.sort(function(a, b) {
	var comp1 = a.index;
	var comp2 = b.index;
	return comp1 - comp2; //asc
	//return comp2 - comp1; //desc
    });
}

Railway.prototype.STATION_SIZE = 10;

Railway.prototype.draw = function() {
    push();

    //full screen
    if(gFullScreen){
	var scaleX = windowWidth / MAP_SIZE_X;
	var scaleY = windowHeight / MAP_SIZE_Y;

	if(scaleX - scaleY < 0){
	    translate(0, (windowHeight - (MAP_SIZE_Y * scaleX)) / 2);
	    scale(scaleX);
	}else{
	    translate((windowWidth - (MAP_SIZE_X * scaleY)) / 2, 0);
	    scale(scaleY);
	}
    } else {
	translate(gX, gY);
    }

    //title area
    translate(0, 100);

    
    //station point
    for( var i=0; i < this.stations.length; i++){
	noStroke();
	fill(this.color);
	//fill(127);
	var size = this.STATION_SIZE;
	ellipse(this.stations[i].posX, this.stations[i].posY, size, size);

	fill(230);
	textSize(12);
	text(this.stations[i].english, Number(this.stations[i].posX) + 10, Number(this.stations[i].posY) - 5);
    }

    //railway line
    noFill();
    stroke(this.color);
    strokeWeight(2);
    //stroke(255);
    beginShape(LINES);
    for( var i=0; i < this.stations.length; i++){
	vertex(this.stations[i].posX, this.stations[i].posY);
    }
    endShape();
    pop();
}
