const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['require', 'react-native', 'browser', 'default'];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@electric-sql/pglite') {
    return {
      type: 'sourceFile',
      filePath: path.join(__dirname, 'node_modules', '@electric-sql', 'pglite', 'dist', 'index.cjs')
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      if (req.url && (req.url.endsWith('.wasm') || req.url.endsWith('.data') || req.url.endsWith('.tar.gz'))) {
        const pgliteDist = path.join(__dirname, 'node_modules', '@electric-sql', 'pglite', 'dist');
        const fileName = path.basename(req.url);
        const filePath = path.join(pgliteDist, fileName);
        if (fs.existsSync(filePath)) {
          const stat = fs.statSync(filePath);
          res.setHeader('Content-Length', stat.size);
          res.setHeader('Content-Type', req.url.endsWith('.wasm') ? 'application/wasm' : 'application/octet-stream');
          fs.createReadStream(filePath).pipe(res);
          return;
        }
      }
      return middleware(req, res, next);
    };
  }
};

module.exports = config;
