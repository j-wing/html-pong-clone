// Movement per 10ms of a bar, in pixels
const BAR_MOVE_INC = 2;
const BALL_MOVE_INC = 3;
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
    this.lastVal = val;
    
    actuallyAnimate = function() {
        timesCalled += 1;
        if (timesCalled % 10 === 0 && this.speedFactor <= 3) {
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
    this.directionMultiplier = 1;
    this.xComponent = 1;
    this.yComponent = 0;

    this.element = $("<div id='ball'></div>");
    this.element.appendTo($(document.body));
    this.reset();
    return this;
}
Ball.prototype.reset = function() {
    centerElemInWindow(this.element);
}

Ball.prototype.startMotion = function() {
    var animate = function() {
        var leftOffset = this.element.offset().left;
        if (withinRange(leftOffset+this.element.width(), window.innerWidth, BALL_MOVE_INC)) {
            this.changeDirection();
        }
        if (leftOffset >= 0) {
            this.element.css("left", leftOffset-(BALL_MOVE_INC*this.directionMultiplier));
        }
        
        var shouldBounce = this.determineCoincidence(this.bar1);
        
        if (shouldBounce) {
            this.changeDirection();
        }
        
        if (leftOffset < $("#pong1").width()-10) {
            centerElemInWindow($("#youlose"));
            $("#youlose").css("display", "block");
        }
        GLOBAL_TIMERS.push(setTimeout(animate, 10));
    }.bind(this);
    
    setTimeout(animate, 10);
}

Ball.prototype.determineCoincidence = function(bar) {
    var offsets = this.element.offset();
    var topOffset = offsets.top;
    var leftOffset = offsets.left;
    var minTop,maxTop;
    
    if (withinRange(leftOffset, bar.element.width(), BALL_MOVE_INC)) {
        minTop = bar.element.offset().top;
        maxTop = minTop + bar.element.height();
        
        if (topOffset >= minTop & topOffset <= maxTop) {
            return true;
        }
    }
}

Ball.prototype.changeDirection = function() {
    this.directionMultiplier = this.directionMultiplier * -1;
}

window.addEventListener("DOMContentLoaded", function() {
    var bar1 = new Bar();
    var ball = new Ball(bar1);
    
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
