import React                from 'react';
import PropTypes            from 'prop-types';
import { connect }          from 'react-redux';
import {
    IntlProvider,
} from 'react-intl';

class I18nProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // locale: props.locale || 'ru',
            messages: {
                ru: require('./messages/ru.json'),
                en: require('./messages/en.json')
            }
        };
    }

    static propTypes = {
        locale: PropTypes.string.isRequired
    };

    render () {
        return (
            <IntlProvider locale={this.props.locale}
                          messages={this.state.messages[this.props.locale]}
            >
                {this.props.children}
            </IntlProvider>
        );
    }
}

export default connect(state => ({
    locale: state.i18n?.locale
}), null)(I18nProvider);