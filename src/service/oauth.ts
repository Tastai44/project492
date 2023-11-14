import axios from 'axios';
import oauth from 'axios-oauth-client';
const getAuthorizationCode = oauth.authorizationCode(
    axios.create(),
    'https://oauth.com/2.0/token', // OAuth 2.0 token endpoint
    'CLIENT_ID',
    'CLIENT_SECRET',
    'https://your-app.com/oauth-redirect' // Redirect URL for your app
);

const auth = await getAuthorizationCode('AUTHORIZATION_CODE', 'OPTIONAL_SCOPES');