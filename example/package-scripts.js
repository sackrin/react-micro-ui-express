const { series, rimraf, mkdirp, concurrent } = require('nps-utils');

module.exports = {
  scripts: {
    default: 'nps local',
    local: {
      description: 'Scripts to run the micro frontend locally for development and demonstration',
      default: concurrent({ assets: 'npx nps local.assets', server: 'npx nps local.server' }),
      assets: series(mkdirp('.assets'), "npx webpack --watch --config ./webpack.config.js"),
      server: {
        default: 'npx nps local.server.watch',
        watch: 'nodemon --watch src --exec npx nps local.server.build',
        build: "babel-node --extensions '.jsx,.js' --config-file ./babel.server.config.json src/server.js"
      }
    },
    build: {
      description: 'Builds Micro UI for deployment',
      default: series('npx nps clean', 'npx nps build.routes', 'npx nps build.assets'),
      routes: `npx babel src --extensions '.ts,.tsx,.js' --config-file ./babel.server.config.json --out-dir ./.server`,
      assets: series(mkdirp('.assets'), `npx webpack --config ./webpack.config.js`),
    },
    clean: {
      description: 'Deletes the various generated folders',
      script: series(rimraf('./.server'), rimraf('./.assets')),
    },
  },
};
