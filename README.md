# Open Web Desktop - Client

> An open-source web desktop made with Vue.js

<p>
    <a href="https://github.com/hacklover/curriculum-vuetae/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" /></a>
    <a href="https://discord.gg/jActPSd"><img src="https://img.shields.io/discord/520023979595923476.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2" alt="Join us on Discord" /></a>
</p>

## Overview
Open Web Desktop (previously *hacklover-client*, aka what you can see [here](https://hacklover.net))
is an experimental project that aims to provide a simple environment to create your own web desktop.

Based on Vue.js, it has been rewritten to be fully modular.


## About this project
Open Web Desktop is splitted in various repositories:
- `owd-client`: Open Web Desktop client, made with Vue.js
- `owd-server`: Open Web Desktop server integration with Nest.js
- `owd-cli`: CLI for easy modules installation and maintenance

The plans are to make this web desktop expandable through a series of modules
that will be released on GitHub and Patreon. In the future, they will probably
moved to the [owd-modules](https://github.com/owd-modules) organization.


## Quick start
Make sure that you have Git, Node.js and npm installed.

- Clone the repo with `git clone https://github.com/owd-project/owd-client`


- Enter the directory `cd owd-client`
- Install dependencies `npm install`
- Run the OWD client `npm run serve`


## Documentation
For the moment, there is no documentation. YAY


## Modules
Each OWD module includes a `client` or a `server`
folder. For now, there is no CLI available for modules installation so you should install each module manually.

### Install a new module
You can install a module for **OWD Client** copying the content of the `client` module folder into
`src/modules/<module-name>`.

#### Install module dependencies
Some modules may have additional [npm](https://www.npmjs.com) dependencies, you need to install them manually.
To do so, check the content of the `src/modules/<module-name>/module.json` configuration file
to find out if there are any dependencies to install under "dependencies" property.  

Then run `npm install <dependency-name>` for each dependency. This command will install dependencies into `node_modules` 
and will add them to the project's dependencies list in the `package.json` file.

#### Define the installed module
To be able to load the installed module into your OWD instance, you have to define it under `config/modules.json`.
Edit that file and be sure to add the new module inside `modulesEnabled`, as in the example:

```json
{
  "type": "client",
  "modulesEnabled": {
    "hello-world": {
      "name": "hello-world",
      "version": "1.0.0",
      "url": "https://github.com/owd-modules/hello-world"
    },
    "your-module-name": {
      "name": "your-module-name",
      "version": "1.0.0",
      "url": ""
    }
  }
}

```


## Supporters
This project has been rewritten and modularized to make it open-source and to share it with you.  
Show your appreciation becoming a supporter!

<a href="https://www.patreon.com/hacklover">
    <img src="https://i.imgur.com/KODHUwR.png" width="160" alt="Become a Patron" />
</a>
&nbsp;
<a href="https://www.liberapay.com/hacklover">
    <img src="https://i.imgur.com/tGMNTUz.png" width="160" alt="Become a Patron" />
</a>

## License
This project is released under the [MIT License](LICENSE).