const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

const replacements = [
  // Backgrounds
  { from: /bg-navy-900/g, to: 'bg-lavender-50' },
  { from: /bg-navy-800\/60/g, to: 'bg-white/60' },
  { from: /bg-navy-800/g, to: 'bg-white/80' },
  { from: /bg-navy-700/g, to: 'bg-lavender-100' },
  { from: /bg-navy-600/g, to: 'bg-lavender-200' },
  { from: /bg-white\/5/g, to: 'bg-brand-500/5' },
  { from: /bg-white\/10/g, to: 'bg-brand-500/10' },
  { from: /bg-white\/20/g, to: 'bg-brand-500/20' },
  
  // Hover Backgrounds
  { from: /hover:bg-navy-700/g, to: 'hover:bg-lavender-200' },
  { from: /hover:bg-white\/10/g, to: 'hover:bg-brand-500/10' },
  { from: /hover:bg-white\/20/g, to: 'hover:bg-brand-500/20' },
  { from: /hover:bg-white\/8/g, to: 'hover:bg-brand-500/10' },
  
  // Text Colors
  { from: /text-white/g, to: 'text-lavender-950' },
  { from: /text-gray-400/g, to: 'text-gray-600' },
  { from: /text-gray-300/g, to: 'text-gray-600' },
  { from: /text-gray-500/g, to: 'text-gray-500' },
  { from: /text-brand-300/g, to: 'text-brand-700' },
  { from: /text-brand-400/g, to: 'text-brand-600' },
  
  // Borders
  { from: /border-white\/10/g, to: 'border-brand-500/10' },
  { from: /border-white\/20/g, to: 'border-brand-500/20' },
  { from: /border-brand-500\/50/g, to: 'border-brand-400' },
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      replacements.forEach(({ from, to }) => {
        if (content.match(from)) {
          content = content.replace(from, to);
          modified = true;
        }
      });
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('UI replacement complete.');
