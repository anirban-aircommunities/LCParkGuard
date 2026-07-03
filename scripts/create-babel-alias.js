const fs = require('fs');
const path = require('path');

function createAlias(oldName, newName) {
  const aliasDir = path.join(__dirname, '..', 'node_modules', '@babel', oldName);

  // Create directory if it doesn't exist
  if (!fs.existsSync(aliasDir)) {
    fs.mkdirSync(aliasDir, { recursive: true });
  }

  // Create index.js that re-exports the transform plugin
  fs.writeFileSync(
    path.join(aliasDir, 'index.js'),
    `module.exports = require("@babel/${newName}");\n`
  );

  // Create package.json
  fs.writeFileSync(
    path.join(aliasDir, 'package.json'),
    JSON.stringify({
      name: `@babel/${oldName}`,
      version: '7.25.2',
      description: `Alias for @babel/${newName}`,
      main: 'index.js',
    }, null, 2) + '\n'
  );

  console.log(`Created @babel/${oldName} alias`);
}

// Create aliases for old plugin names
createAlias('plugin-proposal-optional-chaining', 'plugin-transform-optional-chaining');
createAlias('plugin-proposal-nullish-coalescing-operator', 'plugin-transform-nullish-coalescing-operator');
