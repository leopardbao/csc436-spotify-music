/**
 *
 * For this example to work, we need a Spotify API key.
 * Unfortunately, this cannot be done in the browser due to CORS restrictions.
 * Normally you would have this be done on a server, but it's easy enough to run it as a script
 *
 * Thanks to @acco for helping me with this.
 *
 **/
var fetch = require('isomorphic-fetch');
var btoa = require('btoa');
var path = require('path');
var fs = require('fs');

// Credentials for Spotify
const SPOTIFY_BASE_URI = 'https://api.spotify.com/v1';
const SPOTIFY_CLIENT_ID =
  'ff3dcf32885743a79191b115d6e4e752';
const SPOTIFY_CLIENT_SECRET =
  '422bbd0acc4145b39b62b9836028277c';
const BASE_64_ENCODED_CLIENT_CREDENTIALS = btoa(
  `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
);

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(
      `HTTP Error ${response.statusText}`
    );
    error.status = response.statusText;
    error.response = response;
    console.log('Error communicating with Spotify:');
    console.log(error);
    throw error;
  }
}

function parseJson(response) {
  return response.json();
}

const SpotifyClient = {
  getApiToken() {
    return fetch('https://accounts.spotify.com/api/token', {
      method: 'post',
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${BASE_64_ENCODED_CLIENT_CREDENTIALS}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(checkStatus)
      .then(parseJson)
      .then(json => json.access_token)
      .then(token => (this.token = token));
  }
};

console.log('Fetching New Spotify API token...');
SpotifyClient.getApiToken().then(function(token) {
  let text = `export const apiKey = '${token}';\n`;
  let outputFile = 'src/environments/key.ts';
  fs.writeFile(outputFile, text, function(err) {
    if (err) {
      return console.log(err);
    }

    console.log(`saved to ${outputFile}`);
  });
});
