/**
 * ------------------------------------
 * Author: Maverick G. Fabroa
 * ------------------------------------
 * Date: October 31, 2021
 * ------------------------------------
 * Inspired by: LeighM
 * ------------------------------------
 */

/**
 * My implementation of Bézier curve class
 */
 class BezierCurve {
    constructor() {
        this.points = [];
        this.pointRadius = 8;
        this.extraDetection = 1.5;
        this.curvePoints = [];
        this.curveColor = [75, 255, 0];
        this.isReversed = false;
        this.resetIndex = 0;
        this.t = 0;
        
        this.speed = 0.005;
        this.showEdges = true;
        this.showPoints = true;
        this.isAnimating = true;
    }

    /**
     * Append a point to the bezier curve with the specified [x] and [y] values
     * @param double x 
     * @param double y 
     * @returns vertex point
     */
    addPoint(x, y) {
        const point = createVector(x, y);
        this.points.push(point);
        return point;
    }

    /**
     * Change the value of a point with specified [index] and [x] and [y] values
     * @param int i 
     * @param double x 
     * @param double y 
     */
    setPoint(i, x, y) {
        this.points[i] = createVector(x, y);
    }

    /**
     * Get vertex point with the specified [index]
     * @param int i 
     * @returns vertex point
     */
    getPoint(i) {
        return this.points[i];
    }

    /**
     * Remove a point with the specified [index]
     * @param int i
     */
    removePoint(i) {
        this.points.splice(i, 1);
    }

    /**
     * Remove all points 
     */
    removeAllPoints() {
        this.points = [];
        this.curvePoints = [];
        this.t = 0;
    }

    /**
     * Reset points
     */
    reset() {
        this.points = [];
        this.curvePoints = [];
        this.t = 0;
        this.setDefaultPoints();
    }

    /**
     * Set shadow to an object
     * 
     * @param double x 
     * @param double y 
     * @param int b 
     * @param string c 
     */
    setShadow(x,y,b,c) {
        drawingContext.shadowBlur = b;
        drawingContext.shadowColor = c;
        drawingContext.shadowOffsetX = x;
        drawingContext.shadowOffSetY = y;
    }

    /**
     * Show status
     */
    showDetails() {
        push();
        noStroke();
        fill(75, 255, 0);
        strokeWeight(1);
        textFont("monospace");
        textSize(12);

        this.setShadow(5, 5, 50,`rgb(${this.curveColor[0]}, ${this.curveColor[1]}, ${this.curveColor[2]}`);

        text("Author      : Maverick G. Fabroa", 20, 35);
        text("FPS         : " + floor(frameRate()), 20, 55);
        text("Points      : " + this.points.length, 20, 75);
        text("Progress    : " + floor(this.t * 100) + "%", 20, 95);
        text("Inspired by : LeighM", 20, 115);
        pop();
    }
    
    /**
     * Check if the specified [posx] and [posy] is within a point
     * @param double posx 
     * @param double posy 
     * @returns int | null
     */
    checkPointBounds(posx, posy) {
        // Object detection
        for (let i = 0; i < this.points.length; i++) {
            // Distance formula
            const distance = dist(this.points[i].x, this.points[i].y, posx, posy);
            // Space
            const spacing = this.pointRadius * (1 + this.extraDetection);

            // If the [posx] and [posy] is within a point object
            if (distance < spacing) {
                // Return the index of that point
                return i;
            }
        }

        // Otherwise, return a null value
        return null;
    }

    /**
     * Show the bezier curve path
     */
    show() {
        push();
        
        if (this.showPoints) {
            // Draw the points
            for (const point of this.points) {
                noStroke();
                fill(150);
    
                // Bezier points
                ellipse(point.x, point.y, this.pointRadius * 2);
            }
        }

        if (this.showEdges) {
            // Draw the lines
            for (let i = 0; i < this.points.length - 1; i++) {
                // Get the current point
                const point = this.points[i];
                // Get the next point
                const nextPoint = this.points[i + 1];
    
                noFill();
                stroke(150);
                strokeWeight(4);
                
                // Bezier line or edges
                line(point.x, point.y, nextPoint.x, nextPoint.y);
            }
        }

        pop();
    }

    /**
     * Animate the bezier curve
     * @returns 
     */
    animate() {
        // Animate only is the [isAnimating] flag is true
        if (!this.isAnimating) {
            // Reset only if there's a drawn curve
            if (this.curvePoints.length > 0) {
                this.reset();
            }
            
            return false;
        }

        // Create a prev variable for tracking points
        let prev = null;
        // Create a 2D array for all segments in the bezier curve
        let segments = [];

        // For every point
        for (let i = 0; i < this.points.length - 1; i++) {
            if (i == 0) {
                // Set the first element in the segments to the main points [this.points]
                segments[0] = this.points;
            } else {
                // Just an empty array
                segments.push([]);
            }
        }

        push();

        /**
         * Own implementation of bezier curve (Braaaaaaiinnnn)
         */

        // For every segments
        for (let i = 0; i < segments.length - 1; i++) {
            // For every values in the segments
            for (let j = 0; j < segments[i].length - 1; j++) {
                // Get the current point
                const point = segments[i][j];
                // Get the next point
                const nextPoint = segments[i][j + 1];

                // Linear interpolation of the 2 points
                const px = lerp(point.x, nextPoint.x, this.t);
                const py = lerp(point.y, nextPoint.y, this.t);

                noStroke();
                fill(255, 50);
                ellipse(px, py, 12);
                
                // If theres a previous point
                if (prev != null) {
                    noFill();
                    stroke(255, 50);
                    strokeWeight(4);

                    // Draw a line segment
                    line(prev.x, prev.y, px, py);
                }

                // Set the previous point as the current lerp (Linear Interpolation) of the points
                prev = createVector(px, py);

                // Set the next segments values as the [prev]
                segments[i + 1].push(prev);
                
                // If last iteration, set the [prev] to null
                if (j >= segments[i].length - 2) {
                    prev = null;
                }
            }

            // If last iteration
            if (i + 1 == this.points.length - 2) {
                // Get the last segment points

                // Last point 1
                const p1 = segments[i + 1][0];
                // Last point 2
                const p2 = segments[i + 1][1];

                // Get the linear interpolation of both points
                const px = lerp(p1.x, p2.x, this.t);
                const py = lerp(p1.y, p2.y, this.t);

                noStroke();
                fill(this.curveColor);

                // Draw the curve point
                ellipse(px, py, 16);

                // Record the curve points as vectors
                this.curvePoints.push(createVector(px, py));
            }
        }
        
        noFill();
        beginShape();
        strokeWeight(5);
        stroke(this.curveColor);
        
        this.setShadow(5, 5, 25,`rgb(${this.curveColor[0]}, ${this.curveColor[1]}, ${this.curveColor[2]}`);
        
        // For every curve points
        for (let i = 0; i < this.curvePoints.length; i++) {
            // Get the current curve point
            const point = this.curvePoints[i];
            // Draw the corresponding point
            vertex(point.x, point.y);
        }

        endShape();
        pop();

        /**
         * Time loop
         */

        // Animate only if there are points
        if (this.points.length > 0) {
            // If not reversed
            if (!this.isReversed) {
                // Increase the [t] value
                this.t += this.speed;
                
                // If the [t] value is higher or equal to 1
                if (this.t >= 1) {
                    // Set the reverse flag to true
                    this.isReversed = true;
                    // Reset the curve points
                    this.curvePoints = [];
                }
            } else {
                // Reverse the time
                this.t -= this.speed;
                
                // If [t] is less than or equal to 0
                if (this.t <= 0) {  
                    // Set the reverse flag to false
                    this.isReversed = false;
                    // Reset the curve points
                    this.curvePoints = [];
                }
            }
        }
    }

    /**
     * Default points
     */
    setDefaultPoints() {
        const centerX = width / 2;
        const centerY = height / 2;

        // Increase the size of the shape by 6 for tablets and desktop, and 2.5 for mobile
        const multiplier = width >= 800 ? 6 : 2.5;

        const size1 = 50 * multiplier;
        const size2 = 60 * multiplier;
        const size3 = 30 * multiplier;
        const size4 = 35 * multiplier;

        if (this.resetIndex % 2 == 0) {
            // Heart shape bezier curve
            this.addPoint(centerX, centerY);
            this.addPoint(centerX, centerY - size3);
            this.addPoint(centerX - size1, centerY - size3);
            this.addPoint(centerX - size1, centerY);
    
            this.addPoint(centerX - size1, centerY);
            this.addPoint(centerX - size1, centerY + size3);
            this.addPoint(centerX, centerY + size4);
            this.addPoint(centerX - size1, centerY + size2);
    
            this.addPoint(centerX + size1, centerY + size2);
            this.addPoint(centerX, centerY + size4);
            this.addPoint(centerX + size1, centerY + size3);
            this.addPoint(centerX + size1, centerY);
    
            this.addPoint(centerX + size1, centerY);
            this.addPoint(centerX + size1, centerY - size3);
            this.addPoint(centerX, centerY - size3);
            this.addPoint(centerX, centerY);
        } else if (this.resetIndex % 2 == 1) {
            this.addPoint(centerX - size4, centerY + size3);
            this.addPoint(centerX - size4, centerY - size3);

            this.addPoint(centerX, centerY + (size3 * 0.25));

            this.addPoint(centerX + size4, centerY - size3);
            this.addPoint(centerX + size4, centerY + size3);
        }

        this.resetIndex++;
    }
}   