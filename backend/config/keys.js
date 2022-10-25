module.exports = {
  mongoURI: process.env.MONGO_URI,
  isProduction: process.env.NODE_ENV,
  secretOrKey: process.env.SECRET_OR_KEY,
};
