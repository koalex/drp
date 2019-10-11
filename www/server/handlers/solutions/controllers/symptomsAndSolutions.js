const SS                  = require('../models/symptomsAndSolutions');
const isObjectId          = require('../../../utils/isObjectId');
const levenshteinDistance = require('javascript-algorithms-and-data-structures/src/algorithms/string/levenshtein-distance/levenshteinDistance.js');

const projection = '-created_at -updated_at -last_ip_address';

async function findSolutionsLevenshteinDistance (userSymptom) {
	const SEP = '*::*';

	function map () {
		for (let i = 0, l = this.data.length; i < l; i++) {
			const category = this.category;
			const symptom = this.data[i].symptom;
			const solutions = this.data[i].solutions.sort(function (a, b) {
				return levenshteinDistance(userSymptom, a) - levenshteinDistance(userSymptom, b);
			});
			// const keywords = this.data[i].keywords;
			const rank = levenshteinDistance(userSymptom, symptom);
			emit(category + SEP + symptom + SEP  + JSON.stringify(solutions), rank);
		}
	}

	function reduce (symptom, ranks) {
		let sum = 0;
		for (let i in ranks) {
			sum += ranks[i];
		}
		return sum;
	}

	const mr = await SS.mapReduce({
		map,
		reduce,
		scope: {
			SEP: SEP,
			levenshteinDistance: levenshteinDistance,
			userSymptom: userSymptom
		}
	});

	const result = mr.results.sort((a, b) => a.value - b.value).map(val => {
		const resSplitted = val._id.split(SEP);
		const category  = resSplitted[0];
		const symptom   = resSplitted[1];
		const solutions = resSplitted[2];
		const levenshteinDistance = val.value;
		return {
			category,
			symptom,
			solutions: JSON.parse(solutions),
			levenshteinDistance
		};
	});

	return result;
}

async function findSolutionsEntry (userSymptom) {
	const MIN_WORD_LENGTH = 3;
	const symptomWords = userSymptom.match(/\S+\s*/gim).reduce((acc, word) => {
		let _word = word.replace(/[\W\s]+$|^[\W\s]+|'/gm, '');
		if (_word) acc.push(_word);
		return acc;
	}, []);

	const symptomWordsRE = symptomWords.reduce((acc, word) => { // [/moni?t?o?r?/i]
		if (word.length > MIN_WORD_LENGTH) {
			acc.push(new RegExp(
				word.substr(0, 3) +
				word.substr(3).split('').map(char => char + '?').join(''),
				'i'));
		}
		return acc;
	}, []);

	const allSymtomsAndSolution = await exports.getAll();

	return allSymtomsAndSolution.reduce((acc, ss) => {
		for (let i = 0, l = ss.data.length; i < l; i++) {
			const { symptom, solutions } = ss.data[i];
			let rank = 0;
			for (let i2 = 0, l2 = symptomWordsRE.length; i2 < l2; i2++) {
				const matches = symptom.replace(/'/gm, '').match(symptomWordsRE[i2]);
				if (matches) rank += matches.length;
			}
			const result = {
				category: ss.category,
				symptom,
				solutions: solutions.sort((a, b) => {
					let aRank = 0, bRank = 0;

					for (let i = 0, l = symptomWordsRE.length; i < l; i++) {
						const aMatches = a.replace(/'/gm, '').match(symptomWordsRE[i]);
						const bMatches = b.replace(/'/gm, '').match(symptomWordsRE[i]);
						if (aMatches) aRank += aMatches.length;
						if (bMatches) bRank += bMatches.length;
					}
					return bRank - aRank;
				}),
				rank
			};
			acc.push(result);
		}

		return acc;
	}, []).sort((a, b) => b.rank - a.rank);

	return allSymtomsAndSolution.sort((a, b) => {

	});

	/*await SS.aggregate([{
		$match: {
			$or: [
				{
					data: {
						$elemMatch: {
							symptom: {
								$in: symptomWordsRE
							}
						}
					}
				},
				{
					data: {
						$elemMatch: {
							keywords: {
								$in: symptomWordsRE
							}
						}
					}
				}
			]
		}
	},
		{
			$project: {
				created_at: false,
				updated_at: false,
				last_ip_address: false,
			}
		}
		/!*{
		 $project: {
		 data: {
		 $filter: {
		 input: "$data",
		 as: "item",
		 cond: {
		 $in: ["$$item.symptom", symptomWordsRE]

		 }
		 }
		 }
		 }
		 }*!/
	]);*/
}

exports.findSolutions = async (userSymptom, algorithm) => {
	switch (algorithm) {
		default:
			return await findSolutionsLevenshteinDistance(userSymptom);

		case 'entry':
			return await findSolutionsEntry(userSymptom);
	}
};

exports.getAll = async () => {
	return await SS.find({}, projection).lean().exec();
};

exports.getOneByIdOrCategory = async idOrCategory => {
	if (isObjectId(idOrCategory)) return await SS.findById(String(idOrCategory), projection).lean().exec();
	return await SS.findOne({
		category: String(idOrCategory)
	}, projection).lean().exec();
};

exports.createOne = async (data, ip) => {
	let symtopmsAndSolutions = await SS.findOne({ category: String(data.category) }, projection);
	if (symtopmsAndSolutions) {
		symtopmsAndSolutions.data.push(...data.data);
	} else {
		symtopmsAndSolutions  = new SS(data);
	}
	if (ip) symtopmsAndSolutions.last_ip_address = ip;
	await symtopmsAndSolutions.save();
	return symtopmsAndSolutions;
};

exports.updateOneById = async (_id, data, ip) => {
	if (!isObjectId(_id)) throw new Error('`_id` must be an ObjectID');
	const update = {...data};
	delete update._id;

	if (ip) update.last_ip_address = ip;

	return await SS.findByIdAndUpdate(String(_id), update, {
		new: true,
		upsert: false,
		runValidators: true,
		context: 'query'
	}).lean().exec();
};