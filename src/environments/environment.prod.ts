export const environment = {
  production: true,
  bffApiUrl: 'BFF_API_URL_PLACEHOLDER', // Placeholder for BFF API
  assetApiUrl: 'ASSET_API_URL_PLACEHOLDER', // Placeholder for Asset API
  keycloak: {
    config: {
      url: 'KEYCLOAK_URL_PLACEHOLDER', // Placeholder for Keycloak URL
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
