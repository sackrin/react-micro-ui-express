const path = require("path");

const port = 8330;

module.exports = {
  name: "exampleProfileMicroFrontend",
  assets: {
    target: "umd",
    url: "http://localhost:9000",
  },
  manifest: {
    filepath: path.join(process.cwd(), ".assets", "manifest.json"),
    entry: "main.js",
  },
  storybook: {
    port: 6006,
  },
  api: {
    url: "http://localhost:9000",
    mode: 'rest',
    port: port,
    trustProxy: "trust proxy",
    cors: { origin: "*" },
    messages: {
      START_UP: "API Layer starting",
      STARTED_UP: "API started and listening on port",
      CRASHED: "API crashed with message",
    },
  },
  environments: {
    default: "local",
    profiles: {
      local: {
        assets: {
          url: "http://localhost:9000",
          env: {},
        },
        api: {
          url: "http://localhost:9000",
          path: "/api",
          port: 8080,
          env: {},
        },
      },
      dev: {
        assets: {
          url: process.env.ASSET_URL || "https://d3kei5wbzchda7.cloudfront.net",
          env: {},
        },
        api: {
          url:
            process.env.API_URL ||
            "https://0xj59736z4.execute-api.us-east-1.amazonaws.com",
          port: process.env.API_PORT || 9000,
          env: {},
        },
      },
    },
  },
};
