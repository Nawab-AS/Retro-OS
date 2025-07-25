class Button {
    constructor(x, y, w, h, label, onClick) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.label = label;
        this.onClick = onClick;
    }

    isMouseOver() {
        let mouseX2 = pos(mouseX);
        let mouseY2 = pos(mouseY);
        // Check if the mouse is over the button
        return mouseX2 > this.x && mouseX2 < this.x + this.w &&
               mouseY2 > this.y && mouseY2 < this.y + this.h;
    }


    draw() {
        let hover = this.isMouseOver();
        fill(hover ? colors.highlight : colors.grey2);
        rectMode(CORNER);
        rect2(this.x, this.y, this.w, this.h, mouseIsPressed && hover);

        fill(colors.black);
        textAlign(CENTER, CENTER);
        textSize(16);
        strokeWeight(0);
        push();
            if (hover && mouseIsPressed) translate(2, 2);
            text(this.label, this.x + this.w / 2, this.y + this.h / 2);
        pop();
    }


    update() {
        let hover = this.isMouseOver();
        if (hover && mouseJustReleased) {
            this.onClick();
            // no need to add delay to submitting the button as this is already accounted
            // for by using mouseJustReleased (time between mousePressed and mouseReleased) 
            // acts as a delay)
        }
    }
}