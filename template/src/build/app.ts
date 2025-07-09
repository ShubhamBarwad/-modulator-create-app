import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { NodesmithModuleHooks } from '@modulator/core';
import { container } from '@modulator/core';
import { EventBus } from '@modulator/core';

const app = express();

// Start the server and visit the server URL to explore the framework features.
// Once you're ready to begin development, you can remove this line.
app.use(express.static(path.join(process.cwd(), 'public')));

// Register Classes for DI
container.register('EventBus', EventBus, { singleton: true });

const eventBus = container.resolve<EventBus>('EventBus');

eventBus.on('module.loaded', () => console.log("All Modules Loaded"));

// Load enabled modules from config
const configPath = path.join(__dirname, '../../config/modules.json');
const enabledModules: Record<string, boolean> = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

for (const [moduleName, isEnabled] of Object.entries(enabledModules)) {
  if (!isEnabled) continue;
  try {
    // Dynamically import the module's hooks
    const moduleEntryPath = path.join(__dirname, '../../modules', moduleName, 'index');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const hooks: NodesmithModuleHooks = require(moduleEntryPath).default;
    if (hooks && typeof hooks.registerRoutes === 'function') {
      hooks.registerRoutes(app);
      console.log(`Registered routes for module: ${moduleName}`);
    }
  } catch (err) {
    console.error(`Failed to load module '${moduleName}':`, err);
  }
}
eventBus.emit('module.loaded');

app.listen(3000, () => {
  console.log('Server running on port 3000');
}); 