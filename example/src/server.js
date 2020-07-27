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
