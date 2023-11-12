const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('bgEngine', {
    getBackgrounds: () => {
        try {
            return ipcRenderer.invoke('getBackgrounds');
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    getBackgroundEngineFolder: () => {
        return ipcRenderer.invoke('backgroundEngineFolder');
    },

    getVideosFolder: () => {
        return ipcRenderer.invoke('videosFolder');
    },

    setGameBackground: (game, video_path) => {
        return ipcRenderer.invoke('setGameBackground', game, video_path);
    },

    setDatabase: (key, value) => {
        return ipcRenderer.invoke('setDatabase', key, value);
    },

    getDatabase: (key) => {
        return ipcRenderer.invoke('getDatabase', key);
    },

    fileExists: (filePath) => {
        return ipcRenderer.invoke('fileExists', filePath);
    },

    deleteFile: (filePath) => {
        return ipcRenderer.invoke('deleteFile', filePath);
    },

    downloadFile: (url) => {
        return ipcRenderer.invoke('downloadFile', url);
    }
});