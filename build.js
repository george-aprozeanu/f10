#!/usr/bin/env node
const cp = require('child_process');
const path = require('path');

/**
 *
 * @param {string} command
 * @param {string[]} args
 * @param {SpawnOptions?} options
 * @returns {Promise<any>}
 */
function spawn(command, args = [], options) {
    return new Promise((resolve, reject) => {
        let {cwd} = options;
        if (!cwd) cwd = __dirname;
        cwd = path.resolve(cwd);
        console.info(`$ ${cwd}> ${command} ${args.join(' ')}`);

        const p = cp.spawn(command, args, {
            stdio: 'inherit',
            shell: true,
            ...options,
            cwd
        });
        p.on('close', resolve);
        p.on('error', reject);
    });
}

/**
 *
 * @param {string} cwd
 * @param {string} args
 * @returns {Promise<void>}
 */
async function yarn(cwd, ...args) {
    await spawn('yarn', args, {cwd});
}

/**
 *
 * @param {string} cwd
 * @param {string} args
 * @returns {Promise<void>}
 */
async function tsc(cwd, ...args) {
    await yarn(cwd, ['tsc', ...args]);
}

const projects = ['f10-stream', 'f10-react'];
const testProject = 'f10-test-stream';
const testCommand = ['mocha', 'index.js'];

async function main() {
    for (let project of [...projects, testProject]) {
        await yarn(project);
        await tsc(project);
    }
    await yarn(testProject, ...testCommand);
}

main().catch(console.error);