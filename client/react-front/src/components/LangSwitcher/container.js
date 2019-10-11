import CSS              from './index.styl';
import React, {
    useState
}                       from 'react';
import { connect }      from 'react-redux';
import PropTypes        from 'prop-types';
import IconButton       from '@material-ui/core/IconButton';
import Menu             from '@material-ui/core/Menu';
import MenuItem         from '@material-ui/core/MenuItem';
import ListItemText     from '@material-ui/core/ListItemText';
import Typography       from '@material-ui/core/Typography';
import ListItemIcon     from '@material-ui/core/ListItemIcon';
import SvgIcon          from '@material-ui/core/SvgIcon';
import MLangIcon        from '@material-ui/icons/Translate';
import CheckIcon        from '@material-ui/icons/Check';
import ArrowForwardIcon from '@material-ui/icons/KeyboardArrowRight';
import ArrowBackIcon    from '@material-ui/icons/KeyboardArrowLeft';
import LangIcon         from '-!svg-react-loader?name=ThemeIcon!../../assets/img/lang-icon-2.svg';
import RuFlag           from '-!svg-react-loader?name=Ru!flag-icon-css/flags/4x3/ru.svg';
import EnFlag           from '-!svg-react-loader?name=En!flag-icon-css/flags/4x3/us.svg';
import { makeStyles }   from '@material-ui/core/styles';
import {
    injectIntl,
    defineMessages,
} from 'react-intl';

import changeLang       from '../../actionCreators/changeLocale';

const messages = defineMessages({
    Lang: {
        id: 'i18n.LangSwitcher.Lang',
        description: 'Лэйбл',
        defaultMessage: 'Язык:'
    },
    LangSelectDescription: {
        id: 'i18n.LangSwitcher.LangSelectDescription',
        description: 'Краткая информация о выборе языка',
        defaultMessage: 'Выберите ваш язык'
    }
});

const langs = [
    {
        code: 'ru',
        title: 'Русский',
        icon: RuFlag
    },
    {
        code: 'en',
        title: 'English',
        icon: EnFlag
    }
];

const ITEM_HEIGHT = 48;

const useStyles = makeStyles(theme => ({
    gutterR2: {
        marginRight: theme.spacing(2),
    },
    gutterL1: {
        marginLeft: theme.spacing(1),
    }
}));

function LangSwitcher ({intl: { formatMessage }, ...props}) {
    const classes = useStyles();

    const SelectedLang = langs.find(lang => lang.code === props.locale);

    if (props.asMenuItem) {
        const [menuIsOpen, toggleMenu] = useState(false);

        const changeLang = lang => () => {
            props.changeLang(lang);
        };

        const openMenu = () => {
            if (props.onMenuOpen) props.onMenuOpen();
            toggleMenu(true);
        };

        const closeMenu =  () => {
            if (props.onMenuClose) props.onMenuClose();
            toggleMenu(false);
        };

        if (!menuIsOpen) {
            return (
                <MenuItem onClick={openMenu}>
                    {
                        props.useMaterialIcons ? <MLangIcon color="inherit" className={classes.gutterR2}/> : (
                            <SvgIcon className={classes.gutterR2}>
                                <LangIcon />
                            </SvgIcon>
                        )
                    }

                    <ListItemText primary={<React.Fragment>
                        {formatMessage(messages.Lang)}
                        &nbsp;
                        {SelectedLang.title}
                    </React.Fragment>} />
                    <ArrowForwardIcon color="inherit" className={classes.gutterL1} />
                </MenuItem>
            );
        }

        return (
            <Menu id="lang-menu"
                  anchorEl={props.anchorEl}
                  open={menuIsOpen && Boolean(props.anchorEl)}
                  onClose={closeMenu}
                  PaperProps={{style:{maxWidth: 350}}}
            >
                <MenuItem onClick={closeMenu} selected={true}>
                    <ListItemIcon>
                        <ArrowBackIcon color="inherit" />
                    </ListItemIcon>
                    <ListItemText primary={formatMessage(messages.LangSelectDescription)} />
                </MenuItem>

                {langs.map(lang => (
                    <MenuItem key={lang.title + 'asMenuItem'} selected={false} onClick={changeLang(lang.code)}>
                        <ListItemIcon>
                            <SvgIcon>
                                <lang.icon />
                            </SvgIcon>
                        </ListItemIcon>
                        <ListItemText primary={lang.title} />
	                    {props.locale === lang.code ? <CheckIcon color="primary" /> : null }
                    </MenuItem>
                ))}
            </Menu>
        );
    }

    const [anchorEl, setAnchorEl] = useState(props.anchorEl || null);
    const open        = Boolean(anchorEl);
    const handleClick = ev => { setAnchorEl(ev.currentTarget); };
    const handleClose = () => { setAnchorEl(null); };
    const changeLang  = lang => () => {
        handleClose();
        props.changeLang(lang);
    };

    return (
        <React.Fragment>
            <RenderAnchor color={props.color} variant={props.variant} onClick={handleClick} className={props.className || ''}>
                {
                    'text' === props.variant ? (
                        <span style={{alignItems: props.center ? 'center' : null}} className={CSS.langAsText}>
                            <SvgIcon>
                                <SelectedLang.icon />
                            </SvgIcon>
                            &nbsp;&nbsp;
                            {SelectedLang.title}
                        </span>
                    ) : (
                        <SvgIcon>
                            <SelectedLang.icon />
                        </SvgIcon>
                    )
                }
            </RenderAnchor>
            <Menu
                id="lang-selector"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: 200,
                    },
                }}
            >
                {langs.map(lang => (
                    <MenuItem key={lang.title} selected={props.locale === lang.code} onClick={changeLang(lang.code)}>
                        <ListItemIcon>
                            <SvgIcon>
                                <lang.icon />
                            </SvgIcon>
                        </ListItemIcon>
                        {lang.title}
                    </MenuItem>
                ))}
            </Menu>
        </React.Fragment>
    )
}

LangSwitcher.propTypes = {
    useMaterialIcons: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    color: PropTypes.string,
    variant: PropTypes.oneOf(['iconBtn', 'text']),
    asMenuItem: PropTypes.bool,
    anchorEl: PropTypes.object,
    onMenuClose: PropTypes.func,
    onMenuOpen: PropTypes.func
};

function RenderAnchor (props) {
    if ('text' === props.variant) {
        return (
            <Typography aria-label="Выбрать язык"
                        aria-controls="lang-selector"
                        aria-haspopup="true"
                        color={props.color || 'primary'}
                        variant="body2"
                        onClick={props.onClick}
                        className={props.className}
            >
                {props.children}
            </Typography>
        )
    }

    return (
        <IconButton
            aria-label="Выбрать язык"
            aria-controls="lang-selector"
            aria-haspopup="true"
            color={props.color || 'inherit'}
            onClick={props.onClick}
            className={props.className}
        >
            {props.children}
        </IconButton>
    )
}

export default connect(state => {
    return {
        locale: state.i18n.locale
    }
}, {
    changeLang
})(React.memo(injectIntl(LangSwitcher)));