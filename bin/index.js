"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_manager_1 = __importDefault(require("./commands/project-manager"));
const { Command } = require("commander"); // add this line
const figlet = require("figlet");
console.log(figlet.textSync("React Rapid CLI"));
const program = new Command();
program
    .name('rr-cli')
    .version("1.0.0")
    .description("React Rapid Command Line Interface (rr-cli)")
    .option("-c, --create [dirName]", "Create Project")
    .parse(process.argv);
const options = program.opts();
if (options.create) {
    const dirName = typeof options.create === "string" ? options.create : undefined;
    new project_manager_1.default().create(dirName);
}
//# sourceMappingURL=index.js.map