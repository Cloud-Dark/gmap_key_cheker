#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build process...');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Copy web files to dist
const webFiles = ['index.html', 'style.css', 'script-simple.js', 'README.md'];
webFiles.forEach(file => {
    if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(distDir, file));
        console.log(`✓ Copied ${file} to dist/`);
    }
});

// Build executables
const targets = [
    { name: 'Windows', target: 'node18-win-x64', ext: '.exe' },
    { name: 'Linux', target: 'node18-linux-x64', ext: '' },
    { name: 'macOS', target: 'node18-macos-x64', ext: '' }
];

let completed = 0;
const total = targets.length;

targets.forEach(({ name, target, ext }) => {
    const outputName = `gmaps-api-checker-${target.split('-')[1]}${ext}`;
    const cmd = `npx pkg server.js --targets ${target} --output dist/${outputName} --compress GZip`;
    
    console.log(`📦 Building ${name} executable...`);
    
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Error building ${name}:`, error.message);
            return;
        }
        
        console.log(`✅ ${name} executable built: dist/${outputName}`);
        completed++;
        
        if (completed === total) {
            console.log('\n🎉 All builds completed!');
            console.log('\nFiles in dist/:');
            fs.readdirSync(distDir).forEach(file => {
                const stats = fs.statSync(path.join(distDir, file));
                const size = (stats.size / 1024 / 1024).toFixed(2);
                console.log(`  - ${file} (${size} MB)`);
            });
        }
    });
});