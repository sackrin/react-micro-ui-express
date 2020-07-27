const path = require('path');

const port = 8080;

module.exports = {
  name: 'exampleProfileMicroFrontend',
  assets: {
    target: 'umd',
    url: `http://localhost:${port}`,
  },
  manifest: {
    filepath: path.join(process.cwd(), '.assets', 'manifest.json'),
    entry: 'main.js',
  },
  api: {
    url: `http://localhost:${port}`,
    port: port,
    trustProxy: 'trust proxy',
    cors: { origin: '*' },
    messages: {
      START_UP: 'API Layer starting',
      STARTED_UP: 'API started and listening on port',
      CRASHED: 'API crashed with message',
    },
  },
  environments: {
    default: 'local',
    profiles: {
      local: {
        assets: {
          url: `http://localhost:${port}`,
          env: {},
        },
        api: {
          url: `http://localhost:${port}`,
          path: '/api',
          port: port,
          env: {},
        },
      }
    },
  },
};
