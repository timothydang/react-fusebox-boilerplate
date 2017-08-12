import {
  Sparky, FuseBox, UglifyJSPlugin, CopyPlugin, QuantumPlugin, WebIndexPlugin,
  CSSPlugin, SassPlugin, EnvPlugin, RawPlugin,
} from 'fuse-box';

import * as express from 'express';
import * as path from 'path';
import { FuseBoxOptions } from 'fuse-box/dist/typings/core/FuseBox';

let production = false;
let options: any;

Sparky.task('options', () => {
  options = {
    homeDir: 'src/client',
    output: 'dist/$name.js',
    hash: production,
    target: 'browser',
    sourceMaps: true,
    experimentalFeatures: true,
    cache: !production,
    plugins: [
      EnvPlugin({ NODE_ENV: production ? 'production' : 'development' }),
      [
        SassPlugin({
          importer: true,
        }),
        CSSPlugin({
          outFile: (file) => `./dist/${file}`,
          inject: (file) => `/styles/${file}`,
        }),
      ],
      WebIndexPlugin({
        title: 'App Demo',
        template: 'src/client/index.html',
        path: '/',
      }),
      production && QuantumPlugin({
        treeshake: true,
        uglify: true,
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
      devAppServer.use('/', express.static(dist));
      devAppServer.get('/styleguide', (req: any, res: any) => {
        res.sendFile(path.join(dist, 'styleguide.html'));
      });
    });
  }

  // extract dependencies automatically
  const vendor = fuse.bundle('js/vendor')
    .instructions(`~ **/**.{ts,tsx} +tslib`);

  if (!production) { vendor.hmr(); }

  const app = fuse.bundle('js/app')
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
Sparky.task('default', ['clean', 'options', 'build', 'copy-html', 'copy-assets'], () => {
  //
});

// wipe it all
Sparky.task('clean', () => Sparky.src('dist/*').clean('dist/'));

Sparky.task('copy-assets', () => {
  return Sparky.src('./assets/**', { base: './src' }).dest(`dist/`);
});

Sparky.task('copy-html', () => Sparky.src('*.html', { base: './src/client/views' }).dest(`dist/`));

Sparky.task('set-production-env', () => production = true);

Sparky.task('dist', ['clean', 'set-production-env', 'build', 'copy-html', 'copy-assets'], () => {
  //
});
