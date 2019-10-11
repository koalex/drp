import CSS              from './index.styl';
import React, {
    useEffect
} from 'react';
import PropTypes        from 'prop-types';
import { Helmet }       from 'react-helmet';
import { connect }      from 'react-redux';
import SolutionForm     from '../SolutionForm';
import {
    loadSymptomsAndSolutions,
    createSymptomsAndSolutions
} from '../../actionCreators/solutions';
import {
    injectIntl,
    defineMessages
} from 'react-intl';

const messages = defineMessages({
    helmet: {
        id: 'helmet.createSolutions',
        defaultMessage: 'Создать решения'
    }
});

function CreateSolution ({intl: { formatMessage }, ...props}) {
    useEffect(() => {
        props.loadSymptomsAndSolutions();
    }, []);

    return (
        <div className={CSS.pageContainer}>
            <Helmet>
                <title>{formatMessage(messages.helmet)}</title>
            </Helmet>
            <SolutionForm disabled={props.disabled}
                          isLoading={props.isLoading}
                          categories={props.categories}
                          mode="new"
                          onSubmit={props.createSymptomsAndSolutions}
            />
        </div>
    )
}
CreateSolution.propTypes = {
    disabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    categories: PropTypes.array.isRequired,
    loadSymptomsAndSolutions: PropTypes.func.isRequired,
    createSymptomsAndSolutions: PropTypes.func.isRequired
};

export default connect(state => ({
    disabled: state.solutions.createSolutions.disabled,
    isLoading: state.solutions.createSolutions.isLoading,
    categories: state.solutions.items?.map(ss => ss.category) || []
}), {
    loadSymptomsAndSolutions,
    createSymptomsAndSolutions
})(injectIntl(CreateSolution));
