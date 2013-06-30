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

Bar.prototype.draw1 = function() {
    var rightEdge = window.innerWidth;
    var bottomEdge = window.innerHeight;
    
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, rightEdge, bottomEdge);
    this.ctx.fillStyle = "rgba(255, 255, 255, .7)";
    for (var i=0;i <100;i++) {
        for (var ii=0;ii <=100;ii++) {
            this.ctx.fillStyle = "rgba(255, 255, 255, .7)";
            this.ctx.fillRect(ii*25,i*25, 20, 20);
        }
    }
    this.ctx.beginPath();
    this.ctx.fillStyle = "white";
    this.ctx.arc(rightEdge/2, bottomEdge/2, 100, 0, Math.PI*2);
    this.ctx.fill();
    for (var i=50;i>0;i-=2) {
        this.ctx.arc(rightEdge/2, bottomEdge/2, i, 0, Math.PI*2);
        this.ctx.stroke();
    }
}

Bar.prototype.draw = function() {
    var rightEdge 
        
        
    }.bind(this), 100);
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
