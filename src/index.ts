#!/usr/bin/env node
import ProjectManager from "./commands/project-manager";

const {Command} = require("commander"); // add this line
const figlet = require("figlet");
const packageJson = require('./../package.json');

console.log(figlet.textSync("React Rapid CLI"));


const program = new Command();

program
    .name('rr-cli')
    .version(packageJson.version)
    .description("React Rapid Command Line Interface (rr-cli)")
    .option("-c, --create [projectName]", "Create Project")
    .parse(process.argv);

const options = program.opts();

if (options.create) {
    const dirName = typeof options.create === "string" ? options.create : undefined;
    new ProjectManager().create(dirName)
}