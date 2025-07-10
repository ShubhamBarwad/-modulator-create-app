import express from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { loadEnabledModules, AutoDiscovery } from '@modulator/core';
import { container, EventBus, Logger } from '@modulator/core';

const app = express();

// Register Classes for DI
container.register('EventBus', EventBus, { singleton: true });
container.register('AppLogger', () => new Logger({file: true, console: true}), { singleton: true });
container.register('DebugLogger', () => new Logger({file: true, console: true, logFileName: "debug.log"}), { singleton: true });

const appLogger = container.resolve<Logger>('AppLogger');
const debugLogger = container.resolve<Logger>('DebugLogger');
appLogger.info('User module loaded');
appLogger.error('This is an error from the user module');
appLogger.warn('This is a warning from the user module');
debugLogger.debug('Debug info from user module', { debug: true });

const eventBus = container.resolve<EventBus>('EventBus');

eventBus.on('module.loaded', () => console.log("All Modules Loaded"));

// Load enabled modules
const modules = loadEnabledModules();

// Auto-discovery: Automatically find and register components
AutoDiscovery.discoverAll(modules, app, eventBus, container).then(({ middleware, types }) => {
  console.log('Auto-discovery completed');
  console.log(`Found ${middleware.size} middleware, ${types.size} types`);
  
  // Store discovered components globally for access
  (global as any).discoveredMiddleware = middleware;
  (global as any).discoveredTypes = types;
  
  // Emit module.loaded event after auto-discovery is complete
  eventBus.emit('module.loaded');
});

app.listen(3000, () => {
  console.log('Visit http://localhost:3000 to explore the framework features');
}); 