import { CHANGE_LOCALE } from '../actionTypes';

export default function changeLocale (locale) {
	return {
		type: CHANGE_LOCALE,
		data: locale
	}
}
