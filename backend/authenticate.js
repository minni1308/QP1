var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var teacher = require('./models/teachers');

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');

exports.getToken = function(user /* payload */) {  /* Create a token */
    return jwt.sign(user /* payload */ , config.secretKey /* Secret key */,
        {expiresIn: 3600  /* (in sec) how long it will valid */ });
};


var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;


exports.jwtPassport = passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        const user = await teacher.findOne({_id: jwt_payload._id});
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (err) {
        return done(err, false);
    }
}));

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    if (!req.user) {
        const err = new Error('Unauthorized');
        err.status = 401;
        return next(err);
    }
    
    if (req.user.admin) {
        return next();
    }
    
    const err = new Error('You are not authorized to perform this operation');
    err.status = 403;
    return next(err);
};


passport.use(new LocalStrategy(teacher.authenticate()));
passport.serializeUser(teacher.serializeUser());
passport.deserializeUser(teacher.deserializeUser());
