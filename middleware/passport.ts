import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  getUserByEmailIdAndPassword,
  getUserById,
} from "../controller/userController";

// ⭐ Passport Types
const localLogin = new LocalStrategy(
  {
    usernameField: "uname",
    passwordField: "password",
  },
  async (uname: string, password: string, done: any) => {
    // Check if user exists in databse
    const user = await getUserByEmailIdAndPassword(uname, password);
     console.log('passport 13: '+ user.uname);
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again.",
        });
  }
);

// ⭐ Passport Types - completed
passport.serializeUser(function (user: Express.User, done: (err: any, serializedUser?: number | NonNullable<unknown>) => any) {
  console.log("serialize: " + user.id);
  done(null, user.id);
});

// ⭐  Passport Types - completed
passport.deserializeUser(async function (id: number, done: (err: any, user?: Express.User | false | null | undefined) => any,) {
const user = await getUserById(id.toString());
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

export default passport.use(localLogin);
