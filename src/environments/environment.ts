export const environment = {
    production: false,
    keycloak: {
        config: {
        url: 'http://localhost:8180',
        realm: 'open',
        clientId: 'angular-stack'
        },
        initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false
        }
    }
};