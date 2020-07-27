# React Micro UI Express

This library adds the ability to quickly host a micro UI within a docker container. This library works alongside the react-micro-ui library.

## Installation

npm i -s @sackrin/react-micro-ui-express

## Usage

within your micro ui src/server.js

```js
import path from "path";
import { ExampleComponent } from "./Components";
import { ExampleEndpoint } from './Endpoints';
import createExpressMicroUI from '@sackrin/react-micro-ui-express/lib/createExpressMicroUI';

// Retrieve the local config
const microUIConfig = require(path.join(process.cwd(), "microui.config.js"));
// Create the express micro UI
const { route, strap, boot } = createExpressMicroUI({
  profile: process.env.PROFILE || "local",
  config: microUIConfig,
});
// ENDPOINTS
// Add custom API endpoints
route('/ExampleEndpoint', 'get', ExampleEndpoint);
// SERVER SIDE RENDERED COMPONENTS
// Strap in the front end components
strap("ExampleComponent", ExampleComponent);
// Boot and handle the response
boot();

```

## Create Express Micro UI

### createExpressMicroUI

Use this to create your micro UI express container

- config: the micro UI config
- profile: the environment profile ie local, dev, stage
- logger: your choice of logger

```const { api, strap, boot, route, env, config, logger } =  createExpressMicroUI({ config, profile = 'local', logger = console })```

## Callbacks

### route(path, method, handler)

Use this to bootstrap API endpoint handlers

- path: the api path
- method: GET | POST | PUT | DELETE
- handler: the handler which will be invoked

```route('/example', 'GET', doExampleEndpoint)```

### strap(name, component)

Use this to bootstrap react components for server side rendering. Not required if you do not intend on providing server side rendered components.

- name: the name of the component
- component: the react component

```strap('ExampleComponent', ExampleComponent)```

### boot()

Will start the express server

```boot()```

## Extras

### env

The current resolved environment the micro UI is using. This is calculated via the micro UI config and the supplied profile

### config

The current config the micro UI is using.

### logger

The current logger the micro UI is using. This will either be the logger you supplied or the default logger (console)
