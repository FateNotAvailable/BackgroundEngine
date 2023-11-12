const { backgroundEngineFolder } = require("../common/paths");
const path = require('path');
const fs = require('fs');

class Database {
    constructor() {
        this.db_folder = path.join(backgroundEngineFolder(), "database.json");

        if (!fs.existsSync(this.db_folder)) {
            const jsonData = {};
            const jsonString = JSON.stringify(jsonData, null, 2); // The third parameter (2) is for indentation
            fs.writeFileSync(this.db_folder, jsonString);
        }
    }

    set(key, value) {
        const rawData = fs.readFileSync(this.db_folder, 'utf-8');
        const jsonData = JSON.parse(rawData);
        jsonData[key] = value;
        const jsonString = JSON.stringify(jsonData, null, 2);
        fs.writeFileSync(this.db_folder, jsonString);;
    }

    get(key) {
        const rawData = fs.readFileSync(this.db_folder, 'utf-8');
        const jsonData = JSON.parse(rawData);
        const value = jsonData[key];

        if (value !== undefined) {
            return value;
        }
        return null;
    }
}

module.exports = Database;