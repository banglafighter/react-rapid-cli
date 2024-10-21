import path from "path";
const {dirname} = require('path');
const appDir = dirname(<string>require?.main?.filename);

export default class FileManager {

    static getRoot() {
        return appDir
    }

    static getTemplate() {
        return path.join(this.getRoot(), "template")
    }

    static getProjectTemplate() {
        return path.join(this.getTemplate(), "project")
    }
}