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
    var rightEdge = window.innerWidth;
    var bottomEdge = window.innerHeight;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, rightEdge, bottomEdge);

    this.ctx.fillStyle = "white";
//     this.ctx.fillRect(rightEdge/2-2, 0, 2, 100000);
//     this.ctx.fillRect(0, bottomEdge/2-2, 100000, 2);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "white";
    this.ctx.lineTo(rightEdge, bottomEdge);
    this.ctx.stroke();
    
    var startX = 0;
    var startY = 0;
    var endX = rightEdge;
    var endY = bottomEdge;
    var firstRun = null;
    var angle = 0;
    
    setInterval(function() {
        angle = (angle + 1) % 360;
        this.ctx.clearRect(0, 0, rightEdge, bottomEdge);
        
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, rightEdge, bottomEdge);
        
        this.ctx.save();
        this.ctx.translate(rightEdge/2, bottomEdge/2);
        this.ctx.rotate(angle*Math.PI/4);
        this.ctx.translate(-rightEdge/2, -bottomEdge/2);
        
        this.ctx.beginPath();
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "white";
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.restore();
        /*
        console.log(startX, endX, startY, endY);
        if (startX >= rightEdge) {
            //90-180
            startX = rightEdge;
            endX = 0;
            
            startY += 5;
            endY -= 5;
        }
        else if (startY >= bottomEdge) {
            //90-180
            startY = bottomEdge;
            endY = 0;
            
            startX -= 5;
            endX += 5;
        }
        else if (startX < 0 ) {
            //270-360
            startX = 0;
            endX = rightEdge;
            
            startY -= 5;
            endY += 5;
        }
        else {
            //0-90
            startY = 0;
            endY = bottomEdge;
            
            startX += 5;
            endX -= 5;
        }
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = "white";
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();*/
        
        
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
