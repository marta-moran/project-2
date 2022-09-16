const { MulterError } = require('multer');

module.exports = (app) => {
  app.use((req, res, next) => {
    // this middleware runs whenever requested page is not available
    res.status(404).render("not-found");
  });

  app.use((err, req, res, next) => {
    // whenever you call next(err), this middleware will handle the error
    // always logs the error

    console.error("ERROR", req.method, req.path, err);
    console.log(req.params)
    const error = encodeURIComponent('Formato de image erroneo')
    if (err.message.includes('Image file format')) {
      res.redirect(req.path + `?error=${error}`)
    }
    // only render if the error ocurred before sending the response
    if (!res.headersSent) {
      res.status(500).render("error");
    }
  });
};
