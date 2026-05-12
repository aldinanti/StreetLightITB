#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

// Ensure we run from repository root (where this script lives in scripts/)
const root = path.resolve(__dirname, '..');
process.chdir(root);

const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const args = ['expo', 'start', '--tunnel', '-c'];

const child = spawn(cmd, args, { stdio: 'inherit' });
child.on('exit', code => process.exit(code));
