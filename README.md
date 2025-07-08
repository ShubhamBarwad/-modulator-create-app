# Modulator Framework: Project Scaffolder (`@modulator/create-app`)

Welcome to the **Modulator Framework**—a modern, TypeScript-first, modular monolith framework for Node.js applications. This package (`@modulator/create-app`) provides a CLI tool to scaffold new Modulator projects with best practices, modular architecture, and Prisma ORM integration out of the box.

---

## 🚀 What is Modulator?

Modulator is a framework for building scalable, maintainable, and extensible Node.js applications using a **modular monolith** approach. Inspired by the best of Magento 2, NestJS, and modern backend practices, Modulator lets you:

- Organize your app as independent, loosely-coupled modules
- Each module can have its own routes, models, migrations, and config
- Use Prisma ORM for type-safe, modular database management
- Manage modules and migrations with a powerful CLI
- Enable/disable modules and manage dependencies at runtime

---

## ✨ Features

- **Modular Monolith**: Build large apps as a collection of feature modules
- **Prisma ORM**: Modular schema merging and migrations
- **CLI**: Enable/disable modules, run migrations, inspect module info
- **TypeScript-first**: Strong typing and modern tooling
- **Extensible**: Add new modules, controllers, and models with ease

---

## 🛠️ Getting Started

### 1. Scaffold a New Project

```sh
npx @modulator/create-app my-app
cd my-app
npm run cli -- setup:upgrade
npm start
```

### 2. Project Structure

```
my-app/
  config/
    modules.json         # Tracks enabled/disabled modules
  modules/
    <module>/            # Each module in its own folder
      module.json        # Module manifest (name, version, dependencies, etc)
      controller/
        ...              # Controllers for this module
      model/
        module_schema.prisma # Prisma schema for this module
      index.ts           # Module hooks (registerRoutes, etc)
  prisma/
    schema.prisma        # Merged Prisma schema
  src/
    build/
      app.ts             # App entry point
  package.json
  tsconfig.json
```

---

## 🧩 Creating a New Module

1. **Create a new folder in `modules/`** (e.g., `modules/blog/`)
2. **Add a `module.json` manifest**:
   ```json
   {
     "name": "blog",
     "version": "1.0.0",
     "dependencies": ["user"]
   }
   ```
3. **Add controllers in `controller/`** (e.g., `postController.ts`)
4. **Add a Prisma schema in `model/module_schema.prisma`** (optional)
5. **Create `index.ts`** to export module hooks:
   ```typescript
   import { NodesmithModuleHooks } from '@modulator/core';
   import postController from './controller/postController';

   const hooks: NodesmithModuleHooks = {
     registerRoutes(app) {
       postController(app);
     },
   };

   export default hooks;
   ```
6. **Enable the module**:
   ```sh
   npm run cli -- module:enable blog
   ```
7. **Run setup/upgrade** to merge schemas and run migrations:
   ```sh
   npm run cli -- setup:upgrade
   ```

---

## 🛡️ CLI Commands

- `setup:upgrade` — Discover enabled modules and run their migrations
- `module:list` — List all modules and their status
- `module:enable <name>` — Enable a module (checks dependencies)
- `module:disable <name>` — Disable a module (prevents if dependents exist)
- `module:info <name>` — Show detailed info about a module
- `db:migrate` — Merge all module schemas and run Prisma migration

---

## 🏗️ Best Practices

- **Keep modules independent**: Avoid tight coupling between modules
- **Use `dependencies` in `module.json`** to declare required modules
- **Write migrations and models in each module** for true modularity
- **Use the CLI for all module management**
- **Document your modules** for easier collaboration

---

## 📝 Contributing

- PRs and issues are welcome!
- Please follow the modular structure and TypeScript best practices
- See the CLI and core package READMEs for more details

---

## 📚 Resources

- [Modulator CLI Documentation](../cli/README.md)
- [Modulator Core Documentation](../core/README.md)
- [Prisma ORM](https://www.prisma.io/docs/)

---

## License

MIT 