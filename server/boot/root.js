module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Origin, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    //res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });
  router.get('/', server.loopback.status());
  server.use(router);
};
