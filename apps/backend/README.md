<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  Local backend built with <a href="http://nodejs.org" target="_blank">Node.js</a> and <a href="https://nestjs.com" target="_blank">NestJS</a>
</p>

<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
</p>

---

## 📌 Team Board Backend

**Team Board Backend** is a **local NestJS backend** created exclusively as a **support application** for frontend development.

The backend exists to mock:
- user **registration** and **authentication** flows,
- **task creation and management**,
- typical **CRUD operations** (Create, Read, Update, Delete).

⚠️ **Important notice**  
This backend is **not production-ready** and **not intended for deployment**. It was created solely as a development tool.

---

## 🎯 Purpose of the project

The main purpose of this backend is to support a **monorepo setup** and enable efficient frontend development.

It serves as a **support backend** for:

👉 **Team Board Frontend** built with **Angular 21**

Thanks to this backend, the frontend application can:
- simulate login and registration,
- fetch and manage tasks,
- test application state management (NgRx),
- develop features without relying on a real production API.

---

## 🧱 Architecture notes

- Local, in-memory or mock-based data storage
- No persistent database required
- Simple REST API design
- Focus on clarity and predictability rather than scalability

---

## ⚙️ Project setup

```bash
npm install
```

---

## ▶️ Running the application

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode (not recommended – local support only)
npm run start:prod
```

---

## 🧪 Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

---

## 📚 Tech stack

- **NestJS**
- **TypeScript**
- **Node.js**

---

## 🔗 Related projects

- **Team Board Frontend** – Angular 21 + NgRx

---

## 📄 License

NestJS is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

This backend follows the same license for educational and development purposes.
