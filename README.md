# Open Web Desktop - Client

<p>
    <img src="https://i.imgur.com/qiBDv2q.png" alt="Open Web Desktop" />
</p>

<p>
    <a href="https://github.com/owdproject/owd-client/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" /></a>
    <a href="https://github.com/owdproject/owd-client"><img src="https://img.shields.io/github/release/owdproject/owd-client.svg" /></a>
    <a href="https://www.npmjs.com/package/@owd-client/core"><img src="https://img.shields.io/npm/v/@owd-client/core.svg?color=blue" /></a>
    <a href="https://github.com/owdproject/owd-client"><img src="https://img.shields.io/badge/owd-client-3A9CB6" /></a>
    <a href="https://github.com/topics/owd-modules"><img src="https://img.shields.io/badge/owd-modules-888" /></a>
    <a href="http://discord.gg/3KFVP8b"><img src="https://img.shields.io/badge/chat-on%20discord-7289da.svg" /></a>
</p>

## Overview
Open Web Desktop is an experimental project that aims to provide a simple environment to create your own web desktop, and to extend it through modules and other integrations. OWD Client is based on Vue.js.

[Check the demo](https://demo.owdproject.com) of this `owd-client` base repository decked out with some modules.

## Features
- Open-source web desktop client based on Vue.js 2
- Fully extendable through client and server modules
- Fully extendable through pages and Vue components
- Global notifications and terminal commands support
- Vuex, Vue Router & Vuetify implemented by default

## About this project
Open Web Desktop is divided in two main repositories:
- `owd-client`: Open Web Desktop client, made with Vue.js 2
- `owd-server`: Open Web Desktop server, made with Nest.js (TBA)

## Getting started
Required software:

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org)

For now, there is no OWD CLI available to bootstrap a new OWD Client instance.  
You can proceed manually; once you have everything installed, clone the repository.

```
# using HTTPS
git clone https://github.com/owdproject/owd-client.git

# or using SSH
git clone git@github.com:owdproject/owd-client.git
```

Copy the `owd-client/packages/client` folder somewhere, install dependencies and then you'll ready to go.
```
# create your own owd-client instance
cp owd-client/packages/client my-owd-client

# navigate to your owd-client instance
cd my-owd-client

# install dependencies
npm install

# run owd-client in development mode
npm run serve
```

If you want to publish your desktop, build the source and deploy the `my-owd-client/dist` folder.
```
# build owd-client for production
npm run build
```

## Modules
Each OWD Module may include a `client` or a `server` folder.
For now, there is no OWD CLI available for module installation, so you have to install each module manually too.
Here you can find [some modules](https://github.com/topics/owd-modules).

### Install a new module
You can install a new module by copying the content of the `owd-module/client` folder into
`src/modules/<module-name>`.

#### Install module dependencies
Some modules may require additional [npm](https://www.npmjs.com) dependencies, or other OWD modules to be installed:  

- Check the `src/modules/<module-name>/module.json` config
- If you find some `dependencies` defined, install each one by running `npm install <dependency-name>` in the root folder of your owd-client instance

If the module require other OWD modules, it will be specified in the README.md of that module.

#### Define the installed module
To allow OWD to load the installed module, you have to define it under `my-owd-client/config/modules.json`.
Be sure to add every module in the `modulesEnabled` property like the example above:

```json
{
  "type": "client",
  "modulesEnabled": {
    "sample": {
      "name": "about",
      "version": "1.4.0",
      "url": "https://www.github.com/owdproject/owd-client"
    },
    "your-module-name": {
      "name": "<your-module-name",
      "version": "1.0.0",
      "url": "<your-repo-link>"
    }
  }
}
```

## Supporters

See all sponsors & backers in the [BACKERS.md](BACKERS.md)

<a href="https://www.patreon.com/hacklover">
    <img src="https://i.imgur.com/KODHUwR.png" width="160" alt="Become a Patron" />
</a>
&nbsp;
<a href="https://www.liberapay.com/hacklover">
    <img src="https://i.imgur.com/tGMNTUz.png" width="160" alt="Become a Patron" />
</a>

## License
OWD Client 1.0 is released under the [MIT License](LICENSE)