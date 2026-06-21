import fs from 'fs';

const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');

let tagStack: { tag: string, line: number }[] = [];

// Match JSX tags using a simple regex
// Matches <tag ...> or </tag>
const tagRegex = /<(\/?[a-zA-Z0-9.-]+)(?:\s+[^>]*?)?>/g;

for (let i = 1544; i < 2810; i++) {
  const line = lines[i];
  if (!line) continue;
  
  // Strip comments, quotes, or string literals to prevent matching inside text
  let cleanLine = line.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '') // strip JSX comments
                      .replace(/\/\/.*/, '') // strip single line comments
                      .replace(/"[^"\\]*(?:\\.[^"\\]*)*"/g, '""') // strip double quotes strings
                      .replace(/'[^'\\]*(?:\\.[^'\\]*)*'/g, "''"); // strip single quotes strings

  let match;
  while ((match = tagRegex.exec(cleanLine)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];
    
    // Ignore self-closing tags like <img ... />, <input ... />, or React components that are self closing
    if (fullTag.endsWith('/>') || ['img', 'input', 'br', 'hr', 'rect', 'circle', 'path', 'defs', 'pattern', 'polygon', 'svg', 'use'].includes(tagName.toLowerCase())) {
      continue;
    }
    
    // Ignore custom capital letter self-closing or childless tags (like icons: HelpCircle, Grid, Laptop, etc.) if they are written as <HelpCircle ... /> in source code, but wait, if it doesn't end with />, we don't ignore it.
    if (tagName.startsWith('/') ) {
      // Closing tag
      const closingName = tagName.slice(1);
      if (tagStack.length === 0) {
        console.log(`Unmatched closing tag </${closingName}> at line ${i + 1}`);
      } else {
        const lastOpen = tagStack.pop();
        if (lastOpen && lastOpen.tag !== closingName) {
          console.log(`Mismatch: Opened <${lastOpen.tag}> at line ${lastOpen.line}, but closed </${closingName}> at line ${i + 1}`);
        }
      }
    } else {
      // Opening tag
      tagStack.push({ tag: tagName, line: i + 1 });
    }
  }
}

console.log(`Remaining open tags: ${tagStack.length}`);
tagStack.forEach(t => console.log(`  Open <${t.tag}> at line ${t.line}`));
