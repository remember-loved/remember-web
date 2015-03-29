var env = 'development';
var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || '3000';
var ipAddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var dbname = env;
var dbpath = process.env.OPENSHIFT_MONGODB_DB_URL ||'mongodb://admin:@localhost:27017/' + dbname;
var secretSessionKey = 'keyboard cat';
module.exports = {
  'env': env,
  'PORT': port,
  'ipAddr': ipAddr,
  'dbpath': dbpath,
  'secretSessionKey': secretSessionKey
};
