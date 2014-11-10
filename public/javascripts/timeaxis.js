TimeAxis = function() {
}

TimeAxis.prototype.draw = function() {
    push();
    stroke(255);
    strokeWeight(2);

    //measure
    var y = 50;
    for( var i=0; i < 10; i++){
	if(i%6 == 0){
	    line(0,y,20,y);
	} else if(i % 6 == 3){
	    line(0,y,15,y);
	} else {
	    line(0,y,10,y);
	}
	y += 50;
    }

    y = 50;
    noStroke();
    translate(0, 1);
    textSize(16);
    for( var i=0; i < 10; i++){
	if(i%6 == 0){
	    text("10:00", 25, y);
	} else if(i % 6 == 3){
	    text("10:30", 25, y);
	}
	y += 50;
    }
    
    pop();
}
