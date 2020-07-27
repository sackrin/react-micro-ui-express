import path from 'path';
import express from 'express';
import React, { createElement } from 'react';
import embedComponent from '@sackrin/react-micro-ui/lib/Helpers/embedComponent';
import { MicroUiConfigProfileEnv } from '@sackrin/react-micro-ui/lib/Types/MicroUiConfigProfileEnv';
import { MicroUiConfig } from '@sackrin/react-micro-ui/lib/Types/MicroUiConfig';

type DoStrapHandler = (
  name: string,
  component: React.ComponentType,
  logger: any,
  env: MicroUiConfigProfileEnv,
  config: MicroUiConfig,
  method: string,
) => (req: express.Request, res: express.Response) => Promise<void>;

// Direct Import React
// We have to do it this way to permit SSR react + hooks
const ReactDOMServer = require(path.join(process.cwd(), 'node_modules', 'react-dom', 'server'));

const doStrapHandler: DoStrapHandler = (name, component, logger, env, config, method) => async (req, res) => {
  // This is needed to stop issues with window and document throwing errors in SSR
  (global as any).window = {};
  (global as any).document = {};
  // Extract and construct the component props from the provided POST and GET variables
  const httpQuery = !req.query ? {} : req.query;
  const httpBody = !req.body ? {} : req.body;
  const props = { ...httpQuery, ...httpBody };
  const strapHeaders = env?.strap?.headers || {};
  // Attempt to construct a static HTML representation of the component
  // Do this using provided POST and GET parameters
  try {
    // Attempt to render the component's HTML using react's ReactDOMServer
    const rendered = ReactDOMServer.renderToString(createElement(component, props));
    const html = embedComponent(name, env, config, props, rendered);
    // Set express to return the component as the response body
    res.set('Content-Type', 'text/html');
    // Inject any additional headers
    Object.entries(strapHeaders).forEach(([key, value]) => {
      // Set the additional header
      res.set(key, value as string);
    });
    res.status(200);
    res.send(html);
    // res.sendStatus(200);
  } catch (e) {
    // Log the error which the renderer encountered
    // @TODO should the error generator be a callback that can be provided to allow better customisation?
    logger.error({ type: 'COMPONENT_RENDER_ERROR', component: name, message: e.message, props });
    // Return a simple error message to the client
    // @TODO should this contain more information?
    // @TODO should this be within the config?
    res.set('Content-Type', 'text/html');
    res.status(500);
    res.send('Component Error');
  }
};

export default doStrapHandler;
