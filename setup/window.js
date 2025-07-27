class WindowManager {
    constructor(windowsDiv) {
        this.windows = [];
        this.windowsDiv = windowsDiv;
        this.windowCounter = 0;
        
        // Listen for window close messages
        window.addEventListener('message', (event) => {
            if (event.data.type === 'closeWindow') {
                this.closeWindow(event.data.windowId);
            }
        });
    }

    updateTaskbar() {
        // Notify the main application to update the taskbar
        if (window.updateTaskbarDisplay) {
            window.updateTaskbarDisplay(this.windows);
        }
    }

    addWindow(windowPath, windowName = null, minWidth = 400, minHeight = 300, params = {}, iconPath = null) {
        // if (!windowPath.startsWith('http://') && !windowPath.startsWith('https://')) {
        //     windowPath = location.origin + '/windows' + (windowPath.startsWith('/') ? '' : '/') + windowPath;
        // }

        console.log("."+windowPath);
        // Create a new window element with all parameters as query strings
        const windowElement = document.createElement('iframe');
        windowElement.id = 'window-' + (++this.windowCounter);
        let src = './setup/windowTemplate.html?windowPath=.' + encodeURIComponent((windowPath)) + '&minWidth=' + minWidth + '&minHeight=' + minHeight;
        if (windowName) src += '&windowName=' + encodeURIComponent(windowName);
        if (iconPath) src += '&iconPath=' + encodeURIComponent(iconPath);
        for (const [key, value] of Object.entries(params)) {
            src += `&${key}=${encodeURIComponent(value)}`;
        }
        
        windowElement.src = src;

        // set window size and center it
        windowElement.style.width = minWidth + 'px';
        windowElement.style.height = minHeight + 'px';
        windowElement.style.border = 'none';
        windowElement.style.zIndex = '1000';
        windowElement.style.position = 'fixed';
        windowElement.style.top = '50%';
        windowElement.style.left = '50%';
        windowElement.style.transform = 'translate(-50%, -50%)';
        // Append the new window element to the windows div
        this.windowsDiv.appendChild(windowElement);
        
        // Store window info for taskbar
        const windowInfo = {
            element: windowElement,
            id: windowElement.id,
            title: windowName || 'Window',
            iconPath: iconPath || '/icons/defaultWindow.png'
        };
        this.windows.push(windowInfo);
        
        // Update taskbar
        this.updateTaskbar();
        
        return windowElement;
    }

    closeWindow(windowId) {
        const windowElement = document.getElementById(windowId);
        if (windowElement) {
            // Remove from DOM
            windowElement.remove();
            
            // Remove from windows array
            const index = this.windows.findIndex(w => w.id === windowId);
            if (index > -1) {
                this.windows.splice(index, 1);
            }
            
            // If this was the file explorer, reset the reference
            if (window.fileExplorerWindow === windowElement) {
                window.fileExplorerWindow = null;
            }
            
            // Update taskbar
            this.updateTaskbar();
        }
    }
}