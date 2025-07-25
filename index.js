const colors = {
    background: '#0e6e6d',
    grey: '#a6a6a6',
    grey2: '#c6c6c6',
    highlight: '#e6e6e6',
    blue: '#0000aa',
    white: '#ffffff',
    black: '#000000'
}
let icons;
let mouseJustReleased = false;
function mouseReleased() {
    if (mouseJustReleased) return; // Prevent multiple triggers
    console.log('Mouse released');
    mouseJustReleased = true;

    // Reset mouseJustReleased after 1 frame
    setTimeout(() => {
        mouseJustReleased = false;
    }, 1000/getFrameRate() * 0.75);
}
let startButton, startMenu = false;
let startMenuItems = ['File Explorer', 'Settings', 'Games', 'Help'];

function preload() {
    icons = {
        'logo': loadImage('images/logo.png'),
        'recycleBin': loadImage('images/recycleBin.png')
    };
}

// sizing the canvas to the window size
let zoom;
function windowResized() {
    // 900 x 600
    
    if (windowWidth < windowHeight) {
        // width is smaller
        zoom = windowWidth / 900;
    } else {
        // height is smaller
        zoom = windowHeight / 600;
        if (zoom * 900 > windowWidth) {
            zoom = windowWidth / 900;
        }
    }

    zoom *= 0.95; // 5% margin
    resizeCanvas(900 * zoom, 600 * zoom);
}

function pos(val) {
    return 1 / zoom * val;
}

function setup() {
    createCanvas(innerWidth, innerHeight);
    windowResized();
    frameRate(20); // reduce frame rate for 'slowness'

    startButton = new Button(10, 600 - 35 , 100, 30, '   Start', () => {
        console.log('Start button clicked');
        startMenu = true;
    });

    for (i in startMenuItems) {
        startMenuItems[i] = new Button(10, 600 - (80 + i * 40), 150, 30, startMenuItems[i], () => {
            console.log(`Clicked on ${startMenuItems[i].text}`);
            startMenu = false;
        });
    }
}


function draw(){
    // setup
    scale(zoom);
    textFont('Courier New');
    textSize(16);
    textStyle(BOLD)
    background(colors.background);

    drawTaskbar();
    if (startMenu) drawStartMenu();

    // use shader
    // shader.setUniform('pixelSize', pixelSize);
    // filterShader(shader);
}

function rect2(x, y, w, h, highlight=false, filled=true) {
    let thickness = 3;

    strokeWeight(0);
    if (filled) rect(x, y, w, h);
    stroke(highlight ? colors.black : colors.white);
    strokeWeight(thickness);
    line(x, y - (thickness/2), x + w, y - (thickness/2)); // top
    line(x - (thickness/2), y + h, x - (thickness/2), y); // left

    stroke(highlight ? colors.white : colors.black);
    line(x + w + (thickness/2), y, x + w + (thickness/2), y + h); // right
    line(x + w, y + h + (thickness/2), x, y + h + (thickness/2)); // bottom
}

function text2 (string, x, y) {
    strokeWeight(0);
    text(string, x + 50, y + 15);
}

function drawTaskbar() {
    fill(colors.grey);
    rect2(0, 600 - 40, 900, 40);

    // Start button
    startButton.update();
    startButton.draw();
    image(icons.logo, 15, 600 - 36);

    // Taskbar icons (simplified)
    // let iconX = 260;
    // for (let i = 0; i < 4; i++) {
    //     fill('#444444');
    //     rect(iconX, 600 - 45, 30, 30, 6);
    //     iconX += 40;
    // }
}

function drawStartMenu() {
    strokeWeight(0);

    for (let item of startMenuItems) {
        fill(colors.grey2);
        rect(item.x - 7, item.y - 7, item.w + 14, item.h + 14);

        item.update();
        item.draw();
    }
    let bottom = startMenuItems[0];
    let top = startMenuItems[startMenuItems.length - 1];
    rect2(top.x - 5, top.y - 5,
        top.w + 10, (bottom.y + bottom.h) - top.y + 10, false, false);

    let mouseX2 = pos(mouseX);
    let mouseY2 = pos(mouseY);
    if (mouseX2 < top.x - 5 || mouseX2 > bottom.x + bottom.w + 5 ||
        mouseY2 < top.y - 5) {
        startMenu = false; // close menu if mouse is outside (not including under the menu)
    }
}