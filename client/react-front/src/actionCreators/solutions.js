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


export function loadSymptomsAndSolutions () {
	return {
		type: LOAD_SYMTOPMS_AND_SOLUTIONS,
		CALL_API: {
			endpoint: '/api/v1/symptoms-solutions',
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			success_type: LOAD_SYMTOPMS_AND_SOLUTIONS_SUCCESS,
			error_type: LOAD_SYMTOPMS_AND_SOLUTIONS_ERROR
		}
	}
}

export function createSymptomsAndSolutions (data) {
	return {
		type: CREATE_SYMTOPMS_AND_SOLUTIONS,
		data,
		CALL_API: {
			endpoint: '/api/v1/symptoms-solutions',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: data,
			success_type: CREATE_SYMTOPMS_AND_SOLUTIONS_SUCCESS,
			error_type: CREATE_SYMTOPMS_AND_SOLUTIONS_ERROR
		}
	}
}

export function updateSymptomsAndSolutions (data) {
	return {
		type: UPDATE_SYMTOPMS_AND_SOLUTIONS,
		data,
		CALL_API: {
			endpoint: '/api/v1/symptoms-solutions/' + data._id,
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: data,
			success_type: UPDATE_SYMTOPMS_AND_SOLUTIONS_SUCCESS,
			error_type: UPDATE_SYMTOPMS_AND_SOLUTIONS_ERROR
		}
	}
}

export function findSolutions (symptom, algorithm) {
	return {
		type: FIND_SOLUTIONS,
		data: {
			symptom,
			algorithm
		},
		CALL_API: {
			endpoint: '/api/v1/solutions?symptom=' + symptom + '&algorithm=' + algorithm,
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Cache-Control': 'no-cache, no-store, must-revalidate',
				Pragma: 'no-cache',
				Expires: 0
			},
			success_type: FIND_SOLUTIONS_SUCCESS,
			error_type: FIND_SOLUTIONS_ERROR
		}
	}
}

export function clearSolutions () {
	return {
		type: CLEAR_SOLUTIONS
	}
}