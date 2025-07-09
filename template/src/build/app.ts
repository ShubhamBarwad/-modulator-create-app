import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { loadEnabledModules, container, EventBus } from '@modulator/core';

const app = express();

// Start the server and visit the server URL to explore the framework features.
// Once you're ready to begin development, you can remove this line.
app.use(express.static(path.join(process.cwd(), 'public')));

// Register Classes for DI
container.register('EventBus', EventBus, { singleton: true });

const eventBus = container.resolve<EventBus>('EventBus');

eventBus.on('module.loaded', () => console.log("All Modules Loaded"));

// Load enabled modules
const modules = loadEnabledModules();

// Auto-discovery: Automatically find and register components
// Note: AutoDiscovery will be available in future versions
// For now, we'll use the manual registration approach
for (const module of modules) {
  try {
    // Dynamically import the module's hooks
    const moduleEntryPath = path.join(module.modulePath, 'index');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const hooks = require(moduleEntryPath).default;
    
    if (hooks && typeof hooks.registerRoutes === 'function') {
      hooks.registerRoutes(app);
      console.log(`Registered routes for module: ${module.name}`);
    }
    if (hooks && typeof hooks.registerEvents === 'function') {
      hooks.registerEvents(eventBus);
      console.log(`Registered events for module: ${module.name}`);
    }
  } catch (err) {
    console.error(`Failed to load module '${module.name}':`, err);
  }
}

eventBus.emit('module.loaded');

app.listen(3000, () => {
  console.log('Server running on port 3000');
  console.log('Visit http://localhost:3000 to explore the framework features');
}); 