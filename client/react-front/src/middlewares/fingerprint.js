import Fingerprintjs2 from 'fingerprintjs2';

let fp = null;

Fingerprintjs2.getV18({}, function (result/*, components*/) {
    fp = result;
});

export default store => next => async action => {
	const { CALL_API, ...rest } = action;

	if (!CALL_API) return next({ ...rest });

	while (true) {
		if (fp !== null) break;
		await new Promise(resolve => { setTimeout(resolve, 50); });
	}

	if (CALL_API.headers && 'object' === typeof CALL_API.headers) {
		CALL_API.headers = Object.assign({}, CALL_API.headers, {
			'X-FP': fp,
			'X-Requested-With': 'XMLHttpRequest'
		});
	} else if (!CALL_API.headers) {
		CALL_API.headers = {
			'X-FP': fp,
			'X-Requested-With': 'XMLHttpRequest'
		};
	}

	return next({ CALL_API, ...rest });
}
