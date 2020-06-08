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

class FrontendURL extends URL {
  constructor(url) {
    super(url || window.location);
  }

  isDeveloppement() {
    return ['localhost', '127.0.0.1'].includes(this.hostname);
  }

  getApp() {
    if (this.isDeveloppement()) {
      return '';
    }
    const [, app] = this.hash.match(/^#!?\/([^/]+)/) || [];
    return app;
  }

  getAppHash() {
    const [, hash] = this.hash.match(/^#!?\/[^/]+(.*)/) || [];
    return hash;
  }

  setApp(newApp) {
    const hash = this.hash || '#';
    if (!this.isDeveloppement()) {
      this.hash = hash.replace(/^(#!?\/[^/]+)(.*)/, `/${newApp}$2`);
    }
  }

  setAppHash(newHash) {
    const hash = this.hash || '#';
    if (this.isDeveloppement()) {
      this.hash = hash.replace(/^(#!?).*/, `$1${newHash}`);
    } else {
      this.hash = hash.replace(/^(#!?\/[^/]+).*/, `$1${newHash}`);
    }
  }

  toIFrameURL() {
    const result = new URL(this);
    if (this.isDeveloppement()) {
      result.port = 9000;
    } else {
      result.pathname = `/${this.getApp()}/`;
    }
    result.hash = this.getAppHash();
    return result;
  }
}

if (!window.UFrontEnd) {
  const handshake = new Postmate({
    container: document.getElementsByClassName('hub-main-view')[0],
    url: new FrontendURL().toIFrameURL(),
    name: 'manager',
    classListArray: ['w-100', 'h-100', 'd-block', 'border-0'],
  });

  const UFrontEnd = {
    debug: new FrontendURL().isDeveloppement(),
    handshake,
  };
  window.UFrontEnd = UFrontEnd;

  handshake.then((child) => {
    window.addEventListener('hashchange', ({ newURL }) => {
      const iframeURL = new FrontendURL(newURL).toIFrameURL();
      const { frame } = child;
      if (UFrontEnd.debug) {
        console.log(`container: hash changed '${newURL}'`);
        console.log(`container: set iframe url '${iframeURL}'`);
      }
      frame.src = iframeURL;
    });

    child.on(messages.hashChange, ({ app, hash }) => {
      const url = new FrontendURL();
      url.setApp(app);
      url.setAppHash(hash);
      if (UFrontEnd.debug) {
        console.log(
          `container: receive hashChange, app:'${app}', hash:'${hash}'`,
        );
        console.log(`container: replace state '${url.href}'`);
      }
      window.history.replaceState(null, null, url.href);
    });

    child.on(messages.appSwitch, ({ app, hash }) => {
      const url = new FrontendURL();
      url.setApp(app);
      url.setAppHash(hash);
      if (UFrontEnd.debug) {
        console.log(
          `container: receive appSwitch, app:'${app}', hash:'${hash}'`,
        );
        console.log(`container: replace state '${url.href}'`);
      }
      window.history.replaceState(null, null, url.href);
    });

    child.on(messages.sessionSwitch, () => {
      if (UFrontEnd.debug) {
        console.log(`container: receive sessionSwitch`);
      }
      return deferredApplication.then((app) =>
        app.get('ssoAuthentication').handleSwitchSession(),
      );
    });

    child.on(messages.login, (loginURL) => {
      if (UFrontEnd.debug) {
        console.log(`container: receive login`);
      }
      return deferredApplication.then((app) =>
        app.get('ssoAuthentication').goToLoginPage(loginURL),
      );
    });

    child.on(messages.logout, () => {
      if (UFrontEnd.debug) {
        console.log(`container: receive login`);
      }
      return deferredApplication.then((app) =>
        app.get('ssoAuthentication').logout(),
      );
    });
  });
}
