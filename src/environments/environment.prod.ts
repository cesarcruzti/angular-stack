export const environment = {
  production: true,
  keycloak: {
    config: {
      url: 'https://keycloak.localdev.me/auth',
      realm: 'open',
      clientId: 'angular-app'
    },
    initOptions: {
      onLoad: 'check-sso',
      checkLoginIframe: false
    },
    role: 'user-angular-app'
  }
};
