import express from "express"
import cors from "cors"

import passport from "passport"
import {Strategy as GoogleStrategy } from "passport-google-oauth20"
import {Strategy as FacebookStrategy } from "passport-facebook"
import expressSession from "express-session"


const app = express()


const GOOGLE_CLIENT_ID = '1076871080243-3kcvgsb4mbc0kuqm5klnn51m6bsct0sa.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'

const FACEBOOK_CLIENT_ID = '1062647778350596'
const FACEBOOK_CLIENT_SECRET = 'f04c8f14c0c368d20e4ed836a6d7321b'


passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/google",
}, (accessToken, refreshToken, profile,cb)=>{
    cb(null,profile)
}))

// passport.use(new FacebookStrategy({
//     clientID: FACEBOOK_CLIENT_ID,
//     clientSecret: FACEBOOK_CLIENT_SECRET,
//     callbackURL: "/facebook",
//     profileFields:['email','displayName','name','picture']
// }, (accessToken, refreshToken, profile,cb)=>{
//     cb(null,profile)
// }))

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL: "/facebook",
    profileFields: ['email', 'displayName', 'name', 'picture']
}, (accessToken, refreshToken, profile, cb) => {
    if (profile) {
        return cb(null, profile);
    } else {
        return cb(new Error("Facebook authentication failed"));
    }
}));



passport.serializeUser((user, cb)=>{
    cb(null, user)
})

passport.deserializeUser((user, cb)=>{
    cb(null, user)
})

app.use(expressSession({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
  }));

app.use(passport.initialize())
app.use(passport.session())

// Configuring Common Middleware

app.use(cors({
    origin:process.env.CORS_ORIGIN, // allowed URLs
    // methods: process.env.CORS_METHODS, // allowed methods
    credentials:process.env.CORS_CREDENTIALS, // Set to true to pass the header, otherwise it is omitted.
    // preflightContinue: false,       // Pass the CORS preflight response to the next handler.

}))


app.use(express.json({limit:process.env.API_JSON_DATA_LIMIT}))
app.use(express.urlencoded({extended:true, limit:process.env.API_JSON_DATA_LIMIT}))
app.use(express.static("public"))

// Import routes
import userRouter from "./routes/user.routes.js"

const prefix = "/api/v1"


app.get(`/login/google` , passport.authenticate('google', {scope:['profile email']}))
app.get(`/login/facebook` , passport.authenticate('facebook', {scope:['email']}))

app.get('/google', passport.authenticate('google'), (req,res)=>{
    res.redirect('/')
})

app.get('/facebook', passport.authenticate('facebook'), (req,res)=>{
    res.redirect('/')
})

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});



app.get('/', (req, res)=>{
    res.send(req.user? req.user : "Not Logged In, login with google or facebook")
})

// Declare routes
app.use(`${prefix}/users`,  userRouter)


export default app