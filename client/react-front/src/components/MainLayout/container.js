import CSS                from './index.styl';
import React              from 'react';
import { connect }        from 'react-redux';
import PropTypes          from 'prop-types';
import RouteWithSubRoutes from '../RouteWithSubRoutes';
import { NavLink, Redirect } from 'react-router-dom';
import CssBaseline        from '@material-ui/core/CssBaseline';
import Container          from '@material-ui/core/Container';
import ButtonGroup        from '@material-ui/core/ButtonGroup';
import Button             from '@material-ui/core/Button';
import ThemeSwitcher      from '../ThemeSwitcher'
import LangSwitcher       from '../LangSwitcher/container';
import changeTheme        from '../../actionCreators/changeTheme';
import Logo               from '../../assets/img/logo.svg';
import LogoDark           from '../../assets/img/logo-dark.svg';
import { makeStyles }     from '@material-ui/core/styles';
import {
    injectIntl,
    defineMessages
} from 'react-intl';

const useStyles = makeStyles(theme => {
    return {
        headerBg: {
            backgroundColor: theme.palette.background.default,
        },
    }
});

const Link = React.forwardRef((props, ref) => (
    <NavLink innerRef={ref} {...props} />
));

const RenderLogo = props => {
    return props.dark ? <img src={LogoDark} alt="DriverPack Solution Logo" /> : <img src={Logo} alt="DriverPack Solution Logo" />;
};

const messages = defineMessages({
    NavFindSolution: {
        id: 'NavFindSolution',
        defaultMessage: 'Найти решение'
    },
    NavCreateSolution: {
        id: 'NavCreateSolution',
        defaultMessage: 'Создать решение'
    },
    NavUpdateSolutions: {
        id: 'NavUpdateSolutions',
        defaultMessage: 'Редактировать решения'
    },
});

function MainLayout ({intl: { formatMessage }, ...props}) {
    if (props?.location?.pathname === '/') {
        return <Redirect to="/find-solution" />;
    }
    const classes = useStyles();
    const {
        themes,
        selectedTheme,
        changeTheme,
    } = props;

    const themeSwitcherProps = { themes, selectedTheme, changeTheme, useMaterialIcons: false };

    return (
        <React.Fragment>
            <React.Fragment>
                <CssBaseline />
                <div className={CSS.content}>
                    <header className={`${CSS.header} ${classes.headerBg}`}>
                        <div>
                            <NavLink to="/">
                                <RenderLogo dark={selectedTheme.themeName === 'Material light'}/>
                            </NavLink>
                        </div>
                        <div>
                            <ButtonGroup color="primary">
                                <Button component={Link} to="/find-solution">
                                    {formatMessage(messages.NavFindSolution)}
                                </Button>
                                <Button component={Link} to="/create-solution">
                                    {formatMessage(messages.NavCreateSolution)}
                                </Button>
                                <Button component={Link} to="/edit-solutions">
                                    {formatMessage(messages.NavUpdateSolutions)}
                                </Button>
                            </ButtonGroup>
                        </div>
                        <div>
                            <ThemeSwitcher {...themeSwitcherProps} />
                            <LangSwitcher />
                        </div>
                    </header>
                    {props.children}
                    {props.routes.map((route, i) => {
                        return (
                                <RouteWithSubRoutes
                            key={'routeMainLayout' + i + route.path}
                            {...route}
                            />
                        )
                    })}
                </div>
            </React.Fragment>
        </React.Fragment>
    );
}

MainLayout.propTypes = {
    routes: PropTypes.array.isRequired,
    children: PropTypes.node,
    themes: PropTypes.array,
    selectedTheme: PropTypes.object,
    changeTheme: PropTypes.func.isRequired,
};

export default connect(state => {
    return {
        themes: state.themes?.items,
        selectedTheme: state.themes?.selectedTheme
    }
}, {
    changeTheme,
})(injectIntl(MainLayout));
