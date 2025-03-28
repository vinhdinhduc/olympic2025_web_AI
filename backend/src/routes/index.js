function setRoutes(app) {
    const IndexController = require('../controllers/index');
    const indexController = new IndexController();

    app.get('/', indexController.renderIndexPage);
}

module.exports = setRoutes;