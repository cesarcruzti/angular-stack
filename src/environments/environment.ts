export const environment = {
    production: false,
    keycloak: {
        config: {
        url: 'http://localhost:8180',
        realm: 'angular-stack',
        clientId: 'web-app'
        },
        initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false
        },
        role: 'user-web-app'
    },
};