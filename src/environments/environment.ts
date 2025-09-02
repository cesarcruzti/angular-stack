export const environment = {
    production: false,
    keycloak: {
        config: {
        url: 'http://localhost:8180',
        realm: 'angular-app',
        clientId: 'web-app'
        },
        initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false
        },
        role: 'user-web-app'
    },
};