# Retro-OS
![Hackatime](https://hackatime-badge.hackclub.com/U0857UWECTS/retro-OS)

A nostalgic web-based operating system interface that recreates the classic desktop experience of the 90s. This project provides a fully interactive retro-style desktop environment running entirely in your web browser as a static site.

## Live Demo

You can try out the live demo [here](https://nawab-as.github.io/retro-os).

## Description

Retro-OS is a web application that simulates a classic desktop operating system interface, complete with windows, icons, and a start menu. It's built using vanilla JavaScript and HTML5, providing a nostalgic computing experience while leveraging modern web technologies.

### Features

- 🖥️ Retro-style desktop interface
- 📁 File system navigation with support for:
  - Images (JPEG, GIF)
  - Video files (MP4)
- 🎵 Built-in media playback (audio files currently not supported)
- 🎨 Classic color scheme reminiscent of early operating systems
- 📱 Window management system with taskbar
- 🖱️ Start menu functionality

## Installation

### Requirements
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Local development server

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Nawab-AS/Retro-OS.git
cd retro-OS
```

2. Since this is a static web application, you can serve it using any web server of your choice
> Many web servers utilize 'clean URLs', this however, breaks the embedded window feature and therefore needs to be disabled

  For development, I used npm's http-server:
  1) Install http-server globally:
  ```bash
  npm install -g http-server
  ```
  2) Start the server in the project directory:
  ```bash
  http-server
  ```
  Then visit `http://localhost:8080` in your browser.

## Usage

### Basic Navigation

1. **Start Menu**: Click the start button in the bottom-left corner to access system functions
2. **Desktop Icons**: Double-click icons to open applications or folders
3. **File Access**: Double-click files to open them in their respective viewers

### File System


To access files:
1. Double-click any of the desktop folders to access their respective contents or open the file explorer from the start menu
2. Navigate through directories using double-clicks
3. Double-click files to open them in the viewer


The file system supports various media types organized in folders:
- 📁 Pictures: View images (.jpeg, .gif)
- 🎵 Music: Play audio files (.wav, .mp3)
- 🎥 Videos: Watch video files (.mp4)

Example file structure:
```
Retro/
├── Pictures/
│   ├── vacation.jpeg
│   └── hello.gif
├── Music/
│   ├── Mystery.wav
│   └── Boop Bing Bop.wav
└── Videos/
    └── demo.mp4
```

### Adding/Removing Files and Folders

To modify the file system in Retro-OS, you need to update both the XML configuration and the actual files:

#### Adding Files

1. **Add the actual file** to the appropriate directory in `/home/pi/Desktop/retro-OS/files/Retro/`
2. **Update the XML configuration** in `fileSystem.xml` by adding the corresponding entry:

For images:
```xml
<image name="filename.jpeg"/>
```

For other files:
```xml
<file name="filename.ext"/>
```

#### Adding Folders

1. **Create the physical directory** in `/home/pi/Desktop/retro-OS/files/Retro/`
2. **Add a directory entry** in `fileSystem.xml`:
```xml
<directory name="FolderName">
    <!-- Add files here -->
</directory>
```

#### Example: Adding a new document folder

1. Create folder: `/home/pi/Desktop/retro-OS/files/Retro/Documents/`
2. Add to `fileSystem.xml`:
```xml
<directory name="Documents">
    <file name="readme.txt"/>
</directory>
```

> **Note**: The XML structure must match the physical file structure exactly for the file system to work properly.


## Screenshots

### File Explorer
![File Explorer](https://hc-cdn.hel1.your-objectstorage.com/s/v3/faf2a2d76675d4207136444d083a58f9b7d9a801_file-explorer.png)

### File Viewer
![File Viewer](https://hc-cdn.hel1.your-objectstorage.com/s/v3/a625842e3606be91232fe6b9ddddacd3f7c0344c_file-viewer.png)


## Attributions and Acknowledgements

- Windows 98 icons were taken from https://win98icons.alexmeub.com
- Part of the file explorer and the file viewer was made by AI

## Roadmap
- Add audio playback support
- Implement additional file types (e.g., PDFs, text files)
- Allow multiple windows to be opened simultaneously
- Enhance window management features (e.g., drag-and-drop, resizing)
- Add more applications to the start menu (e.g., calculator, notepad)
- Improve file system navigation with breadcrumbs or a path bar
- Implement a settings menu for customizing the desktop environment
- Add support for nested directories in the file explorer
