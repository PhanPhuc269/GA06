const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../app/models/User');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },async (email, password, done) => {
    console.log('LocalStrategy');
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Incorrect email.');
            return done(null, false, { message: 'Incorrect email.' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Incorrect password.');
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;