import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import Postmate from 'postmate';
import {
  attach as attachPreloader,
  detach as detachPreloader,
} from '@ovh-ux/manager-preloader';
import { bootstrapApplication } from '@ovh-ux/manager-core';
import { messages } from '@ovh-ux/ovh-uapp';

attachPreloader();

/**
 * Async load the application
 */
const deferredApplication = new Promise((resolve) => {
  bootstrapApplication().then(({ region }) => {
    import(`./config-${region}`)
      .catch(() => {})
      .then(() => import('./app.module'))
      .then(({ default: application }) => {
        resolve(
          angular.bootstrap(document.body, [application], {
            strictDi: true,
          }),
        );
        detachPreloader();
      });
  });
});

const appRootRegExp = /^#!?(\/[^/]+)/; // #/foo/bar/baz => /foo
const appHashRegExp = /^#!?\/[^/]+(.*)/; // #/foo/bar/baz => /bar/baz

function buildIframeURL(root, hash) {
  const { location } = window;
  const iframeURL = new URL(location);
  iframeURL.hash = `${hash}`;
  if (location.hostname === 'localhost') {
    // in developement, app are hosted locally on different port
    iframeURL.port = 9000;
  } else {
    // in production, apps are hosted on separate paths
    iframeURL.pathname = `${root}/`;
  }
  return iframeURL;
}

function switchApp() {
  const { location } = window;
  // const iframeURL = new URL(location);
  const [, appRoot] = location.hash.match(appRootRegExp) || [null, ''];
  const [, appHash] = location.hash.match(appHashRegExp) || [null, ''];

  // iframeURL.hash = `${appHash}`;

  // if (location.hostname === 'localhost') {
  //   // in developement, app are hosted locally on different port
  //   iframeURL.port = 9000;
  // } else {
  //   // in production, apps are hosted on separate paths
  //   iframeURL.pathname = `${appRoot}/`;
  // }

  const handshake = new Postmate({
    container: document.getElementsByClassName('hub-main-view')[0],
    url: buildIframeURL(appRoot, appHash),
    name: 'manager',
    classListArray: ['w-100', 'h-100', 'd-block', 'border-0'],
  });

  handshake.then((child) => {
    const onContainerHashChange = ({ oldURL, newURL }) => {
      const from = new URL(oldURL);
      const to = new URL(newURL);
      const [, fromRoot] = from.hash.match(appRootRegExp) || [null, ''];
      const [, toRoot] = to.hash.match(appRootRegExp) || [null, ''];
      const [, toHash] = to.hash.match(appHashRegExp) || [null, ''];
      if (fromRoot !== toRoot) {
        // app switching, unregister hooks and perform new handshake
        // window.removeEventListener('hashchange', onContainerHashChange);
        //  const newIframeURL = new URL(window.location);
        //  [, newIframeURL.hash] = newIframeURL.hash.match(appHashRegExp) || [
        //    null,
        //    '',
        //  ];
        //  if (newIframeURL.hostname === 'localhost') {
        //    newIframeURL.port = 9000;
        //  } else {
        //    newIframeURL.pathname = `${toRoot}/`;
        //  }
        //  console.log(newIframeURL);
        const { frame } = child;
        const foo = buildIframeURL(toRoot, toHash);
        frame.src = foo;
        window.history.replaceState(null, null, `#${toRoot}${toHash}`);
        console.log('replace state', `#${toRoot}${toHash}`);
        //  child.destroy();
        //  switchApp();
      } else {
        // forward path changes to the child
        const [, hash] = to.hash.match(appHashRegExp) || [null, ''];
        child.call('updateHash', `#${hash}`);
      }
    };

    window.addEventListener('hashchange', onContainerHashChange);

    child.on(messages.hashChange, ({ hash, url }) => {
      const [, root] = location.hash.match(appRootRegExp) || [null, ''];
      const [, childRoot] = new URL(url).hash.match(appRootRegExp) || [
        null,
        '',
      ];
      // extract path from hash (remove hash prefix)
      const h = hash.replace(/^#!?/, '');
      // prepend root to path and update container url
      if (root === childRoot) {
        console.log('update hash from child', root, h);
        window.history.replaceState(null, null, `#${root}${h}`);
      }
    });

    child.on(messages.switchApp, ({ hash, url }) => {
      const oldURL = new URL(window.location);
      // window.history.pushState(null, null, `#${hash}`);
      const newURL = new URL(window.location);
      newURL.hash = `#${hash}`;
      console.log('u', url);
      console.log('receive switch app', oldURL.href, newURL.href);
      onContainerHashChange({ oldURL, newURL });
    });

    child.on(messages.sessionSwitch, () =>
      deferredApplication.then((app) =>
        app.get('ssoAuthentication').handleSwitchSession(),
      ),
    );

    child.on(messages.login, (loginURL) =>
      deferredApplication.then((app) =>
        app.get('ssoAuthentication').goToLoginPage(loginURL),
      ),
    );

    child.on(messages.logout, () =>
      deferredApplication.then((app) => app.get('ssoAuthentication').logout()),
    );
  });
}

switchApp();
