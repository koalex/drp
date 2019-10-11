'use strict';

const Router                = require('../../lib/router');
const ApiV1                 = new Router({ prefix: '/api/v1' });
const publicRouter          = new Router();
const symptomsAndSolutions  = require('./controllers/symptomsAndSolutions');
const bodyParser            = require('../../middlewares/bodyParser');

const bodyParserOpts = { formLimit: '100kb', jsonLimit: '100kb', textLimit: '100kb' };

publicRouter
	.get('/find-solution', ctx => {ctx.redirect('/');})
	.get('/create-solution', ctx => {ctx.redirect('/');})
	.get('/edit-solutions', ctx => {ctx.redirect('/');});

ApiV1.get('/solutions', async ctx => {
	const symptom = ctx.query.symptom ? ctx.query.symptom.toLowerCase().trim() : null;
	if (!symptom) return ctx.throw(400);
	ctx.body = await symptomsAndSolutions.findSolutions(symptom, ctx.query.algorithm);
});

ApiV1.get('/symptoms-solutions', async ctx => {
	ctx.set({
		'Cache-Control': 'no-cache, no-store, must-revalidate',
		Pragma: 'no-cache',
		Expires: 0
	});
	ctx.body = await symptomsAndSolutions.getAll();
});

ApiV1.get('/symptoms-solutions/:idOrCategory', async ctx => {
	ctx.body = await symptomsAndSolutions.getOneByIdOrCategory(ctx.params.idOrCategory);
});

ApiV1.post('/symptoms-solutions', bodyParser(bodyParserOpts), async ctx => {
	ctx.body = await symptomsAndSolutions.createOne(ctx.request.body, ctx.ip);
});

ApiV1.put('/symptoms-solutions/:id', bodyParser(bodyParserOpts), async ctx => {
	ctx.body = await symptomsAndSolutions.updateOneById(ctx.params.id, ctx.request.body, ctx.ip);
});

module.exports = [ApiV1, publicRouter];
