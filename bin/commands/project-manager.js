"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const file_manager_1 = __importDefault(require("../file-manager"));
const path = require('path');
const chalk = require('chalk');
const validateProjectName = require('validate-npm-package-name');
const fs = require('fs-extra');
class ProjectManager {
    checkAppName(appName) {
        const validationResult = validateProjectName(appName);
        if (!validationResult.validForNewPackages) {
            console.error(chalk.red(`Cannot create a project named ${chalk.green(`"${appName}"`)} because of npm naming restrictions:\n`));
            [
                ...(validationResult.errors || []),
                ...(validationResult.warnings || []),
            ].forEach(error => {
                console.error(chalk.red(`  * ${error}`));
            });
            console.error(chalk.red('\nPlease choose a different project name.'));
            process.exit(1);
        }
        const dependencies = ['react', 'react-dom', 'react-scripts', 'react-rapid-i18n', 'react-rapid-bootstrap', 'react-rapid-app', 'pweb-react', 'react-boot-spec'].sort();
        if (dependencies.includes(appName)) {
            console.error(chalk.red(`Cannot create a project named ${chalk.green(`"${appName}"`)} because a dependency with the same name exists.\n` +
                `Due to the way npm works, the following names are not allowed:\n\n`) +
                chalk.cyan(dependencies.map(depName => `  ${depName}`).join('\n')) +
                chalk.red('\n\nPlease choose a different project name.'));
            process.exit(1);
        }
    }
    isSafeToCreateProjectIn(root, name) {
        const validFiles = [
            '.DS_Store',
            '.git',
            '.gitattributes',
            '.gitignore',
            '.gitlab-ci.yml',
            '.hg',
            '.hgcheck',
            '.hgignore',
            '.idea',
            '.npmignore',
            '.travis.yml',
            'docs',
            'LICENSE',
            'README.md',
            'mkdocs.yml',
            'Thumbs.db',
        ];
        // These files should be allowed to remain on a failed install, but then
        // silently removed during the next create.
        const errorLogFilePatterns = [
            'npm-debug.log',
            'yarn-error.log',
            'yarn-debug.log',
        ];
        const isErrorLog = (file) => {
            return errorLogFilePatterns.some(pattern => file.startsWith(pattern));
        };
        const conflicts = fs
            .readdirSync(root)
            .filter((file) => !validFiles.includes(file))
            // IntelliJ IDEA creates module files before CRA is launched
            .filter((file) => !/\.iml$/.test(file))
            // Don't treat log files from previous installation as conflicts
            .filter((file) => !isErrorLog(file));
        if (conflicts.length > 0) {
            console.log(`The directory ${chalk.green(name)} contains files that could conflict:`);
            console.log();
            for (const file of conflicts) {
                try {
                    const stats = fs.lstatSync(path.join(root, file));
                    if (stats.isDirectory()) {
                        console.log(`  ${chalk.blue(`${file}/`)}`);
                    }
                    else {
                        console.log(`  ${file}`);
                    }
                }
                catch (e) {
                    console.log(`  ${file}`);
                }
            }
            console.log();
            console.log('Either try using a new directory name, or remove the files listed above.');
            return false;
        }
        // Remove any log files from a previous installation.
        fs.readdirSync(root).forEach((file) => {
            if (isErrorLog(file)) {
                fs.removeSync(path.join(root, file));
            }
        });
        return true;
    }
    copyDirectory(source, destination, callback) {
        fs.copy(source, destination, (err) => {
            if (err) {
                console.error(err);
            }
            else {
                if (callback) {
                    callback();
                }
            }
        });
    }
    updateProjectName(projectName, projectRoot) {
        const packageName = "package.json";
        const packageJsonPath = path.join(projectRoot, packageName);
        let content = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        content.name = projectName;
        fs.writeFileSync(packageJsonPath, JSON.stringify(content, null, 2));
    }
    create(projectName) {
        if (!projectName) {
            projectName = "rr-project";
        }
        const root = path.resolve(projectName);
        const appName = path.basename(root);
        this.checkAppName(appName);
        fs.ensureDirSync(projectName);
        if (!this.isSafeToCreateProjectIn(root, projectName)) {
            process.exit(1);
        }
        console.log();
        console.log(`Creating a new React Rapid app in ${chalk.green(root)}.`);
        console.log();
        let projectTemplatePath = file_manager_1.default.getProjectTemplate();
        const _this = this;
        this.copyDirectory(projectTemplatePath, root, () => {
            _this.updateProjectName(projectName, root);
        });
    }
}
exports.default = ProjectManager;
//# sourceMappingURL=project-manager.js.map