const routers = require('./router');

module.exports = function (app) {
	routers.forEach(router => {
		app.use(router.routes());
	});
};
