import React from 'react'
import passport from "passport"
import passportfb from "passport-facebook"
import passport from 'passport';
import { express } from 'express';


function PassportController() {


    const app = express()
    const passport = passport();
    const passportfb = passportfb();

    app.use(session({
        resave: false,
        saveUninitialized: true,
        secret: 'SECRET'
      }));

    app.use(passport.initialize())
    app.use(passport.session())


    passport.serializeUser((user,cb)=>{
        cb(null,user)
    })

    passport.deserializeUser((obj,cb)=>{
        cb(null, obj)
    })

    passport.use(new FacebookStrategy({
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_APP_SECRET,
        callbackURL: process.env.FB_CALLBACK_URL        
    },function (accessToken, refreshToken, profile, done){
        return done(null, profile)
    }))
    
}

export default PassportController
