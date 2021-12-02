# Open Web Desktop - Client

<p style="text-align: center;">
    <img src="https://i.imgur.com/TqD0gwI.png" alt="Open Web Desktop 2.0.0-beta with Vue 3 and TypeScript" />
</p>

<p>
    <a href="https://npmjs.com/package/@owd-client/core"><img src="https://img.shields.io/npm/v/@owd-client/core.svg?color=1895b1" /></a>
    <a href="https://github.com/owdproject/owd-client"><img src="https://img.shields.io/badge/owd-client-blue" /></a>
    <a href="https://github.com/topics/owd-modules"><img src="https://img.shields.io/badge/owd-modules-777" /></a>
    <a href="https://discord.gg/3KFVP8b"><img src="https://img.shields.io/discord/759699532896010261?color=7289da" /></a>
    <a href="https://github.com/owdproject/owd-client"><img src="https://img.shields.io/github/stars/owdproject/owd-client?style=social" /></a>
</p>

## Overview
Open Web Desktop is a project that aims to provide a simple environment to create your own web desktop, extendable through a series of modules and integrations. OWD Client is based on Vue.js 3 and TypeScript.

[Check the demo](https://demo.owdproject.org) of the `owd-client` base repository, decked out with some modules.

## Features
- Open-source web desktop client based on Vue.js 3
- Fully extendable through app and desktop modules
- Fully extendable through pages and Vue components
- Notifications, terminal commands, multiple themes
- Vuex, Vue Router and Vue i18n implemented by default
- Compatible with Vuetify and Quasar Framework
- TypeScript and Vite support

## About this project
Open Web Desktop is divided in two main repositories:
- [owd-client](https://github.com/owdproject/owd-client): Open Web Desktop client, made with Vue.js 3
- [owd-server](https://github.com/owdproject/owd-server): Open Web Desktop server, made with Nest.js (TBA)

## Getting started
Required software:

- [Git](https://git-scm.com)
- [Node](https://nodejs.org)

When you are ready, bootstrap a new instance by running:
```
npx create-owd-app <app-name>
```
Once the process is complete, you can start with the client development:
```
# Run the dev server
npm run serve

# Build for production
npm run build
```

## Modules
OWD modules can extend your Open Web Desktop instance.  
You can find some modules available for all at [topics/owd-modules](https://github.com/topics/owd-modules).

### Install a new module directly
You can simply install a new module with `npm install <git-link>`, unless you want to customize it.

#### Install and customize a new module
If you are planning to customize a module, clone it into `src/modules/app/<module-name>`.  
Always check the `README.md`, you may have to move some folders (for example "config" or "public").

Also take a look at the `package.json`, there may be additional dependencies to install, or other OWD modules.
For each dependency you find listed, install it by running `npm install <dependency>` in the root folder of your instance.

#### Define the installed module
To load an installed module, define it under `my-owd-client/client.extensions.ts`.  
Be sure to add every module in the `app.modules` array like the default ones:

```js
import AboutModule from "@owd-client/core/src/modules/app/about";
import DebugModule from "@owd-client/core/src/modules/app/debug";

// installed modules
import CustomModuleSource from "./src/modules/app/custom-module/client";
import CustomModuleInstalled from "owd-custom-module/client";

export default {
  app: {
    modules: [
      AboutModule,
      DebugModule,
      CustomModuleSource,
      CustomModuleInstalled
    ]
  },
  ...
```

## Contributing

### Local development
OWD Client repository is a Yarn workspaces monorepo that includes the client boilerplate, the client core, and in the future also something else like the docs, just to keep everything in a single place.

### Setting up your environment

Required software:

- [Git](https://git-scm.com)
- [Node](https://nodejs.org)
- [Yarn](https://classic.yarnpkg.com)

Once you have everything installed, clone the repository:

```
# Using HTTPS
git clone https://github.com/owdproject/owd-client.git

# Using SSH
git clone git@github.com:owdproject/owd-client.git
```

Then install all the dependencies, and run Open Web Desktop in development mode.
```
# Navigate to the owd-client folder
cd owd-client

# Install dependencies using yarn
yarn install

# Run OWD in development mode
yarn serve
```
This will bootstrap the Yarn workspaces, allowing you to run and edit both client and core packages.   
If you intend to contribute to the project, please join our [community chat](https://discord.gg/3KFVP8b).

## Supporters

Your support is essential to keep this project active.  
If you find Open Web Desktop useful, please consider donating.

<a href="https://www.patreon.com/hacklover">
    <img alt="Open Web Desktop Patreon" src="https://img.shields.io/badge/dynamic/json?color=%23e85b46&label=patreon&query=data.attributes.patron_count&suffix=%20patrons&url=https://www.patreon.com/api/campaigns/1208485" />
</a>
&nbsp;
<a href="https://www.liberapay.com/hacklover">
    <img alt="Open Web Desktop Liberapay" src="https://img.shields.io/liberapay/receives/hacklover?label=liberapay" />
</a>

## License
This project is released under the [GNU GPL3 License](LICENSE)