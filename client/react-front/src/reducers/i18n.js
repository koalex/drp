import {
    CHANGE_LOCALE
} from '../actionTypes';
import getCookie from 'utils/getCookie';
import setCookie from 'utils/setCookie';

function getLocale () {
    let locale;

    if (~window.location.search.toLowerCase().indexOf('locale=')) {
        let searchParams = new URLSearchParams(window.location.search);
        locale = searchParams.get('locale');
    } else if (getCookie('locale')) {
        locale = getCookie('locale');
    } else if (window.navigator.language || window.navigator.userLanguage || window.navigator.systemLanguage || window.navigator.browserLanguage) {
        locale = (window.navigator.language || window.navigator.userLanguage || window.navigator.systemLanguage || window.navigator.browserLanguage);
    }

    return (locale ? ((locale).match(/[a-z]{2,3}/i)[0]).toLowerCase() : 'ru');
}

export const init = {
    locale: getLocale()
};

export default function (state = init, action) {
    const { type, data } = action;

    switch (type) {
        default:
            return state;

        case CHANGE_LOCALE:
            setCookie('locale', data); // TODO: move to middleware
            return {
                ...state,
                locale: data
            };
    }
}
