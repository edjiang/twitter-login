# Twitter Login Demo with Stormpath

This is a Twitter login demo with Stormpath using the express-stormpath integration. Some SDK work needs to be done to make this fully work, so you'll see some hacks here and there.

To get this running:

1. Set up a Twitter application at [Twitter Dev](https://dev.twitter.com)
2. Set up a Stormpath application with the Twitter directory configured at [Stormpath Admin Console](https://api.stormpath.com)
3. Clone this repo
4. Open up this repo, and run `npm install`, assuming you have Node.js installed on your system. 
5. Set the following environment variables:

```
export STORMPATH_APPLICATION_HREF=
export STORMPATH_CLIENT_APIKEY_ID=
export STORMPATH_CLIENT_APIKEY_SECRET=
export TWITTER_CLIENT_ID=
export TWITTER_CLIENT_SECRET=
```

6. Run the application with `node server.js`
7. Go to [http://localhost:3000](http://localhost:3000). Enjoy!