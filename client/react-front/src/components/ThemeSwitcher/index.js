import React, {
    useState
}                   from 'react';
import PropTypes    from 'prop-types';
import IconButton   from '@material-ui/core/IconButton';
import Menu         from '@material-ui/core/Menu';
import MenuItem     from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon      from '@material-ui/core/SvgIcon';
import PaletteIcon       from '@material-ui/icons/Palette';
import ThemeIcon         from '-!svg-react-loader?name=ThemeIcon!../../assets/img/theme-icon.svg';
import { makeStyles }    from '@material-ui/core/styles';
import {
	injectIntl,
	defineMessages
} from 'react-intl';

const messages = defineMessages({
	ColorTheme: {
		id: 'frontpage.ThemeSwitcher.ColorTheme',
		description: 'Лэйбл',
		defaultMessage: 'Цветовая тема:'
	},
	ColorThemeWOColon: {
		id: 'frontpage.ThemeSwitcher.ColorThemeWOColon',
		description: 'Лэйбл без двоеточия',
		defaultMessage: 'Цветовая тема'
	},
	ThemeSelectDescription: {
		id: 'frontpage.ThemeSwitcher.ThemeSelectDescription',
		description: 'Краткая информация о применении цветовой схемы при выборе',
		defaultMessage: 'Выбранная цветовая схема будет сохранена только в этом браузере (приложении)'
	},
	MaterialDark: {
		id: 'frontpage.ThemeSwitcher.MaterialDark',
		description: 'Название тёмной темы Material Dark',
		defaultMessage: 'Тёмная тема'
	},
	MaterialDarkShort: {
		id: 'frontpage.ThemeSwitcher.MaterialDarkShort',
		description: 'Название тёмной темы Material Dark (кратко)',
		defaultMessage: 'Тёмная'
	},
	MaterialLight: {
		id: 'frontpage.ThemeSwitcher.MaterialLight',
		description: 'Название тёмной темы MaterialLight',
		defaultMessage: 'Светлая тема'
	},
	MaterialLightShort: {
		id: 'frontpage.ThemeSwitcher.MaterialLightShort',
		description: 'Название тёмной темы MaterialLight (кратко)',
		defaultMessage: 'Светлая'
	},
	MaterialLight2: {
		id: 'frontpage.ThemeSwitcher.MaterialLight2',
		description: 'Название тёмной темы MaterialLight 2',
		defaultMessage: 'Светлая тема 2'
	},
	MaterialLightShort2: {
		id: 'frontpage.ThemeSwitcher.MaterialLightShort2',
		description: 'Название тёмной темы MaterialLight 2 (кратко)',
		defaultMessage: 'Светлая 2'
	}
});

const useStyles = makeStyles(theme => ({
    gutterR2: {
        marginRight: theme.spacing(2),
    },
    gutterL1: {
        marginLeft: theme.spacing(1),
    },
	wrap: {
    	flexWrap: 'wrap',
		whiteSpace: 'pre-wrap'
	}
}));

const RenderThemeNameLocalized = injectIntl(function ({themeName, short, intl: { formatMessage }}) {
	if (themeName === 'Material dark') {
		return short ? formatMessage(messages.MaterialDarkShort) : formatMessage(messages.MaterialDark);
	}

	if (themeName === 'Material light') {
		return short ? formatMessage(messages.MaterialLightShort) : formatMessage(messages.MaterialLight);
	}

	if (themeName === 'Material light 2') {
		return short ? formatMessage(messages.MaterialLightShort2) : formatMessage(messages.MaterialLight2);
	}
});

function ThemeSwitcher ({intl: { formatMessage }, ...props}) {
    const [anchorEl, setAnchorEl] = useState(null);

    const classes = useStyles();

    const { themes, selectedTheme } = props;

    const handleClick = ev => {
        setAnchorEl(ev.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

	const handleThemeSelect = themeName => () => {
		setAnchorEl(null);
		if (selectedTheme && selectedTheme.themeName === themeName) return;
		const theme = themes.find(theme => theme.themeName === themeName);
		props.changeTheme({ theme });
	};

	return (
		<React.Fragment>
			<IconButton
				aria-label="Темы оформления"
				aria-owns={Boolean(anchorEl) ? 'themes-menu' : undefined}
				aria-haspopup="true"
				onClick={handleClick}
				className={props.className || ''}
			>
				{
					props.useMaterialIcons ? <PaletteIcon color="inherit" /> : (
						<SvgIcon color="inherit">
							<ThemeIcon />
						</SvgIcon>
					)
				}

			</IconButton>
			<Menu
				id="themes-menu"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				PaperProps={{style:{maxWidth: 350}}}
			>
				{themes.map(theme => (
					<MenuItem
						key={theme.themeName}
						selected={theme.themeName === selectedTheme.themeName}
						onClick={handleThemeSelect(theme.themeName)}
					>
						<ListItemText primary={<RenderThemeNameLocalized themeName={theme.themeName}/>} />
					</MenuItem>
				))}
			</Menu>
		</React.Fragment>
	)
}

ThemeSwitcher.propTypes = {
	useMaterialIcons: PropTypes.bool,
	className: PropTypes.string,
	themes: PropTypes.array.isRequired,
	selectedTheme: PropTypes.object,
	changeTheme: PropTypes.func.isRequired,
	anchorEl: PropTypes.object,
	onMenuClose: PropTypes.func,
	onMenuOpen: PropTypes.func
};

export default React.memo(injectIntl(ThemeSwitcher));
