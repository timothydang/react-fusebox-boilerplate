import {
  Sparky, FuseBox, UglifyJSPlugin, QuantumPlugin, WebIndexPlugin, CSSPlugin, EnvPlugin,
} from 'fuse-box';

import * as express from 'express';
import * as path from 'path';
import { FuseBoxOptions } from 'fuse-box/dist/typings/core/FuseBox';

let production = false;
let options: FuseBoxOptions;

Sparky.task('options', () => {
  options = {
    homeDir: 'src',
    output: 'dist/static/$name.js',
    hash: production,
    target: 'browser',
    sourceMaps: true,
    experimentalFeatures: true,
    cache: !production,
    plugins: [
      EnvPlugin({ NODE_ENV: production ? 'production' : 'development' }),
      CSSPlugin(),
      WebIndexPlugin({
        title: 'React Fusebox Boilerplate',
        template: 'src/index.html',
        path: '/static/',
      }),
    ],
  };
});

Sparky.task('build', () => {
  const fuse = FuseBox.init(options);

  if (!production) {
    // Configure development server
    fuse.dev({ root: false }, (server: any) => {
      const dist = path.join(__dirname, 'dist');
      const devAppServer = server.httpServer.app;
      devAppServer.use('/static/', express.static(path.join(dist, 'static')));
      devAppServer.get('*', (req: any, res: any) => {
        res.sendFile(path.join(dist, 'static/index.html'));
      });
    });
  }

  // extract dependencies automatically
  const vendor = fuse.bundle('vendor')
    .instructions(`~ **/**.{ts,tsx} +tslib`);

  if (!production) { vendor.hmr(); }

  const app = fuse.bundle('app')
    // Code splitting ****************************************************************
    .splitConfig({ browser: '/static/', dest: 'bundles/' })
    .split('routes/about/**', 'about > routes/about/AboutComponent.tsx')
    .split('routes/contact/**', 'contact > routes/contact/ContactComponent.tsx')
    .split('routes/home/**', 'home > routes/home/HomeComponent.tsx')
    // bundle the entry point without deps
    // bundle routes for lazy loading as there is not require statement in or entry point
    .instructions(`> [app.tsx] + [routes/**/**.{ts, tsx}]`);

  if (!production) {
    app.hmr().watch();
  }

  return fuse.run();
});

// main task
Sparky.task('default', ['clean', 'options', 'build'], () => {
  //
});

// wipe it all
Sparky.task('clean', () => Sparky.src('dist/*').clean('dist/'));

Sparky.task('set-production-env', () => production = true);
Sparky.task('dist', ['clean', 'set-production-env', 'build'], () => {
  //
});
