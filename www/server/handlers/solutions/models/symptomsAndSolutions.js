'use strict';

const validate = require('mongoose-validator');
const mongoose = require('../../../lib/mongoose');

const isLengthValidator = (min, max, message = 'httpErrors.500') => [
	validate({
		validator: function (v) {
			return v.length <= max && v.length >= min;
		},
		message: message
	})
];

const dateRangeValidator = (min, max, message = 'httpErrors.500') => [
	validate({
		validator: function (v) {
			let val = v, _min = min, _max = max;
			if (v.getTime) val = v.getTime();
			if ('function' === typeof min) _min = min();
			if ('function' === typeof max) _max = max();

			return val <= _max && val >= _min;
		},
		message: message
	})
];

const symptomAndSolutionsSchema = new mongoose.Schema({
	symptom: {
		type: String,
		trim: true,
		lowercase: true,
		required: [true, 'solution.SYMPTOM_REQUIRED'],
		validate: isLengthValidator(2, 500),
	},
	solutions: [{
		type: String,
		trim: true,
		lowercase: true,
		required: [true, 'solution.SOLUTION_REQUIRED'],
		validate: isLengthValidator(2, 3000),
	}],
	/*keywords: [{
		type: String,
		lowercase: true,
		default: [],
		trim: true,
		validate: isLengthValidator(2, 300),
	}],*/
}, {
	versionKey: false,
	autoIndex: false,
	_id: false,
	id: false,
	minimize: false,
	strict: true,
	strictQuery: true,
	useNestedStrict: true,
	retainKeyOrder: true
});

const symptomsAndSolutionsSchema = new mongoose.Schema({
		category: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true,
			required: [true, 'solution.CATEGORY_REQUIRED'],
			validate: isLengthValidator(2, 100),
		},
		data: [symptomAndSolutionsSchema],
		created_at: { type: Date, default: Date.now, validate: dateRangeValidator((new Date('2019-01-01')).getTime(), Date.now) },
		updated_at: { type: Date, required: [true, 'httpErrors.500'], default: Date.now, validate: dateRangeValidator((new Date('2019-01-01')).getTime(), Date.now) },
		last_ip_address: { type: String, validate: isLengthValidator(3, 40) }
	},
	{
		versionKey: false,
		autoIndex: false,
		timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
		id: false,
		minimize: false,
		strict: true,
		strictQuery: true,
		useNestedStrict: true,
		retainKeyOrder: true
	});

symptomsAndSolutionsSchema.methods.toJSON = function (opts) {
	let data = this.toObject(opts);
	// delete data.SOME_FIELD;
	return data;
};

module.exports = mongoose.model('Symptomsandsolutions', symptomsAndSolutionsSchema);
