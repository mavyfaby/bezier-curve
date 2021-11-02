/**
 * ------------------------------------
 * Author: Maverick G. Fabroa
 * ------------------------------------
 * Date: October 31, 2021
 * ------------------------------------
 * Inspired by: LeighM
 * ------------------------------------
 */

let bezier, gui, prevx = 0, prevy = 0;
let pointIndex = null;
let isMouseLocked = false;

const info = {
    shown: false,
    showInfo() {
        if (!this.shown) {

            katex.render("P = (1-t)P_1 + tP_2  ", document.getElementById("lerp-formula"), {
                throwOnError: false 
            });
            
            new WinBox("Bézier Curves by Mavy💚", {
                class: "modern",
                x: "center",
                y: "center",
                mount: document.getElementById("information-content").cloneNode(true),
                onclose: () => {
                    this.shown = false;
                },
            });

            this.shown = true;
        }
    }
};

function setup() {
    const cnv = createCanvas(window.innerWidth, window.innerHeight);

    cnv.doubleClicked(() => {
        bezier.addPoint(mouseX, mouseY);
    });

    pixelDensity(1);

    bezier = new BezierCurve();
    bezier.setDefaultPoints();

    gui = new dat.GUI();

    gui.add(bezier, "speed", 0, 0.02);
    gui.addColor(bezier, "curveColor");
    gui.add(bezier, "isAnimating");
    gui.add(bezier, "showPoints");
    gui.add(bezier, "showEdges");
    gui.add(bezier, "removeAllPoints");
    gui.add(bezier, "reset");
    gui.add(info, "showInfo");

    console.log("Taking a peek huh???");
}

function mousePressed() {
    isMouseLocked = true;
    pointIndex = bezier.checkPointBounds(mouseX, mouseY);

    if (pointIndex) {
        const point = bezier.getPoint(pointIndex);

        prevx = point.x;
        prevy = point.y;
    }
}

function mouseDragged() {
    if (isMouseLocked) {
        bezier.setPoint(pointIndex, mouseX, mouseY);
    }
}

function mouseReleased() {
    pointIndex = bezier.checkPointBounds(mouseX, mouseY);
    
    if (pointIndex) {
        const point = bezier.getPoint(pointIndex);

        if ((prevx == point.x) && (prevy == point.y) && confirm("Delete point?")) {
            bezier.removePoint(pointIndex);
        }
    }

    isMouseLocked = false;
    pointIndex = null;
}

function touchStarted() {
    isMouseLocked = true;
    pointIndex = null;
}

function draw() {
    background(8);

    bezier.show();
    bezier.showDetails();
    bezier.animate();

    if (isMouseLocked && pointIndex == null) {   
        pointIndex = bezier.checkPointBounds(mouseX, mouseY);
    }
}