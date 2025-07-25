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
    //console.log('Mouse released');
    mouseJustReleased = true;

    // Reset mouseJustReleased after 0.9 frames
    setTimeout(() => {
        mouseJustReleased = false;
    }, 1000/getFrameRate() * 0.9);
}

let startButton, startMenuEnabled = false;
let startMenu = [];
let topZindex = 0; // For managing window stacking order

function preload() {
    icons = {
        'logo': loadImage('icons/logo.png'),
        'shutdown': loadImage('icons/shutdown.png'),
        'recycleBin': loadImage('icons/recycleBin.png')
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

const pos = (val) => 1 / zoom * val;

function setup() {
    createCanvas(innerWidth, innerHeight);
    windowResized();
    frameRate(20); // reduce frame rate for 'slowness'

    // start button
    startButton = new Button(10, 600 - 35 , 100, 30, '    Start', () => {
        console.log('Start button clicked');
        startMenuEnabled = true;
    });

    // startMenu
    startMenu.push(new Button(15, 600 - 42 - (40*1), 150, 30, '  Shut Down', () => {
        console.log('Shut Down clicked');
    }));

    startMenu.push(new Button(15, 600 - 42 - (40*2), 150, 30, 'File Explorer', () => {
        console.log('File Explorer clicked');
        addWindow('File Explorer', 'fileExplorer', 'recycleBin');
    }));

    startMenu.push(new Button(15, 600 - 42 - (40*3), 150, 30, 'Settings', () => {
        console.log('Settings clicked');
        // TODO: Implement settings logic here
    }));

    startMenu.push(new Button(15, 600 - 42 - (40*4), 150, 30, 'Games', () => {
        console.log('Games clicked');
        // TODO: Implement games logic here
    }));

    startMenu.push(new Button(15, 600 - 42 - (40*5), 150, 30, 'Help', () => {
        console.log('Help clicked');
        // TODO: Implement help logic here
    }));

    start();
}

function draw(){
    // setup
    scale(zoom);
    textFont('Courier New');
    textSize(16);
    textStyle(BOLD)
    background(colors.background);

    drawTaskbar();
    if (startMenuEnabled) drawstartMenu();

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

function drawTaskbar() {
    fill(colors.grey);
    rect2(0, 600 - 40, 900, 40);

    // Start button
    startButton.update();
    startButton.draw();
    image(icons.logo, 15, 600 - 36, 37, 32);

    // Taskbar icons (simplified)
    // let iconX = 260;
    // for (let i = 0; i < 4; i++) {
    //     fill('#444444');
    //     rect(iconX, 600 - 45, 30, 30, 6);
    //     iconX += 40;
    // }
}

function drawstartMenu() {
    strokeWeight(0);

    for (let item of startMenu) {
        fill(colors.grey2);
        rect(item.x - 7, item.y - 7, item.w + 14, item.h + 14);

        item.update();
        item.draw();
        if (item.label.includes('Shut Down')) {
            image(icons.shutdown, item.x + 5, item.y, 30, 30);
        }
    }
    let bottom = startMenu[0];
    let top = startMenu[startMenu.length - 1];
    rect2(top.x - 5, top.y - 5,
        top.w + 10, (bottom.y + bottom.h) - top.y + 10, false, false);

    let mouseX2 = pos(mouseX);
    let mouseY2 = pos(mouseY);
    if (mouseX2 < top.x - 5 || mouseX2 > bottom.x + bottom.w + 5 ||
        mouseY2 < top.y - 5) {
        startMenuEnabled = false; // close menu if mouse is outside (not including under the menu)
    }
}
