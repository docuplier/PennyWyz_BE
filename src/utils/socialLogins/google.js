import axios from 'axios';
import qs from 'querystring';

const credentials = {
  web: {
    client_id: '811337646670-fvidlk88r49t5cep4adoa5ued55g5fes.apps.googleusercontent.com',
    project_id: 'pennywyz',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_secret: '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',
  },
};
// https://accounts.google.com/o/oauth2/v2/auth

export const getLoginUrl = () => {
  const url = new URL(credentials.web.auth_uri);
  url.searchParams.append('scope', 'email profile');
  url.searchParams.append('access_type', 'offline');
  url.searchParams.append('response_type', 'code');
  url.searchParams.append(
    'redirect_uri',
    'https://pennywyz.com/api/v1/users/social/google/webhook',
  );
  url.searchParams.append('client_id', credentials.web.client_id);

  return url.toString();
};

export const getGoogleOauthToken = async ({ code }) => {
  const rootURl = 'https://oauth2.googleapis.com/token';

  const options = {
    code,
    client_id: credentials.web.client_id,
    client_secret: credentials.web.client_secret,
    access_type: 'offline',
    redirect_uri: 'https://pennywyz.com/api/v1/users/social/google/webhook',
    grant_type: 'authorization_code',
  };
  try {
    const { data } = await axios.post(rootURl, qs.stringify(options), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return data;
  } catch (err) {
    console.log('Failed to fetch Google Oauth Tokens');
    throw new Error(err);
  }
};

export const getGoogleUser = async ({ idToken, accessToken }) => {
  try {
    const { data } = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );

    return data;
  } catch (err) {
    console.log('Failed to fetch Google User details');
    throw Error(err);
  }
};
