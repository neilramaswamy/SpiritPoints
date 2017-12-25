require('promise');
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

function getOauthToken() {
  var dataToReturn = [];
    // Load client secrets from a local file.
    var contents = fs.readFileSync('client_secret.json');
    if (!contents) {
     console.log('Error loading client secret file: ' + err);
     return;
   }
    // Authorize a client with the loaded credentials
    return authorize(JSON.parse(contents));
  }

/**
 * Create an OAuth2 client with the given credentials and return it
 *
 * @param {Object} credentials The authorization client credentials.
 */
 function authorize(credentials) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  var token = fs.readFileSync(TOKEN_PATH, function(err, data) {
    if (err) console.log("There's an error: " + err);
  });
  console.log(TOKEN_PATH);
  if (!token) {
    getNewToken(oauth2Client);
  } else {
    oauth2Client.credentials = JSON.parse(token);
  }
  return oauth2Client;
}

/**
 * Get and store new token after prompting for user authorization
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 */
 function getNewToken(oauth2Client) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
 function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Print the event names and scores :
 * https://docs.google.com/spreadsheets/d/1f94gGqRPVCrBSn7HWW3zogxxi4WxBkk7nbJmj1ZNzfg/edit
 */
 function getSpreadsheetData(auth) {
  console.log("trying to read spreadsheet data");
  var sheets = google.sheets('v4');
  return new Promise(function(resolve, reject) {
   var request = sheets.spreadsheets.values.get({
    auth: auth,

    spreadsheetId: '1f94gGqRPVCrBSn7HWW3zogxxi4WxBkk7nbJmj1ZNzfg',
    range: 'Sheet1!A2:F',
  }, function(err, response) {
    if (err) {
     console.log("getdata error: " + err);
     reject(err);
   } else {
     var rows = response.values;
     if (rows.length == 0) {
       console.log('No data found.');
     } else {
       var data = {};
       for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
				// Get eventName and class scores
				var eventName = row[0];
				// fill data
				data[eventName] = [row[2], row[3], row[4], row[5]];
     }
     resolve(data);
   }
 }
});
 });
}

module.exports = {getSpreadsheetData, getOauthToken};