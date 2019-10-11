import CSS              from './index.styl';
import React, {
	useState,
	useEffect
}                       from 'react';
import PropTypes        from 'prop-types';
import { connect }      from 'react-redux';
import { Helmet }       from 'react-helmet';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl      from '@material-ui/core/FormControl';
import FormLabel        from '@material-ui/core/FormLabel';
import TextField        from '@material-ui/core/TextField';
import Radio            from '@material-ui/core/Radio';
import RadioGroup   from '@material-ui/core/RadioGroup';
import Button       from '@material-ui/core/Button';
import List         from '@material-ui/core/List';
import ListItem     from '@material-ui/core/ListItem';
import Divider      from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Typography   from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
	injectIntl,
	defineMessages
} from 'react-intl';
import {
	findSolutions,
	clearSolutions
} from '../../actionCreators/solutions';

const messages = defineMessages({
	helmet: {
		id: 'helmet.findSolutions',
		defaultMessage: 'Найти решения'
	},
	SearchLabel: {
		id: 'findSolution.SearchField.label',
		defaultMessage: 'Опишите вашу проблему'
	},
	SearchPlaceholder: {
		id: 'findSolution.SearchField.placeholder',
		defaultMessage: 'например: монитор не включается'
	},
	SearchErr1: {
		id: 'findSolution.SearchField.err1',
		defaultMessage: 'Поле обязательно для заполнения'
	},
	SearchErr2: {
		id: 'findSolution.SearchField.err2',
		defaultMessage: 'Минимум 4 символа'
	},
	SearchSubmitBtn: {
		id: 'findSolution.Search.submitBtn',
		defaultMessage: 'Найти решение'
	},
	Algorithm: {
		id: 'findSolution.AlgorithmLabel',
		defaultMessage: 'Алгоритм:'
	},
	LevenshteinAlg: {
		id: 'findSolution.Levenshtein',
		defaultMessage: 'Расстояние Левенштейна'
	},
	EntryAlg: {
		id: 'findSolution.Entry',
		defaultMessage: 'Вхождение слов'
	},
	PossibleSolutions: {
		id: 'findSolution.PossibleSolutions',
		defaultMessage: 'Возможные решения:'
	},
});

function FindSolution ({intl: { formatMessage }, ...props}) {
	const [symptom, setSymptom] = useState((new URLSearchParams(props.history?.location?.search || '')).get('symptom') || '');
	const [algorithm, setAlgorithm] = useState((new URLSearchParams(props.history?.location?.search || '')).get('algorithm') || 'entry');
	const [symptomFieldHasError, setSymptomFieldError] = useState(false);

	const findSolutions = () => {
		props.findSolutions(symptom.trim(), algorithm);
	};

	useEffect(() => {
		if (symptom && symptom.trim()) {
			findSolutions();
		}
		return () => {
			props.clearSolutions();
		}
	}, []);

	const {
		disabled,
		isLoading
	} = props;

	const onSymptomFieldChange = ev => {
		if (symptomFieldHasError) setSymptomFieldError(false);
		setSymptom(ev.target.value);
	};

	const onAlgorithmChange = ev => {
		setAlgorithm(ev.target.value)
	};

	const onSubmit = ev => {
		ev.preventDefault();
		props.history.push({
			search: '?symptom=' + symptom + '&algorithm=' + algorithm
		});

		if (!symptom.trim() || symptom.trim().length < 4) {
			setSymptomFieldError(true);
			return;
		}
		findSolutions();
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>{formatMessage(messages.helmet)}</title>
			</Helmet>
			<div className={CSS.formConatiner}>
				<form className={CSS.searchForm}
				      action="/api/v1/solutions"
				      method="GET"
				      encType="application/json"
				      onSubmit={onSubmit}
				>

					<div className={CSS.formGroup}>
						<div className={CSS.searhGroup}>
							{isLoading? <CircularProgress className={CSS.prelaoder} size={40} /> : null}
							<TextField className={CSS.searchField}
							           autoFocus
							           disabled={disabled || isLoading}
							           error={symptomFieldHasError}
							           label={formatMessage(messages.SearchLabel)}
							           placeholder={formatMessage(messages.SearchPlaceholder)}
							           helperText={symptomFieldHasError ? (
								           symptom.trim().length < 4 ? formatMessage(messages.SearchErr2) : formatMessage(messages.SearchErr2)
							           ) : ' '}
							           margin="normal"
							           name="symptom"
							           defaultValue={symptom}
							           onChange={onSymptomFieldChange}
							/>
							<Button className={CSS.submitBtn}
							        disabled={disabled || isLoading}
							        type="submit"
							        variant="contained"
							        color="primary"
							>
								{formatMessage(messages.SearchSubmitBtn)}
							</Button>
						</div>
						<div className={CSS.algorithmContainer}>
							<FormControl component="fieldset" style={{flexGrow: 1}}>
								<FormLabel component="legend">{formatMessage(messages.Algorithm)}</FormLabel>
								<RadioGroup className={CSS.algorithmGroup}
								            aria-label="algorithm"
								            name="algorithm"
								            value={algorithm}
								            onChange={onAlgorithmChange}
								>
									<FormControlLabel className={CSS.radioLabel}
									                  value="levenshtein"
									                  labelPlacement="start"
									                  control={<Radio disabled={disabled || isLoading} color="primary" />}
									                  label={
										                  formatMessage(messages.LevenshteinAlg)
									                  }
									/>
									<FormControlLabel className={CSS.radioLabel}
									                  value="entry"
									                  labelPlacement="start"
									                  control={<Radio disabled={disabled || isLoading} color="primary" />}
									                  label={
										                  formatMessage(messages.EntryAlg)
									                  }
									/>
								</RadioGroup>
							</FormControl>
						</div>
					</div>


				</form>
			</div>

			{
				props.solutions?.length ? (<Typography variant="h4" align="center">
					{
						formatMessage(messages.PossibleSolutions)
					}
				</Typography>) : null
			}

			<div>


					{props.solutions.map(ss => (
						<React.Fragment key={ss.category + ss.symptom}>
							<Typography variant="h6">
								{ss.symptom}
							</Typography>
							<List>
								{
									ss.solutions.map((sol, i) => (
										<React.Fragment key={sol}>
											<ListItem alignItems="flex-start">
												<ListItemText
													primary=''
													secondary={sol}
												/>
											</ListItem>
											{(ss.solutions.length -1 === i) ? null : <Divider component="li" />}
										</React.Fragment>
									))
								}

							</List>
						</React.Fragment>

					))}



			</div>
		</React.Fragment>
	);
}
FindSolution.propTypes = {
	disabled: PropTypes.bool,
	isLoading: PropTypes.bool,
	solutions: PropTypes.array,
	findSolutions: PropTypes.func.isRequired,
	clearSolutions: PropTypes.func.isRequired,
};

export default connect(state => ({
	disabled: state.solutions.findSolutions.disabled,
	isLoading: state.solutions.findSolutions.isLoading,
	solutions: state.solutions.findSolutions.solutions
}), {
	findSolutions,
	clearSolutions
})(injectIntl(FindSolution));
