// Global variables
window.startMenuEnabled = false;

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

let startButton;
let startMenu = [];
let desktopIcons = [];
let windowManager;
let fileExplorerWindow = null;
let taskbarWindows = [];

function preload() {
    icons = {
        'logo': loadImage('icons/logo.png'),
        'shutdown': loadImage('icons/shutdown.png'),
        'recycleBin': loadImage('icons/recycleBin.png'),
        'directory': loadImage('icons/directory.png'),
        'image': loadImage('icons/image.png'),
        'audio': loadImage('icons/audio.png'),
        'default': loadImage('icons/defaultWindow.png')
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

let shutdown = false;

// Function to update taskbar display
window.updateTaskbarDisplay = function(windows) {
    taskbarWindows = windows;
};

function getIconForFolder(folderName) {
    // Return appropriate icon based on folder name
    switch(folderName.toLowerCase()) {
        case 'pictures':
            return icons.image;
        case 'music':
            return icons.audio;
        case 'videos':
            return icons.default; // Using default for videos since we don't have a video icon
        default:
            return icons.directory; // Default to directory icon for any other folders
    }
}

function openFileExplorer(path) {
    console.log(path);
    if (!fileExplorerWindow || !document.body.contains(fileExplorerWindow)) {
        // Create new window if it doesn't exist or was closed
        fileExplorerWindow = windowManager.addWindow('./windows/fileExplorer.html', 'File Explorer', 500, 400, { path: path }, '/icons/recycleBin.png');
    } else {
        // First, update the iframe source back to fileExplorer.html if it's currently showing a file
        const windowTemplateDoc = fileExplorerWindow.contentDocument || fileExplorerWindow.contentWindow.document;
        const contentIframe = windowTemplateDoc.querySelector('#window-content iframe');
        if (contentIframe) {
            if (!contentIframe.src.includes('fileExplorer.html')) {
                // If we're in file viewer, switch back to explorer
                contentIframe.src = `../windows/fileExplorer.html?path=${encodeURIComponent(path)}`;
                // Update the window title
                const titleH3 = windowTemplateDoc.querySelector('h3');
                if (titleH3) {
                    const folderName = path.split('/').pop() || 'Retro';
                    titleH3.textContent = `File Explorer - ${folderName}`;
                }
            } else if (contentIframe.contentWindow) {
                // If already in explorer, just update the path
                contentIframe.contentWindow.postMessage({ type: 'setPath', path: path }, '*');
            }
        }
        
        // Update the window title in taskbar
        const windowInfo = taskbarWindows.find(w => w.element === fileExplorerWindow);
        if (windowInfo) {
            const folderName = path.split('/').pop() || 'Retro';
            windowInfo.title = `File Explorer - ${folderName}`;
        }
    }
}

function openFile(filePath, fileName) {
    if (!fileExplorerWindow || !document.body.contains(fileExplorerWindow)) {
        // Create window if it doesn't exist
        fileExplorerWindow = windowManager.addWindow('../windows/file.html', `File Viewer - ${fileName}`, 600, 500, 
            { filePath: filePath, fileName: fileName }, '/icons/defaultWindow.png');
    } else {
        // Replace the current window content with file viewer
        const windowTemplateDoc = fileExplorerWindow.contentDocument || fileExplorerWindow.contentWindow.document;
        const currentIframe = windowTemplateDoc.querySelector('#window-content iframe');
        
        // Update the iframe source to file.html
        const params = new URLSearchParams({
            filePath: filePath,
            fileName: fileName
        });
        currentIframe.src = `../windows/file.html?${params.toString()}`;
                
        // Update window title in taskbar
        const taskbarWindow = taskbarWindows.find(w => w.element === fileExplorerWindow);
        if (taskbarWindow) {
            taskbarWindow.title = fileName;
        }
        const header = windowTemplateDoc.querySelector('#window-header h2');
        if (header) {
            header.textContent = `File Viewer - ${fileName}`;
        }
        
        // Update taskbar title
        const windowInfo = taskbarWindows.find(w => w.element === fileExplorerWindow);
        if (windowInfo) {
            windowInfo.title = `File Viewer - ${fileName}`;
        }
    }
}

function createDesktopIcons() {
    // Clear existing desktop icons
    desktopIcons = [];
    
    // Fetch and parse the filesystem XML
    fetch('./fileSystem.xml')
        .then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(xml => {
            const root = xml.documentElement;
            const iconSpacing = 80;
            const startX = 20;
            const startY = 20;
            let x = startX;
            let y = startY;
            
            // Get all direct child directories of the root
            const directories = Array.from(root.children).filter(child => child.tagName === 'directory');
            
            directories.forEach((directory, index) => {
                const folderName = directory.getAttribute('name');
                console.log('Creating desktop icon for:', folderName);
                
                desktopIcons.push(new Button(x, y, 60, 60, folderName, () => {
                    console.log(folderName + ' clicked');
                    openFileExplorer('/Retro/' + folderName);
                }, true));
                
                y += iconSpacing;
                if (y > 500) { // If we hit bottom of screen
                    y = startY;
                    x += iconSpacing;
                }
            });
        })
        .catch(error => {
            console.error('Error loading filesystem:', error);
            // Fallback to hardcoded folders if XML fails to load
            const folders = ['Pictures', 'Music', 'Videos'];
            const iconSpacing = 80;
            const startX = 20;
            const startY = 20;
            let x = startX;
            let y = startY;
            
            folders.forEach((folder, index) => {
                desktopIcons.push(new Button(x, y, 60, 60, folder, () => {
                    console.log(folder + ' clicked');
                    openFileExplorer('/Retro/' + folder);
                }, true));
                
                y += iconSpacing;
                if (y > 500) {
                    y = startY;
                    x += iconSpacing;
                }
            });
        });
}

function setup() {
    createCanvas(innerWidth, innerHeight);
    windowResized();
    frameRate(20); // reduce frame rate for 'slowness'
    
    createDesktopIcons();

    // start button
    startButton = new Button(10, 600 - 35 , 100, 30, '    Start', () => {
        console.log('Start button clicked');
        window.startMenuEnabled = true;
    });

    // startMenu
    startMenu.push(new Button(15, 600 - 42 - (40*1), 150, 30, '  Shut Down', () => {
        shutdown = true;
    }));

    startMenu.push(new Button(15, 600 - 42 - (40*2), 150, 30, 'File Explorer', () => {
        openFileExplorer('/Retro/Pictures'); 
    }));

    windowManager = new WindowManager(document.getElementById('windows'));
    
    // Listen for messages from window content
    window.addEventListener('message', (event) => {
        if (event.data.type === 'openFileExplorer') {
            openFileExplorer(event.data.path);
        } else if (event.data.type === 'openFile') {
            openFile(event.data.filePath, event.data.fileName);
        }
    });
}

function draw(){
    // Setup canvas properties consistently
    scale(zoom);
    textFont('Courier New');
    textSize(16);
    textStyle(BOLD);
    textAlign(LEFT, BASELINE); // Reset text alignment
    fill(colors.white); // Reset fill color
    stroke(colors.black); // Reset stroke
    strokeWeight(0); // Reset stroke weight
    background(colors.background);

    drawTaskbar();
    
        // Draw desktop icons
    for (let icon of desktopIcons) {
        if (!startMenuEnabled) {
            icon.update();
        }
        icon.draw();
    }

    if (window.startMenuEnabled) drawstartMenu();

    if (shutdown) {
        shutdown = confirm('Are you sure you want to shut down?');
        if (!shutdown) return;
        background('#000');
        noLoop();
    }
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
    // Reset drawing properties
    strokeWeight(0);
    fill(colors.grey);
    rect2(0, 600 - 40, 900, 40);

    // Start button
    startButton.update();
    startButton.draw();
    image(icons.logo, 15, 600 - 36, 37, 32);

    // Draw open windows in taskbar
    let iconX = 120; // Start after the start button
    const iconWidth = 150;
    const iconHeight = 30;
    const iconSpacing = 5;
    
    for (let i = 0; i < taskbarWindows.length; i++) {
        const windowInfo = taskbarWindows[i];
        if (iconX + iconWidth > 900) break; // Don't overflow taskbar
        
        // Check if mouse is over this taskbar button
        let mouseX2 = pos(mouseX);
        let mouseY2 = pos(mouseY);
        const isHovered = mouseX2 >= iconX && mouseX2 <= iconX + iconWidth && 
                         mouseY2 >= 600 - 35 && mouseY2 <= 600 - 5;
        
        // Handle click on taskbar button
        if (isHovered && mouseJustReleased) {
            // Bring window to front or focus
            windowInfo.element.style.zIndex = '1001';
            // Reset other windows z-index
            taskbarWindows.forEach(w => {
                if (w !== windowInfo) {
                    w.element.style.zIndex = '1000';
                }
            });
        }
        
        // Draw window button background
        strokeWeight(0);
        fill(isHovered ? colors.highlight : colors.grey2);
        rect2(iconX, 600 - 35, iconWidth, iconHeight);
        
        // Draw window icon (small)
        if (windowInfo.iconPath) {
            try {
                const windowIcon = windowInfo.iconPath.includes('recycleBin') ? icons.recycleBin : icons.default;
                image(windowIcon, iconX + 5, 600 - 32, 24, 24);
            } catch (e) {
                image(icons.default, iconX + 5, 600 - 32, 24, 24);
            }
        }
        
        // Draw window title (truncated if too long)
        strokeWeight(0);
        fill(colors.black);
        textAlign(LEFT, CENTER);
        textSize(12);
        textStyle(BOLD);
        let title = windowInfo.title;
        if (title.length > 15) {
            title = title.substring(0, 12) + '...';
        }
        text(title, iconX + 35, 600 - 20);
        
        iconX += iconWidth + iconSpacing;
    }
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
        window.startMenuEnabled = false; // close menu if mouse is outside (not including under the menu)
    }
}
