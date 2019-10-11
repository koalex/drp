import createMuiTheme   from '@material-ui/core/styles/createMuiTheme';
import blue             from '@material-ui/core/colors/blue';
import { THEME_CHANGE } from '../actionTypes';

const materialDarkTheme = createMuiTheme({
    themeName: 'Material dark',
    title: 'Тёмная тема',
    typography: { useNextVariants: true },
    palette: {
        type: 'dark',
        primary: blue // Purple and green play nicely together.
    }
});

const materialLightTheme = createMuiTheme({
    themeName: 'Material light',
    title: 'Светлая тема',
    typography: { useNextVariants: true },
    palette: {
        type: 'light',
        primary: blue
    }
});

export const init = {
    selectedTheme: materialDarkTheme,
    items: [
        materialDarkTheme,
        materialLightTheme,
    ]
};

export default function (state = init, action) {
	const { type, data } = action;

	switch (type) {
		default:
			return state;

		case THEME_CHANGE:
			return {
			    ...state,
				selectedTheme: data.theme
            }

	}
}
