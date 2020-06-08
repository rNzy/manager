import Postmate from 'postmate';
import messages from './constants';

function isDeveloppement() {
  return ['localhost', '127.0.0.1'].includes(window.location.hostname);
}

function bindOnce() {
  let { handshake } = window;

  if (!window.UFrontEnd) {
    handshake = new Postmate.Model({
      updateHash: (hash) => {
        if (window.location.hash !== hash) {
          window.location.hash = hash;
        }
      },
    });

    const UFrontEnd = {
      debug: isDeveloppement(),
      handshake,
    };
    window.UFrontEnd = UFrontEnd;

    handshake.then((childApi) => {
      let discardHash = false;

      const initialHash = window.location.hash.replace(/^#!?/, '');
      const initialApp = window.location.pathname.replace(/^\//, '');

      if (UFrontEnd.debug) {
        console.log(
          `child: emit hashChange, app:'${initialApp}', hash:'${initialHash}'`,
        );
      }
      childApi.emit(messages.hashChange, {
        app: initialApp,
        hash: initialHash,
      });

      window.addEventListener('hashchange', ({ newURL }) => {
        const url = new URL(newURL);

        if (UFrontEnd.debug) {
          console.log(`child: hashchange, '${newURL}'`);
        }

        if (/^##/.test(url.hash)) {
          discardHash = true;
          // application switching
          if (!isDeveloppement()) {
            url.hash = decodeURIComponent(url.hash.replace(/^#/, ''));
            const [, app] = url.hash.match(/^#\/([^/]+).*/) || [];
            const [, hash] = url.hash.match(/^#\/[^/]+(.*)/) || [];
            if (UFrontEnd.debug) {
              console.log(
                `child: emit appSwitch, app:'${app}', hash:'${hash}'`,
              );
              console.log(`child: set href '/${app}/#${hash}'`);
            }
            childApi.emit(messages.appSwitch, {
              app,
              hash,
            });
            window.location.href = `/${app}/#${hash}`;
          } else if (UFrontEnd.debug) {
            console.log(
              `child: cannot switch app in developpement '${newURL}'`,
            );
          }
        } else {
          if (!discardHash) {
            const app = url.pathname.replace(/^\//, '');
            const hash = url.hash.replace(/^#!?/, '');
            if (UFrontEnd.debug) {
              console.log(
                `child: emit hashChange, app:'${app}', hash:'${hash}'`,
              );
            }
            childApi.emit(messages.hashChange, { app, hash });
          }
          discardHash = false;
        }
      });
    });
  }

  return handshake;
}

const api = {
  init: () => bindOnce(),
  login: (url) =>
    bindOnce().then((childApi) => {
      childApi.emit(messages.login, url);
    }),
  logout: () =>
    bindOnce().then((childApi) => {
      childApi.emit(messages.logout);
    }),
  sessionSwitch: () =>
    bindOnce().then((childApi) => {
      childApi.emit(messages.sessionSwitch);
    }),
};

export { api, messages };
