"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const core_1 = require("@modulator/core");
const core_2 = require("@modulator/core");
const app = (0, express_1.default)();
// Register Classes for DI
core_2.container.register('EventBus', core_2.EventBus, { singleton: true });
core_2.container.register('AppLogger', () => new core_2.Logger({ file: true, console: true }), { singleton: true });
core_2.container.register('DebugLogger', () => new core_2.Logger({ file: true, console: true, logFileName: "debug.log" }), { singleton: true });
const appLogger = core_2.container.resolve('AppLogger');
const debugLogger = core_2.container.resolve('DebugLogger');
appLogger.info('User module loaded');
appLogger.error('This is an error from the user module');
appLogger.warn('This is a warning from the user module');
debugLogger.debug('Debug info from user module', { debug: true });
const eventBus = core_2.container.resolve('EventBus');
eventBus.on('module.loaded', () => console.log("All Modules Loaded"));
// Load enabled modules
const modules = (0, core_1.loadEnabledModules)();
// Auto-discovery: Automatically find and register components
core_1.AutoDiscovery.discoverAll(modules, app, eventBus, core_2.container).then(({ middleware, types }) => {
    console.log('Auto-discovery completed');
    console.log(`Found ${middleware.size} middleware, ${types.size} types`);
    // Store discovered components globally for access
    global.discoveredMiddleware = middleware;
    global.discoveredTypes = types;
    // Emit module.loaded event after auto-discovery is complete
    eventBus.emit('module.loaded');
});
app.listen(3000, () => {
    console.log('Visit http://localhost:3000 to explore the framework features');
});
