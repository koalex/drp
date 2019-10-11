import { THEME_CHANGE } from '../actionTypes';

export default function changeTheme ({ theme }) {
	return {
		type: THEME_CHANGE,
		data: {
            theme
		}
	}
}
