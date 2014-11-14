Train = function(_from, _to, _trainId, _trainType, _delay, _direction) {
    var _x, _y;

    if(_to === undefined){
	_x = Number(_from.posX);
	_y = Number(_from.posY);
    }else{
	_x = (Number(_from.posX) + Number(_to.posX)) / 2;
	_y = (Number(_from.posY) + Number(_to.posY)) / 2;
    }
    this.x = _x;
    this.y = _y;
    this.trainId = _trainId;
    this.trainType = _trainType;
    this.delay = _delay;
    this.direction = _direction;
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
    if(this.direction == "up"){
	translate(0, -10);
	triangle(5,0,0,-8.6,-5,0);
    } else { //down
	translate(0, 10);
	triangle(5,0,0,8.6,-5,0);
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
	fill(255);
	textSize(12);
	translate(10, 4);
	text("TrainNumber: " + this.trainId, 10, 0);
	text("TrainType: " + this.trainType, 10, 17);
	text("Delay: ", 10, 34);
	if(this.delay > 0){
	    fill(color(232,64,48));
	}
	text(this.delay, textWidth("Delay: ") + 10, 34);
    }

    pop();
}
