import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { MicroUiConfigProfileEnv } from '@sackrin/react-micro-ui/lib/Types/MicroUiConfigProfileEnv';
import { MicroUiConfig } from '@sackrin/react-micro-ui/lib/Types/MicroUiConfig';

type DoBootstrapHandler = (
  env: MicroUiConfigProfileEnv,
  config: MicroUiConfig,
) => (req: Request, res: Response) => Promise<void>;

const doBootstrapHandler: DoBootstrapHandler = (env, { name, assets, api, manifest }) => async (req, res) => {
  // Retrieve the manifest file contents
  let manifestData = fs.readFileSync(manifest.filepath, 'utf8');
  // Determine the correct api and asset values based on
  const apiUrl = env.api?.url || api.url;
  const apiPath = env.api?.path || api.path;
  const assetUrl = env.assets?.url || apiUrl;
  const assetTarget = env.assets?.target || assets.target;
  const assetEnv = env.assets?.env || {};
  const bootstrapHeaders = env?.bootstrap?.headers || {};
  // Replace the bootstrap JS placeholder tokens with permitted environment variables
  // This will be used by bootstrap and communicated within the window space to the built micro UI assets
  let contents = fs.readFileSync(
    path.join(process.cwd(), 'node_modules/@sackrin/react-micro-ui/lib/bootstrap', 'bootstrap.js'),
    'utf8',
  );
  contents = contents.replace(/__MANIFEST__/g, manifestData);
  contents = contents.replace(
    /__ENV__/g,
    JSON.stringify({
      name,
      apiUrl,
      apiPath,
      assetUrl: assetUrl || apiUrl,
      assetTarget,
      assetEntry: manifest.entry || 'main.js',
      ...assetEnv,
    }),
  );
  // WARNING! Try everything we can to make sure the assets are NOT cached
  // This is the worst file to have cached, ensure this file does not cache
  res.set('Content-Type', 'application/javascript');
  res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.set('Expires', '-1');
  res.set('Pragma', 'no-cache');
  // Inject any additional headers
  Object.entries(bootstrapHeaders).forEach(([key, value]) => {
    // Set the additional header
    res.set(key, value as string);
  });
  res.status(200);
  res.send(contents);
};

export default doBootstrapHandler;
