const colors = {
    background: '#0e6e6d',
    grey: '#b3b3b3',
    highlight: '#363636',
    blue: '#0000aa',
    white: '#ffffff',
    black: '#000000'
}

// shader
let shader; 
let pixelSize = 1.5;

function preload() {
    shader = loadShader('./shader.vert', './shader.glsl');
}

// sizing the canvas to the window size
function windowResized() {resizeCanvas(innerWidth, innerHeight)}
function setup() {
    createCanvas(innerWidth, innerHeight);
    // 800x600:
}


function draw(){
    drawHomepage();
    
    // use shader
    // shader.setUniform('pixelSize', pixelSize);
    // filterShader(shader);
}


function drawHomepage() {
    background(colors.background);

    // Taskbar
    noStroke();
    fill(colors.grey);
    rect(0, height - 60, width, 60);

    // Start button
    fill(colors.blue);
    rect(10, height - 50, 40, 40, 8);
    fill('#ffffff');
    textSize(30);
    textAlign(CENTER, CENTER);
    text('⊞', 30, height - 30);

    // Taskbar icons (simplified)
    let iconX = 60;
    for (let i = 0; i < 4; i++) {
        fill('#444444');
        rect(iconX, height - 45, 30, 30, 6);
        iconX += 40;
    }

    // Desktop icons
    fill('#ffffff');
    rect(40, 80, 48, 48, 8);
    fill('#000000');
    textSize(12);
    textAlign(CENTER, TOP);
    text('This PC', 64, 132);

    fill('#ffffff');
    rect(40, 150, 48, 48, 8);
    fill('#000000');
    text('Recycle Bin', 64, 202);
}