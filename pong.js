// Movement per 10ms of a bar, in pixels
const BAR_MOVE_INC = 5;
const BALL_MOVE_INC = 5;
var GLOBAL_SPEED_MULT = 1;
var MAX_BALL_DISTANCE = (BALL_MOVE_INC * GLOBAL_SPEED_MULT);
var AUTO_TRACK_BALL = false;
var PLAYING = true;
var GLOBAL_TIMERS = [];


function centerElemHoriz(elem) {
    elem.css("left", (window.innerWidth/2)-(elem.width()/2));
}

function centerElemVert(elem) {
    elem.css("top", (window.innerHeight/2)-(elem.height()/2));
}

function centerElemInWindow(elem) {
    centerElemHoriz(elem);
    centerElemVert(elem);
}

function withinRange(value, target, range) {
    return (value > (target - range) & value < (target + range));
}


function Bar() {
    this.movingDown = false;
    this.movingUp = false;
    this.speedFactor = 1;
    this.lastVal;
    
    this.element = $("#pong1");
    centerElemVert(this.element);
    
    $(document).keydown(function(e) {
        if (!PLAYING) return;
        if (e.which == 40 & !this.movingDown) {
            this.movingDown = true;
            this.movingUp = false;
            this.animate(-1);
        }
        else if (e.which == 38 & !this.movingUp) {
            this.movingUp = true;
            this.movingDown = false;
            this.animate(1);
        }
            
    }.bind(this));
    
    $(document).keyup(function(e) {
        if (e.which == 40 & this.movingDown) {
            this.movingDown = false;
        }
        else if (e.which == 38 & this.movingUp) {
            this.movingUp = false;
        }
    }.bind(this));
    return this;
}
    
Bar.prototype.animate = function(val) {
    var timesCalled = 0;
    this.speedFactor = 1;
    this.lastVal = val;
    
    actuallyAnimate = function() {
        timesCalled += 1;
        if (timesCalled % 10 === 0 && this.speedFactor <= 2) {
            this.speedFactor += .5;
        }
        
        if (this.movingDown & val < 0) {
            if (this.element.offset().top + BAR_MOVE_INC >= window.innerHeight - 120) {
                this.element.css("top", window.innerHeight - 120 + "px");
            }
            else {
                this.element.css("top", (this.element.offset().top + (BAR_MOVE_INC*this.speedFactor)));
            }
        }
        else if (this.movingUp & val > 0) {
            if (this.element.offset().top - BAR_MOVE_INC <= 0) {
                this.element.css("top", "0px");
            }
            else {
                this.element.css("top", (this.element.offset().top - BAR_MOVE_INC*this.speedFactor));
            }
        }
        
        if ((this.movingDown || this.movingUp) & this.lastVal === val) GLOBAL_TIMERS.push(setTimeout(actuallyAnimate, 10));
    }.bind(this)
    actuallyAnimate();
}

    

function Ball(bar1) {
    this.bar1 = bar1;
    this.vertDirectionMultiplier = 1;
    this.horizDirectionMultiplier = 1;
    this.xComponent = .5;
    this.yComponent = .5;
    this.justChangedDirection = false;
    this.timer = null;
    
    $("#playagain").click(this.reset.bind(this));
    $("#losses").text("0").data("losses", 0);
    $("#difficulty").text("0").click(function(e) {
        if (GLOBAL_SPEED_MULT <= 10.5) {
            GLOBAL_SPEED_MULT += .5;
        }
        else {
            GLOBAL_SPEED_MULT = .5;
        }
        MAX_BALL_DISTANCE = (BALL_MOVE_INC * GLOBAL_SPEED_MULT);
        $(e.target).text((GLOBAL_SPEED_MULT-1) * 2);
        
    }.bind(this));
    

    this.element = $("<div id='ball'></div>");
    this.element.appendTo($(document.body));
    this.reset();
    this.element.css("top", MAX_BALL_DISTANCE + 1);
    return this;
}
Ball.prototype.reset = function() {
    centerElemInWindow(this.element);
    $("#youlose").css("display", "none");
    PLAYING = true;
    this.startMotion();
    this.startTime();
}

Ball.prototype.startTime = function() {
    this.timer = setInterval(this.updateTime, 100);
}

Ball.prototype.updateTime = function() {
    var timer = $("#time");
    var currentTime = parseFloat(timer.data("time"));
    var newTime = (currentTime + .1).toFixed(1);
    timer.text(newTime).data("time", newTime);
}

Ball.prototype.stopTime = function() {
    clearTimeout(this.timer);
}

Ball.prototype.startMotion = function() {
    this.animateBall();
}

Ball.prototype.animateBall = function() {
    var offsets = this.element.offset();
    var leftOffset = offsets.left;
    var topOffset = offsets.top;
    
    if (leftOffset >= 0) {
        this.advanceBall(leftOffset, topOffset);
    }
    if (AUTO_TRACK_BALL) {
        var barPos = topOffset-this.bar1.element.width();
        if (barPos < 0) barPos = 0;
        if (barPos + this.bar1.element.height() > window.innerHeight) barPos = (window.innerHeight - this.bar1.element.height());
        this.bar1.element.css("top", barPos);
    }
    
    if (this.needsHorizDirectonChange(leftOffset)) { 
        this.invertHorizDirection();
    }
    else if (this.needsVertDirectionChange(topOffset)) {
        this.invertVertDirection();
    }
    
    if (this.justChangedDirection) {
        this.justChangedDirection = false;
        this.advanceBall(leftOffset, topOffset);
    }

    
    if (leftOffset < $("#pong1").width()-10) {
        centerElemInWindow($("#youlose"));
        $("#losses").data("losses",  $("#losses").data("losses")+1);
        $("#losses").text($("#losses").data("losses"));
        $("#youlose").css("display", "block");
        PLAYING = false;
        this.stopTime();
        return;
    }
    GLOBAL_TIMERS.push(setTimeout(this.animateBall.bind(this), 10));
}

Ball.prototype.needsHorizDirectonChange = function(leftOffset) {
    return (this.determineCoincidenceWithBar(this.bar1) || withinRange(leftOffset+this.element.width(), window.innerWidth, MAX_BALL_DISTANCE));
}

Ball.prototype.needsVertDirectionChange = function(topOffset) {
    return (withinRange(topOffset, 0, MAX_BALL_DISTANCE) || withinRange(topOffset+this.element.width(), window.innerHeight, MAX_BALL_DISTANCE));
}

Ball.prototype.advanceBall = function(leftOffset, topOffset) {
    this.element.css("left", leftOffset-(GLOBAL_SPEED_MULT*BALL_MOVE_INC*this.horizDirectionMultiplier));
    this.element.css("top", topOffset+(GLOBAL_SPEED_MULT*BALL_MOVE_INC*this.vertDirectionMultiplier));
}


Ball.prototype.determineCoincidenceWithBar = function(bar) {
    var offsets = this.element.offset();
    var topOffset = offsets.top;
    var leftOffset = offsets.left;
    var minTop,maxTop;
    
    if (withinRange(leftOffset, bar.element.width(), MAX_BALL_DISTANCE)) {
        minTop = bar.element.offset().top;
        maxTop = minTop + bar.element.height();
        
        if (topOffset >= minTop & topOffset <= maxTop) {
            return true;
        }
    }
}

Ball.prototype.invertHorizDirection = function() {
    this.horizDirectionMultiplier = this.horizDirectionMultiplier * -1;
    this.justChangedDirection = true;
}

Ball.prototype.invertVertDirection = function() {
    this.vertDirectionMultiplier = this.vertDirectionMultiplier * -1;
    this.justChangedDirection = true;
}

window.addEventListener("DOMContentLoaded", function() {
    var bar1 = new Bar();
    window.ball = new Ball(bar1);
    
    ball.startMotion();
    
    $(document).keydown(function(e) {
        // Emergency stop
        if (e.which == 32) {
            GLOBAL_TIMERS.reverse();
            for (var i in GLOBAL_TIMERS) {
                clearTimeout(GLOBAL_TIMERS[i]);
            }
        }
    });
        
});
