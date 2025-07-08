#!/usr/bin/env node
import * as fs from 'fs-extra';
import * as path from 'path';
import prompts from 'prompts';
import { execSync } from 'child_process';

async function main() {
  const { name } = await prompts({
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

  await fs.copy(templateDir, dest);

  // Update package.json with project name
  const pkgPath = path.join(dest, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    pkg.name = name;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }

  console.log('\nInstalling dependencies...');
  try {
    execSync('npm install', { cwd: dest, stdio: 'inherit' });
  } catch (err) {
    console.error('Failed to install dependencies. Please run npm install manually.');
    process.exit(1);
  }

  console.log('\nInitializing Prisma...');
  try {
    execSync('npx prisma init', { cwd: dest, stdio: 'inherit' });
  } catch (err) {
    console.error('Failed to initialize Prisma. Please run npx prisma init manually.');
    process.exit(1);
  }

  console.log('\nRunning setup:upgrade...');
  try {
    execSync('npm run cli -- setup:upgrade', { cwd: dest, stdio: 'inherit' });
  } catch (err) {
    console.error('Failed to run setup:upgrade. Please run npm run cli -- setup:upgrade manually.');
    process.exit(1);
  }

  console.log(`\nSuccess! Created ${name} at ${dest}`);
  console.log('You can now run:');
  console.log('  npm start');
  console.log('\nHappy hacking!');
}

main(); 