import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express, { json, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import CreateExpressRoute from '@typings/CreateExpressRoute';
import CreateExpressMicroUI from '@typings/CreateExpressMicroUI';
import CreateExpressStrap from '@typings/CreateExpressStrap';
import CreateExpressBoot from '@typings/CreateExpressBoot';
import doBootstrapHandler from '@handlers/doBootstrapHandler';
import doNotFoundHandler from '@handlers/doNotFoundHandler';
import doStrapHandler from '@handlers/doStrapHandler';

const createExpressMicroUI: CreateExpressMicroUI = ({ config, profile = 'local', logger = console }) => {
  // Retrieve the environment profiles
  const env = config.environments.profiles[profile] || config.environments.profiles[config.environments.default];
  // Allow for env overrides
  const _cors = env.api?.cors || config.api.cors;
  const _port = env.api?.port || config.api.port;
  const _messages = env.api?.messages || config.api.messages;
  const _prefix = env.api?.prefix || config.api?.prefix || '';
  // Attempt to start the express server
  try {
    // Retrieve any api env
    const apiEnv = env.api?.env || {};
    // Update the process env with any provided api env
    process.env = { ...process.env, ...apiEnv };
    // Saying hello
    logger.info(_messages.START_UP);
    // Create a new express instance
    const api = express();
    // Setting up middlewares
    api.use(json());
    api.use(helmet());
    api.use(cors(_cors));
    api.use(compression());
    // Serve static assets
    api.use(express.static('./.assets'));
    // Hydrate and output the bootstrapper script
    api.get(`${_prefix}/bootstrap.js`, doBootstrapHandler(env, config));
    // Adds a route to a router of sorts
    const route: CreateExpressRoute = (path, method, handler) => {
      // Sanity check to ensure only valid methods are passed
      if (!['get', 'post', 'all'].includes(method.toLowerCase())) {
        throw new Error('METHOD_NOT_SUPPORTED');
      }
      // Wrap the handler in
      // @ts-ignore
      api[method.toLowerCase()](`${prefix}${path}`, (req: Request, res: Response) =>
        handler({
          platform: 'express',
          req,
          res,
          logger,
          env,
          config,
          method,
        }),
      );
    };
    // Straps a component into the SSR api
    const strap: CreateExpressStrap = (name, component) => {
      // Handle a GET request to fetch a component
      api.get(`${_prefix}/${name}`, doStrapHandler(name, component, logger, env, config, 'GET'));
      // Handle a POST request to fetch a component
      api.post(`${_prefix}/${name}`, doStrapHandler(name, component, logger, env, config, 'POST'));
    };
    // Boots up the server
    const boot: CreateExpressBoot = () => {
      // Handle any 404 errors
      api.use(doNotFoundHandler);
      // Start the server listening on the provided port
      api.listen(_port);
      // Log that something happened
      logger.info(_messages.STARTED_UP, _port);
    };
    // Returns the instance of the server, the strapper the booter, the config and the logger
    return { api, strap, boot, route, env, config: config, logger, express };
    // If the application throws an error
    // We catch and log for debugging
  } catch (e) {
    // Log out the thrown error
    logger.error(_messages.CRASHED, e.message);
  }
};

export default createExpressMicroUI;
