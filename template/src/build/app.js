"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const core_1 = require("@modulator/core");
const core_2 = require("@modulator/core");
const app = (0, express_1.default)();
// Start the server and visit the server URL to explore the framework features.
// Once you're ready to begin development, you can remove this line.
app.use(express_1.default.static(path.join(process.cwd(), 'public')));
// Register Classes for DI
core_1.container.register('EventBus', core_2.EventBus, { singleton: true });
const eventBus = core_1.container.resolve('EventBus');
eventBus.on('module.loaded', () => console.log("All Modules Loaded"));
// Load enabled modules from config
const configPath = path.join(__dirname, '../../config/modules.json');
const enabledModules = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
for (const [moduleName, isEnabled] of Object.entries(enabledModules)) {
    if (!isEnabled)
        continue;
    try {
        // Dynamically import the module's hooks
        const moduleEntryPath = path.join(__dirname, '../../modules', moduleName, 'index');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const hooks = require(moduleEntryPath).default;
        if (hooks && typeof hooks.registerRoutes === 'function') {
            hooks.registerRoutes(app);
            console.log(`Registered routes for module: ${moduleName}`);
        }
    }
    catch (err) {
        console.error(`Failed to load module '${moduleName}':`, err);
    }
}
eventBus.emit('module.loaded');
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
