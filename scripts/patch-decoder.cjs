const fs = require('fs');
const path = require('path');

const source = 'src/submodules/ttn-payload-formater/TnnJsDecoder/TE_TtnDecoder.js';
const dest = 'src/utils/TE_TtnDecoder.esm.js';

// Ensure the directory exists
fs.mkdirSync(path.dirname(dest), { recursive: true });

let content = fs.readFileSync(source, 'utf8');

// Remove the CJS export block
content = content.replace(
    /if\s*\(typeof exports\s*!==\s*['"]undefined['"]\)\s*\{[^}]*\}/,
    ''
);

// Add ESM export at the end
content += '\nexport { te_decoder };\n';

fs.writeFileSync(dest, content);
console.log('Patched TE_TtnDecoder -> ESM');