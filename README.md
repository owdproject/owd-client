# Open Web Desktop - Client

<p>
    <img src="https://i.imgur.com/qiBDv2q.png" alt="Open Web Desktop" />
</p>

> An open-source web desktop made with Vue.js

<p>
    <a href="https://github.com/owdproject/owd-client/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" /></a>
    <a href="https://github.com/owdproject/owd-client"><img src="https://img.shields.io/github/release/owdproject/owd-client.svg" /></a>
    <a href="https://www.npmjs.com/package/@owd-client/core"><img src="https://img.shields.io/npm/v/@owd-client/core.svg?color=blue" /></a>
    <a href="https://github.com/owdproject/owd-client"><img src="https://img.shields.io/badge/owd-client-3A9CB6" /></a>
    <a href="https://github.com/topics/owd-modules"><img src="https://img.shields.io/badge/owd-modules-888" /></a>
    <a href="https://discord.gg/3KFVP8b"><img src="https://img.shields.io/badge/chat-on%20discord-7289da.svg" /></a>
</p>

## Overview
Open Web Desktop is a project that aims to provide a simple environment to create your own web desktop and to extend it through modules and other integrations. OWD Client 2.0 is based on Vue.js 3 and TypeScript.

[Check the demo](https://demo.owdproject.com) of this `owd-client` base repository. 

## Features
- Open-source web desktop client based on Vue.js 3
- Fully extendable through app and desktop modules
- Fully extendable through pages and Vue components
- Global notifications and terminal commands support
- Vuex, Vue Router and Vue i18n implemented by default
- Vuetify.js and Moment.js implemented by default

## About this project
Open Web Desktop is divided in two main repositories:
- [owd-client](https://github.com/owdproject/owd-client): Open Web Desktop client, made with Vue.js
- [owd-server](https://github.com/owdproject/owd-server): Open Web Desktop server, made with Nest.js (TBA)

The plans are to make it expandable through a series of modules
that will be released on [GitHub](https://github.com/topics/owd-modules) and [Patreon](https://patreon.com/hacklover).

## Getting started
In the future there will be a tool to easily bootstrap your OWD client.

For now, you have to follow these steps:

```
# Clone the repository
git clone https://github.com/owd-project/owd-client

# Navigate to the packages folder
cd owd-client/packages

# Copy the client folder in a new location of your choice
cp client <your-path>/my-client

# Navigate to the my-client folder
cd <your-path>/my-client

# Install dependencies
npm install

# Run your OWD Client instance
npm run serve
```

*This branch is for OWD Client 2.0 and this version has not yet been published on [npmjs.com](https://www.npmjs.com/package/@owd-client/core).  
You should use [OWD Client 1.4.3](https://github.com/owdproject/owd-client) or follow [Contributing](#contributing) instructions instead.*

## Modules
On GitHub you can find [some modules](https://github.com/topics/owd-modules).
Each OWD Module may include a `client` or a `server` folder.
There is no CLI available for module installation at the moment, so you have to install each module manually (aaah, fuck this shit).

### Install a new module
You can install new modules by copying the content of `<module>/client` folder into
`<your-path>/my-client/src/modules/<module>`. Some modules like `sample` and `debug` comes pre-installed, take a look.

#### Install module dependencies
Some modules may require other modules installed, or additional [npm](https://www.npmjs.com) packages.
Check the "dependencies" property in `<module>/client/module.json` and the "dependencies" property in `<module>/package.json`.  

Navigate to your OWD Client root folder and install each package defined in `<module>/package.json` by running `npm install <package-name>`. Then, if any module is defined in `<module>/client/module.json`, you should install each one with its package dependencies like just explained.

#### Define the installed module
To be able to load installed modules into your OWD Client instance, you have to define them under `<your-path>/my-client/config/modules.json`.
Edit that file and be sure to add every module in `modulesEnabled` like in the example:

```json
{
  "type": "client",
  "modulesEnabled": {
    "sample": {
      "name": "sample",
      "version": "2.0.0",
      "url": "https://www.github.com/hacklover/owd-sample"
    },
    "your-module-name": {
      "name": "your-module-name",
      "version": "2.0.0",
      "url": ""
    }
  }
}
```

## Contributing

### Local development
The OWD Client repository is a [lerna](https://github.com/lerna/lerna) monorepo that includes the client boilerplate, the client core, and in the future also something else (like the docs) just to keep everything in a single place.

### Setting up your environment

Required software:

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org)
- [Yarn](https://classic.yarnpkg.com)

Once you have everything installed, clone the repository:

```
# Using HTTPS
git clone https://github.com/owdproject/owd-client.git -b next

# Using SSH
git clone git@github.com:owdproject/owd-client.git -b next
```

Then install dependencies and bootstrap the lerna monorepo.
```
# Navigate to the owd-client folder
cd owd-client

# Bootstrap owd-client
lerna bootstrap
```

If you intend to contribute to the project, please join us on our [community chat](https://discord.gg/3KFVP8b).

## Supporters

See all sponsors & backers in the [BACKERS.md](BACKERS.md).

<a href="https://www.patreon.com/hacklover">
    <img src="https://i.imgur.com/KODHUwR.png" width="160" alt="Become a Patron" />
</a>
&nbsp;
<a href="https://www.liberapay.com/hacklover">
    <img src="https://i.imgur.com/tGMNTUz.png" width="160" alt="Become a Patron" />
</a>

## License
This project is released under the [MIT License](LICENSE).