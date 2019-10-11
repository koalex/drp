import {
	LOAD_SYMTOPMS_AND_SOLUTIONS,
	LOAD_SYMTOPMS_AND_SOLUTIONS_SUCCESS,
	LOAD_SYMTOPMS_AND_SOLUTIONS_ERROR,
	CREATE_SYMTOPMS_AND_SOLUTIONS,
	CREATE_SYMTOPMS_AND_SOLUTIONS_SUCCESS,
	CREATE_SYMTOPMS_AND_SOLUTIONS_ERROR,
	UPDATE_SYMTOPMS_AND_SOLUTIONS,
	UPDATE_SYMTOPMS_AND_SOLUTIONS_SUCCESS,
	UPDATE_SYMTOPMS_AND_SOLUTIONS_ERROR,
	FIND_SOLUTIONS,
	FIND_SOLUTIONS_SUCCESS,
	FIND_SOLUTIONS_ERROR,
	CLEAR_SOLUTIONS
} from '../actionTypes';

let fixtures = [];

if (__DEV__) {
	fixtures = require('../fixtures/solutions.json');
}

export const init = {
	createSolutions: {
		isLoading: false,
		disabled: false
	},
	editSolutions: {},
	findSolutions: {
		isLoading: false,
		disabled: false,
		solutions: []
	},
    items: [], //fixtures,
};

export default function (state = init, action) {
	const { type, data, payload } = action;

	switch (type) {
		default:
			return state;

		case CLEAR_SOLUTIONS:
			return {
				...state,
				findSolutions: {
					...state.findSolutions,
					isLoading: false,
					disabled: false,
					solutions: []
				}
			};

		case FIND_SOLUTIONS:
			return {
				...state,
				findSolutions: {
					...state.findSolutions,
					isLoading: true,
					disabled: true,
					solutions: []
				}
			};

		case FIND_SOLUTIONS_SUCCESS:
			return {
				...state,
				findSolutions: {
					...state.findSolutions,
					isLoading: false,
					disabled: false,
					solutions: payload
				}
			};

		case FIND_SOLUTIONS_ERROR:
			return {
				...state,
				findSolutions: {
					...state.findSolutions,
					isLoading: false,
					disabled: false,
					solutions: []
				}
			};

		case CREATE_SYMTOPMS_AND_SOLUTIONS:
		case LOAD_SYMTOPMS_AND_SOLUTIONS:
			return {
				...state,
				createSolutions: {
					...state.createSolutions,
					isLoading: true,
					disabled: true
				}
			};

		case LOAD_SYMTOPMS_AND_SOLUTIONS_SUCCESS:
			return {
				...state,
				items: payload,
				createSolutions: {
					...state.createSolutions,
					isLoading: false,
					disabled: false
				},
				editSolutions: payload.reduce((acc, v) => {
					acc[v._id] = {
						disabled: false,
						isLoading: false
					};
					return acc;
				}, {})
			};

		case CREATE_SYMTOPMS_AND_SOLUTIONS_SUCCESS:
			return {
				...state,
				items: state.items.concat(payload),
				createSolutions: {
					...state.createSolutions,
					isLoading: false,
					disabled: false
				}
			};

		case CREATE_SYMTOPMS_AND_SOLUTIONS_ERROR:
		case LOAD_SYMTOPMS_AND_SOLUTIONS_ERROR:
			return {
				...state,
				createSolutions: {
					...state.createSolutions,
					isLoading: false,
					disabled: false
				}
			};

		case UPDATE_SYMTOPMS_AND_SOLUTIONS:
			return {
				...state,
				editSolutions: {
					...state.editSolutions,
					[data._id]: {
						isLoading: true,
						disabled: true
					}
				}
			};

		case UPDATE_SYMTOPMS_AND_SOLUTIONS_ERROR:
			return {
				...state,
				editSolutions: {
					...state.editSolutions,
					[data._id]: {
						isLoading: false,
						disabled: false
					}
				}
			};

		case UPDATE_SYMTOPMS_AND_SOLUTIONS_SUCCESS:
			return {
				...state,
				items: state.items.reduce((acc, v) => {
					if (v._id === payload._id) {
						acc.push(payload);
					} else {
						acc.push(v);
					}
					return acc;
				}, []),
				editSolutions: {
					...state.editSolutions,
					[data._id]: {
						isLoading: false,
						disabled: false
					}
				}
			};
	}
}
