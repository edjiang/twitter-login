const express = require('express')
const cookieParser = require('cookie-parser')

const stormpathSDK = require('stormpath')
const stormpath = require('express-stormpath')

// External libraries for OAuth / HTTP requests
const OAuth = require('oauth').OAuth
const request = require('request')

// Configure the Twitter OAuth client
const twitter = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    process.env.TWITTER_CLIENT_ID,
    process.env.TWITTER_CLIENT_SECRET,
    '1.0',
    'http://localhost:3000/twitter-consumer',
    'HMAC-SHA1'
);

const app = express()

app.use(cookieParser())
app.use(stormpath.init(app, {}))

app.get('/', stormpath.getUser, function(req, res) {
  if(req.user == undefined) {
    res.send("<a href='/twitter-login'>Login with Twitter</a>")
  } else {
    res.send("You are logged in.<br/><a href=\"javascript:;\" onclick=\"var f=document.createElement('form');f.method='POST';f.action='/logout';f.submit();\">Logout</a>")
  }
})

app.get('/twitter-login', function(req, res) {
  twitter.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results) {
    if(error) {
      return res.send('Could not get request token. Did you set the TWITTER_CLIENT_ID and TWITTER_CLIENT_SECRET environment variables?')
    }
    res.cookie('oauthTokenSecret', oauthTokenSecret)
    res.redirect('https://api.twitter.com/oauth/authorize?oauth_token=' + oauthToken)
  })
})

app.get('/twitter-consumer', function(req, res) {
  twitter.getOAuthAccessToken(req.query.oauth_token, req.cookies.oauthTokenSecret, req.query.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
    if(error) {
      return res.send('Error.')
    }
    const stormpathApplication = req.app.get('stormpathApplication')

    // Construct manual request to /oauth/token
    const stormpathSocialRequest = {
      url: stormpathApplication.href + '/oauth/token',
      auth: {
        user: process.env.STORMPATH_CLIENT_APIKEY_ID,
        pass: process.env.STORMPATH_CLIENT_APIKEY_SECRET
      },
      form: {
        grant_type: 'stormpath_social',
        providerId: 'twitter',
        accessToken: accessToken,
        accessTokenSecret: accessTokenSecret
      }
    }

    request.post(stormpathSocialRequest, function(err, httpResponse, body) {
      if(err) {
        return res.send(httpResponse)
      }
      const oauthResult = JSON.parse(body)

      // Set the cookies since that's what the framework integration is expecting. 
      res.cookie('access_token', oauthResult.access_token)
      res.cookie('refresh_token', oauthResult.refresh_token)
      res.redirect('/')
    })
  })
})

app.listen(3000)