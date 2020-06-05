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

function switchApp() {
  const { location } = window;
  const iframeURL = new URL(location);
  const [, appRoot] = location.hash.match(appRootRegExp) || [null, ''];
  const [, appHash] = location.hash.match(appHashRegExp) || [null, ''];

  iframeURL.hash = `${appHash}`;

  if (location.hostname === 'localhost') {
    // in developement, app are hosted locally on different port
    iframeURL.port = 9000;
  } else {
    // in production, apps are hosted on separate paths
    iframeURL.pathname = `${appRoot}/`;
  }

  const handshake = new Postmate({
    container: document.getElementsByClassName('hub-main-view')[0],
    url: iframeURL,
    name: 'manager',
    classListArray: ['w-100', 'h-100', 'd-block', 'border-0'],
  });

  handshake.then((child) => {
    const onContainerHashChange = ({ oldURL, newURL }) => {
      console.log(oldURL, newURL);
      const from = new URL(oldURL);
      const to = new URL(newURL);
      const [, fromRoot] = from.hash.match(appRootRegExp) || [null, ''];
      const [, toRoot] = to.hash.match(appRootRegExp) || [null, ''];
      if (fromRoot !== toRoot) {
        // app switching, unregister hooks and perform new handshake
        // window.removeEventListener('hashchange', onContainerHashChange);
        const newIframeURL = new URL(window.location);
        [, newIframeURL.hash] = newIframeURL.hash.match(appHashRegExp) || [
          null,
          '',
        ];
        if (newIframeURL.hostname === 'localhost') {
          newIframeURL.port = 9000;
        } else {
          newIframeURL.pathname = `${toRoot}/`;
        }
        console.log(newIframeURL);
        child.frame.src = newIframeURL.href;
        //  child.destroy();
        //  switchApp();
      } else {
        // forward path changes to the child
        const [, hash] = to.hash.match(appHashRegExp) || [null, ''];
        child.call('updateHash', `#${hash}`);
      }
    };

    window.addEventListener('hashchange', onContainerHashChange);

    child.on(messages.hashChange, (childHash) => {
      // extract path from hash (remove hash prefix)
      const hash = childHash.replace(/^#!?/, '');
      // prepend root to path and update container url
      window.history.replaceState(null, null, `#${appRoot}${hash}`);
    });

    child.on(messages.switchApp, (hash) => {
      const oldURL = window.location.href;
      window.history.pushState(null, null, `#${hash}`);
      onContainerHashChange({
        oldURL,
        newURL: window.location.href,
      });
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
