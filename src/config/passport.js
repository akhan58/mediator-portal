const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Google OAuth 2.0 Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:5000/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            // Handle the authenticated user profile
            console.log('Google Profile:', profile);
            done(null, profile);
        }
    )
);

// Facebook OAuth Strategy
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: 'http://localhost:5000/auth/facebook/callback',
            profileFields: ['id', 'emails', 'name'], // Request specific fields from Facebook
        },
        (accessToken, refreshToken, profile, done) => {
            // Handle the authenticated user profile
            console.log('Facebook Profile:', profile);
            done(null, profile);
        }
    )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;



/*
OLD CODE

const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const YelpStrategy = require('passport-yelp').Strategy;
const dotenv = require('dotenv');

/*Make sure to replace the placeholders like process.env.GOOGLE_CLIENT_ID,
process.env.FACEBOOK_CLIENT_ID, etc., with the actual values to get from
registering to application with Google, Facebook, and Yelp.


dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    // Handle the authenticated user profile
    console.log(profile);
    done(null, profile);
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/facebook/callback',
}, (accessToken, refreshToken, profile, done) => {
    // Handle the authenticated user profile
    console.log(profile);
    done(null, profile);
}));

/*passport.use(new YelpStrategy({
    consumerKey: process.env.YELP_CONSUMER_KEY,
    consumerSecret: process.env.YELP_CONSUMER_SECRET,
    token: process.env.YELP_TOKEN,
    tokenSecret: process.env.YELP_TOKEN_SECRET,
    callbackURL: 'http://localhost:5000/auth/yelp/callback',
}, (accessToken, refreshToken, profile, done) => {
    // Handle the authenticated user profile
    console.log(profile);
    done(null, profile);
}));*/