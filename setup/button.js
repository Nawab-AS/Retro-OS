class Button {
    constructor(x, y, w, h, label, onClick, isDesktopIcon = false) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.label = label;
        this.onClick = onClick;
        this.isDesktopIcon = isDesktopIcon;
    }

    isMouseOver() {
        // If this is a desktop icon and start menu is open, return false
        if (this.isDesktopIcon && startMenuEnabled) return false;
        
        let mouseX2 = pos(mouseX);
        let mouseY2 = pos(mouseY);
        // Check if the mouse is over the button
        return mouseX2 > this.x && mouseX2 < this.x + this.w &&
               mouseY2 > this.y && mouseY2 < this.y + this.h;
    }


    draw() {
        let hover = this.isMouseOver();
        
        if (!this.isDesktopIcon) {
            // Regular button drawing
            strokeWeight(0);
            fill(hover ? colors.highlight : colors.grey2);
            rectMode(CORNER);
            rect2(this.x, this.y, this.w, this.h, mouseIsPressed && hover);

            fill(colors.black);
            textAlign(CENTER, CENTER);
            textSize(16);
            textStyle(NORMAL);
            strokeWeight(0);
            push();
                if (hover && mouseIsPressed) translate(2, 2);
                text(this.label, this.x + this.w / 2, this.y + this.h / 2);
            pop();
        } else {
            // Desktop icon drawing
            if (hover) {
                // For desktop icons, just draw a highlight box when hovering
                strokeWeight(0);
                fill(color(255, 255, 255, 50));
                rectMode(CORNER);
                rect(this.x, this.y, this.w, this.h);
            }
            
            // Draw the icon image
            if (icons.directory) {
                image(icons.directory, this.x + 10, this.y + 5, 40, 40);
            }
            
            // Draw the label below the icon
            fill(colors.white);
            textAlign(CENTER, TOP);
            textSize(10);
            textStyle(NORMAL);
            strokeWeight(0);
            
            // Wrap text if it's too long
            let displayText = this.label;
            if (displayText.length > 8) {
                displayText = displayText.substring(0, 8) + '...';
            }
            text(displayText, this.x + this.w / 2, this.y + 48);
        }
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