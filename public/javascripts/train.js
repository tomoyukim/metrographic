Train = function(_from, _to, _trainNumber, _trainDirection, _terminalStation, _delay, _date) {
    var _x, _y;

    if(_to === undefined){
	_x = Number(_from.posX);
	_y = Number(_from.posY);
    }else{
	_x = (Number(_from.posX) + Number(_to.posX)) / 2;
	_y = (Number(_from.posY) + Number(_to.posY)) / 2;

	//calcurate direction angle
	dx = Number(_to.posX) - Number(_from.posX);
	dy = Number(_to.posY) - Number(_from.posY);
	this.theta = atan(dy/abs(dx));
	if(dx < 0 && this.theta < 0){
	    this.theta = -(PI - abs(this.theta));
	} else if (dx < 0 && this.theta >= 0) {
	    this.theta = (PI - this.theta);
	} else {
	    // nothing
	}
	//this.direction = dx < 0 ? 0 : 2*(HALF_PI - this.theta);
    }
    this.x = _x;
    this.y = _y;
    this.trainNumber = _trainNumber;
    this.trainDirection = _trainDirection;
    this.terminalStation = _terminalStation;
    this.delay = _delay;
    var date = new Date(_date);
    this.date = "(" + date.getFullYear() + "/" + (Number(date.getMonth()) + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + " 現在)";
    this.labelX = -20;
    this.labelY = 16;
    this.life = this.LIFE;
    this.size = this.SIZE;
}

Train.prototype.LIFE = 100;
Train.prototype.SIZE = 10;
Train.prototype.TARGET = 180;
Train.prototype.EASING = 0.05;

Train.prototype.blink = function() {
    var ds = this.TARGET - this.size;//this.size - TARGET;
    if(abs(ds) > 1){
	this.size += ds * this.EASING;
	this.life -= 2;
    }
    var threshold = this.TARGET - this.TARGET * 0.1;
    if(this.size > threshold){
	this.life = this.LIFE;
	this.size = this.SIZE;
    }
}

Train.prototype.arrow = function() {
    push();

    if(this.theta !== undefined){
	rotate(this.theta);
	translate(10, 0);
	triangle(0,5,8.6,0,0,-5);
    }

    pop();
}

Train.prototype.showLabel = function() {
    push();

    textSize(12);
    translate(this.labelX, this.labelY);

    //TODO:remove.only for debug
    //fill(0, 127);
    //rect(-5,-15,200,55);

    fill(255);
    //text(this.trainNumber, 0, 0);

    text(this.trainDirection, 0, 0);
    text(this.terminalStation + "行き", 0, 17);
    if(this.delay > 0){
	fill(color(232,64,48));
	text(this.delay + "分遅れ "　+ this.date, 0, 34);
    } else {
	text("定刻 " + this.date, 0, 34);
    }

    pop();
}

Train.prototype.draw = function() {
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

    translate(this.x, this.y);
    noStroke();

    var col = color(0, 163, 217);
    if(this.delay > 0){
	col = color(255, 100, 100);
    }
    fill(col, 230);
    ellipse(0, 0, this.SIZE, this.SIZE);

    //arrow
    this.arrow();

    fill(col, this.life);
    ellipse(0, 0, this.size, this.size);

    //blink
    this.blink();
    fill(col, this.life);
    ellipse(0, 0, this.size, this.size);

    if(!gFullScreen){
	/*
	stroke(color(0, 163, 217));
	line(0, 0, this.labelX, this.labelY);

	noStroke();
	*/
	this.showLabel();
    }

    pop();

}
