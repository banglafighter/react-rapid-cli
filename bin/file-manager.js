"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const { dirname } = require('path');
const appDir = dirname(require?.main?.filename);
class FileManager {
    static getRoot() {
        return appDir;
    }
    static getTemplate() {
        return path_1.default.join(this.getRoot(), "template");
    }
    static getProjectTemplate() {
        return path_1.default.join(this.getTemplate(), "project");
    }
}
exports.default = FileManager;
//# sourceMappingURL=file-manager.js.map