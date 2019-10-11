import CSS              from './index.styl';
import React, {
    useEffect
} from 'react';
import PropTypes        from 'prop-types';
import { connect }      from 'react-redux';
import { Helmet }       from 'react-helmet';
import SolutionForm     from '../SolutionForm';
import {
    loadSymptomsAndSolutions,
    updateSymptomsAndSolutions
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

function EditSolutions ({intl: { formatMessage }, ...props}) {
    useEffect(() => {
        props.loadSymptomsAndSolutions();
    }, []);
    return (
        <div className={CSS.pageContainer}>
            <Helmet>
                <title>{formatMessage(messages.helmet)}</title>
            </Helmet>
            {
                props.symptomsAndSolutions.map(ss => {
                    return (
                        <div key={ss._id} className={CSS.solutionItemContainer}>
                            <SolutionForm disabled={props.disabled}
                                          isLoading={props.isLoading}
                                          categories={props.symptomsAndSolutions?.map(ss => ss.category) || []}
                                          data={ss}
                                          onSubmit={props.updateSymptomsAndSolutions}
                            />
                        </div>
                    );
                })
            }
        </div>
    )
}
EditSolutions.propTypes = {
    disabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    symptomsAndSolutions: PropTypes.array.isRequired,
    loadSymptomsAndSolutions: PropTypes.func.isRequired,
    updateSymptomsAndSolutions: PropTypes.func.isRequired
};

export default connect(state => ({
    disabled: state.solutions.createSolutions.disabled,
    isLoading: state.solutions.createSolutions.isLoading,
    symptomsAndSolutions: state.solutions.items
}), {
    loadSymptomsAndSolutions,
    updateSymptomsAndSolutions
})(EditSolutions);
