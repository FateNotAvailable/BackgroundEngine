const fs = require('fs');
const path = require('path');
const Database = require('../database/Database');
const { generateHashSync } = require('../common/hash');

class Valorant {
    constructor() {
        this.db = new Database();
        this.game_path = this.db.get("valorant_path");
        this.movies_folder = path.join(this.game_path, "live", "ShooterGame", "Content", "Movies", "Menu");
    }

    setBackground(video_path) {
        if (!fs.existsSync(video_path)) {return};
        if (!!this.db.get("valorant_selected_video_path") && !fs.existsSync(this.db.get("valorant_selected_video_path"))) {
            this.db.set("valorant_selected_video_path", "");
            this.db.set("valorant_selected_video_hash", "");
            return;
        }

        if (!fs.existsSync(this.movies_folder)) {
            return;
        }

        const video_hash = generateHashSync(video_path, "md5");

        const files = fs.readdirSync(this.movies_folder);

        const filtered_files = files.filter(item => item.endsWith("mp4"));

        filtered_files.forEach(file => {
            try {
                fs.unlinkSync(path.join(this.movies_folder, file));
                fs.copyFileSync(video_path, path.join(this.movies_folder, file));
                this.db.set("valorant_selected_video_path", video_path);
                this.db.set("valorant_selected_video_hash", video_hash);
            }
            catch (error) {
                if (error.code === 'EBUSY') {
                    this.db.set("valorant_selected_video_path", video_path);
                    this.db.set("valorant_selected_video_hash", video_hash);
                    console.error('Resource is busy or locked:', error.message);
                } else {
                    console.error('An unexpected error occurred:', error);
                }
            }
        });
    }

    wasReplaced() {
        if (!!this.db.get("valorant_selected_video_path") && !fs.existsSync(this.db.get("valorant_selected_video_path"))) {
            this.db.set("valorant_selected_video_path", "");
            this.db.set("valorant_selected_video_hash", "");
            return;
        }

        const video_path = this.db.get("valorant_selected_video_path");
        const video_hash = this.db.get("valorant_selected_video_hash");
        
        if (!video_path || !video_hash) {
            return false;
        }

        if (!fs.existsSync(this.movies_folder)) {
            return false;
        }

        const files = fs.readdirSync(this.movies_folder);

        const filtered_files = files.filter(item => item.endsWith("mp4"));

        let foundMismatch = false;

        filtered_files.forEach(file => {
            const fileHash = generateHashSync(path.join(this.movies_folder, file), "md5");
            if (fileHash !== video_hash) {
                foundMismatch = true;
            }
        });

        return !foundMismatch;

    }
}

module.exports = Valorant