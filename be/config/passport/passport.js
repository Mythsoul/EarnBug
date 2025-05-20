import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { CreateUser, FindUserByEmail, Login } from '../../models/authmodel.js';
import { Database } from '../db/db.js';

export const setupPassport = () => {
  passport.serializeUser((user, done) => {
    if (!user?.id) return done(new Error('No user ID found'));
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const result = await Database.query(
        "SELECT id, username, email FROM users WHERE id = $1",
        [id]
      );
      
      if (!result.rows[0]) {
        return done(new Error('User not found'));
      }
      
      done(null, result.rows[0]);
    } catch (error) {
      done(error);
    }
  });

  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/auth/github/callback",
    scope: ['user', 'user:email']  // Add email scope
  },
  async (accessToken, refreshToken, profile, done) => {
    try {

      
      // Try to get email from profile, fallback to generated email
      const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
      const username = profile.displayName || profile.username;

      let user = await FindUserByEmail(email);
      
      if (!user) {
        user = await CreateUser(
          username,
          email,
          profile.id
        );
      } else {
        user = await Login(email, profile.id);
        if (!user) {
          return done(null, false, { message: 'Login failed' });
        }
      }

      return done(null, user);
    } catch (error) {
      console.error('GitHub Auth Error:', error);
      return done(error);
    }
  }));

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await FindUserByEmail(email);
      
      if (!user) {
        // Create new user if doesn't exist
        user = await CreateUser(
          profile.displayName,
          email,
          profile.id // Using profile.id as password for OAuth users
        );
      } else {
        // User exists, try to login
        user = await Login(email, profile.id);
        if (!user) {
          return done(new Error('Login failed'));
        }
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
};
