const path = require('path');
const chalk = require('chalk');
const validateProjectName = require('validate-npm-package-name');
const fs = require('fs-extra');

export default class ProjectManager {

    checkAppName(appName: any) {
        const validationResult = validateProjectName(appName);
        if (!validationResult.validForNewPackages) {
            console.error(
                chalk.red(
                    `Cannot create a project named ${chalk.green(
                        `"${appName}"`
                    )} because of npm naming restrictions:\n`
                )
            );
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
            console.error(
                chalk.red(
                    `Cannot create a project named ${chalk.green(
                        `"${appName}"`
                    )} because a dependency with the same name exists.\n` +
                    `Due to the way npm works, the following names are not allowed:\n\n`
                ) +
                chalk.cyan(dependencies.map(depName => `  ${depName}`).join('\n')) +
                chalk.red('\n\nPlease choose a different project name.')
            );
            process.exit(1);
        }
    }

    isSafeToCreateProjectIn(root: any, name: any) {
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
        const isErrorLog = (file: any) => {
            return errorLogFilePatterns.some(pattern => file.startsWith(pattern));
        };

        const conflicts = fs
            .readdirSync(root)
            .filter((file: any) => !validFiles.includes(file))
            // IntelliJ IDEA creates module files before CRA is launched
            .filter((file: any) => !/\.iml$/.test(file))
            // Don't treat log files from previous installation as conflicts
            .filter((file: any) => !isErrorLog(file));

        if (conflicts.length > 0) {
            console.log(
                `The directory ${chalk.green(name)} contains files that could conflict:`
            );
            console.log();
            for (const file of conflicts) {
                try {
                    const stats = fs.lstatSync(path.join(root, file));
                    if (stats.isDirectory()) {
                        console.log(`  ${chalk.blue(`${file}/`)}`);
                    } else {
                        console.log(`  ${file}`);
                    }
                } catch (e) {
                    console.log(`  ${file}`);
                }
            }
            console.log();
            console.log(
                'Either try using a new directory name, or remove the files listed above.'
            );

            return false;
        }

        // Remove any log files from a previous installation.
        fs.readdirSync(root).forEach((file: any) => {
            if (isErrorLog(file)) {
                fs.removeSync(path.join(root, file));
            }
        });
        return true;
    }


    create(projectName: any) {
        if (!projectName) {
            projectName = "rr-project"
        }

        const root = path.resolve(projectName);
        const appName = path.basename(root);
        this.checkAppName(appName)

        fs.ensureDirSync(projectName);
        if (!this.isSafeToCreateProjectIn(root, projectName)) {
            process.exit(1);
        }
        console.log();
        console.log(`Creating a new React Rapid app in ${chalk.green(root)}.`);
        console.log();
    }

}