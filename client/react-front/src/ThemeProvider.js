import React                from 'react';
import PropTypes            from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { connect }          from 'react-redux';

class ThemeProvider extends React.Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        theme: PropTypes.object.isRequired
    };

    render () {
        const { children, theme } = this.props;

        return (
            <MuiThemeProvider theme={theme}>
                {children}
            </MuiThemeProvider>
        );
    }
}

export default connect(state => ({
    theme: state.themes.selectedTheme
}), null)(ThemeProvider);
