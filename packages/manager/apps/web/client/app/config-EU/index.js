import { initialize } from 'ovh-sentry-browser';

(function(window) {
  initialize('https://6d272b8094014d9d92b67e87b5d89f95@sentry.ovhcloud.com/5', {
    release: 'staging',
    environment: 'staging',
  });
})(window);
