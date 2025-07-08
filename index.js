#!/usr/bin/env node
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const prompts_1 = __importDefault(require("prompts"));
const child_process_1 = require("child_process");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { name } = yield (0, prompts_1.default)({
            type: 'text',
            name: 'name',
            message: 'Project name:'
        });
        if (!name) {
            console.error('Project name is required.');
            process.exit(1);
        }
        const dest = path.resolve(process.cwd(), name);
        const templateDir = path.join(__dirname, 'template');
        if (fs.existsSync(dest)) {
            console.error(`Directory ${dest} already exists.`);
            process.exit(1);
        }
        yield fs.copy(templateDir, dest);
        // Update package.json with project name
        const pkgPath = path.join(dest, 'package.json');
        if (fs.existsSync(pkgPath)) {
            const pkg = yield fs.readJson(pkgPath);
            pkg.name = name;
            yield fs.writeJson(pkgPath, pkg, { spaces: 2 });
        }
        console.log('\nInstalling dependencies...');
        try {
            (0, child_process_1.execSync)('npm install', { cwd: dest, stdio: 'inherit' });
        }
        catch (err) {
            console.error('Failed to install dependencies. Please run npm install manually.');
            process.exit(1);
        }
        console.log('\nInitializing Prisma...');
        try {
            (0, child_process_1.execSync)('npx prisma init', { cwd: dest, stdio: 'inherit' });
        }
        catch (err) {
            console.error('Failed to initialize Prisma. Please run npx prisma init manually.');
            process.exit(1);
        }
        console.log('\nRunning setup:upgrade...');
        try {
            (0, child_process_1.execSync)('npm run cli -- setup:upgrade', { cwd: dest, stdio: 'inherit' });
        }
        catch (err) {
            console.error('Failed to run setup:upgrade. Please run npm run cli -- setup:upgrade manually.');
            process.exit(1);
        }
        console.log(`\nSuccess! Created ${name} at ${dest}`);
        console.log('You can now run:');
        console.log('  npm start');
        console.log('\nHappy hacking!');
    });
}
main();
