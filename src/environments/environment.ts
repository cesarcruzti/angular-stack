export const environment = {
    production: false,
    keycloak: {
        config: {
        url: 'http://localhost:8180',
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