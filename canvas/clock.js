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
    this.ctx = $("#main")[0].getContext("2d");
    
    this.draw();
}


Bar.prototype.draw = function() {
    var rightEdge = window.innerWidth;
    var bottomEdge = window.innerHeight;
    this.centerX = rightEdge/2;
    this.centerY = bottomEdge /2;
    
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, rightEdge, bottomEdge);

    this.ctx.strokeStyle = "white";
    this.ctx.fillStyle = "white";
    this.ctx.lineWidth = 2;
    
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, 200, 0, Math.PI*2);
    this.ctx.stroke();
    this.ctx.closePath();
    
    this.drawTicks();
    this.drawHands();
}

Bar.prototype.drawHands = function() {
    this.ctx.lineWidth = 4;
    var HOUR_HAND_PEAK = this.centerY - 150;
    
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, 3, 0, Math.PI*2);
    this.ctx.fill();
    this.ctx.closePath();
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, this.centerY);
    this.ctx.lineTo(this.centerX, HOUR_HAND_PEAK);
    this.ctx.stroke();
    this.ctx.closePath();
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.centerX, HOUR_HAND_PEAK-15);
    this.ctx.lineTo(this.centerX-10, HOUR_HAND_PEAK);
    this.ctx.lineTo(this.centerX+10, HOUR_HAND_PEAK);
    this.ctx.fill();
    this.ctx.closePath();
}

Bar.prototype.drawTicks = function() {
    var tickHeight, tickY, tickX;
    for (var i = 1; i <= 15; i++) {
        this.ctx.beginPath();
        
        if (i % 5) {
            tickHeight = 20;
        }
        else {
            tickHeight = 30;
        }
        
        tickY = tickHeight*Math.cos(i*6);
        tickX = tickHeight*Math.sin(i*6);
        this.ctx.lineTo(i*5, tickHeight);
        this.ctx.stroke();
        this.ctx.closePath();
    }
}
    
window.addEventListener("DOMContentLoaded", function() { 
    $("#main").attr("width", window.innerWidth).attr("height", window.innerHeight);
    new Bar();
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
