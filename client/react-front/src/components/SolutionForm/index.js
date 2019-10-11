import CSS from './index.styl';
import React, {
	useState,
	useEffect,
	useRef
}                       from 'react';
import PropTypes        from 'prop-types';
import MenuItem         from '@material-ui/core/MenuItem';
import FormLabel        from '@material-ui/core/FormLabel';
import InputLabel       from '@material-ui/core/InputLabel';
import FormControl      from '@material-ui/core/FormControl';
import FormHelperText   from '@material-ui/core/FormHelperText';
import TextField        from '@material-ui/core/TextField';
import Switch           from '@material-ui/core/Switch';
import Select           from '@material-ui/core/Select';
import Button           from '@material-ui/core/Button';
import IconButton       from '@material-ui/core/IconButton';
import AddIcon          from '@material-ui/icons/Add';
import DeleteIcon       from '@material-ui/icons/Delete';
import Tooltip          from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles }   from '@material-ui/core/styles';
import {
	injectIntl,
	defineMessages
} from 'react-intl';

const useStyles = makeStyles(theme => ({
	marginZero: {
		margin: 0,
	},
	gutterL1: {
		marginLeft: theme.spacing(1)
	},
	gutterR1: {
		marginRight: theme.spacing(1)
	},
	minFieldWidth: {
		minWidth: '300px'
	}
}));

const getErrPropTypes = () => {
	return PropTypes.exact({
		category: PropTypes.bool,
		symptomsAndSolutions: PropTypes.arrayOf(PropTypes.exact({
			symptom: PropTypes.bool,
			solutions: PropTypes.arrayOf(PropTypes.bool)
		}))
	});
};

const messages = defineMessages({
	SolutionFormCatLabel: {
		id: 'SolutionFormCatLabel',
		defaultMessage: 'Категория'
	},
	SolutionFormRequiredErr: {
		id: 'SolutionFormRequiredErr',
		defaultMessage: 'Не заполнено'
	},
	SolutionFormCatNewLabel: {
		id: 'SolutionFormCatNewLabel',
		defaultMessage: 'Создать'
	},
	SolutionFormCatNewPlaceholder: {
		id: 'SolutionFormCatNewPlaceholder',
		defaultMessage: 'Перифирия'
	},
	SolutionFormCatExist: {
		id: 'SolutionFormCatExist',
		defaultMessage: 'Выбрать'
	},
	SolutionFormSSLabel: {
		id: 'SolutionFormSSLabel',
		defaultMessage: 'Проблемы и решения'
	},
	SolutionFormSymptomLabel: {
		id: 'SolutionFormSymptomLabel',
		defaultMessage: 'Проблема'
	},
	SolutionFormSymptomPlaceholder: {
		id: 'SolutionFormSymptomPlaceholder',
		defaultMessage: 'Ноутбук не включается'
	},
	SolutionFormSolutionLabel: {
		id: 'SolutionFormSolutionLabel',
		defaultMessage: 'Возможное решение'
	},
	SolutionFormSolutionPlaceholder: {
		id: 'SolutionFormSolutionPlaceholder',
		defaultMessage: 'Проверьте электропитание'
	},
	AddSolutionTooltip: {
		id: 'AddSolutionTooltip',
		defaultMessage: 'Добавить ещё возможное решение для этого симптома'
	},
	RemoveSolutionTooltip: {
		id: 'RemoveSolutionTooltip',
		defaultMessage: 'Удалить это решение'
	},
	AddSSTooltip: {
		id: 'AddSSTooltip',
		defaultMessage: 'Добавить проблему'
	},
	DeleteSSTooltip: {
		id: 'DeleteSSTooltip',
		defaultMessage: 'Удалить проблему и решения'
	},
	SolutionFormSubmitBtnAdd: {
		id: 'SolutionFormSubmitBtnAdd',
		defaultMessage: 'Создать'
	},
	SolutionFormSubmitBtnEdit: {
		id: 'SolutionFormSubmitBtnEdit',
		defaultMessage: 'Редактировать'
	},
	SolutionFormSubmitBtnSave: {
		id: 'SolutionFormSubmitBtnSave',
		defaultMessage: 'Сохранить'
	},
	SolutionFormSubmitBtnCancel: {
		id: 'SolutionFormSubmitBtnCancel',
		defaultMessage: 'Отмена'
	}
});

function SymptomsAndSolutionsForm ({intl: { formatMessage }, ...props}) {
	const [editMode, setEditMode] = useState(false);
	const [category, _setCategory] = useState(props.data?.category || '');
	const [symptomsAndSolutions, setSymptomsAndSolutions] = useState(props.data?.data || [{symptom: '', solutions: ['']}]);
	const _getErrors = clean => ({
		category: clean ? false : !Boolean(category.trim()),
		symptomsAndSolutions: symptomsAndSolutions.map(ss => {
			return {
				symptom: clean ? false : !Boolean(ss.symptom.trim()),
				solutions: ss.solutions.map(s => clean ? false : !Boolean(s.trim()))
			};
		})
	});
	const [errors, setErrors] = useState(_getErrors(true));

	const setCategory = val => {
		_setCategory(val);
		setErrors(_getErrors(true));
	};

	const hasErrors = errors => {
		if (errors.category) return true;
		for (let i = 0; i < errors.symptomsAndSolutions.length; i++) {
			const ss = errors.symptomsAndSolutions[i];
			if (ss.symptom) return true;
			if (ss.solutions.some(v => v)) return true;
		}
		return  false
	};

	const { disabled, isLoading } = props;
	const fieldsDisabled = props.data ? (disabled || isLoading || !editMode) : disabled;

	const addSymptomAndSolutions = () => {
		const defaultSymptomAndSolutions = {symptom: '', solutions: ['']};
		const nextState = symptomsAndSolutions.concat(defaultSymptomAndSolutions);
		setSymptomsAndSolutions(nextState);
		setErrors(_getErrors(true));
	};

	const removeSymptomAndSolutions = symptomAndSolutions => {
		const nextState = symptomsAndSolutions.filter(ss => ss !== symptomAndSolutions);
		setSymptomsAndSolutions(nextState);
		setErrors(_getErrors(true));
	};

	const addSolutionForSymptom = (symptomAndSolutions, afterSolutionIndex) => {
		const nextState = symptomsAndSolutions.reduce((acc, currSymptomAndSolutions) => {
			if (symptomAndSolutions === currSymptomAndSolutions) {
				const solutions = currSymptomAndSolutions.solutions.reduce((acc, currSolution, i) => {
					acc.push(currSolution);
					if (i === afterSolutionIndex) acc.push('');
					return acc;
				}, []);
				acc.push({
					...currSymptomAndSolutions,
					solutions
				});
			} else {
				acc.push(currSymptomAndSolutions);
			}
			return acc;
		}, []);
		setSymptomsAndSolutions(nextState);
		setErrors(_getErrors(true));
	};

	const removeSolutionFromSymptom = (solutionIndex, symptomAndSolutions) => {
		const nextState = symptomsAndSolutions.reduce((acc, currSymptomAndSolutions) => {
			if (symptomAndSolutions === currSymptomAndSolutions) {
				const solutions = currSymptomAndSolutions.solutions.filter((s, i) => i !== solutionIndex);
				acc.push({
					...currSymptomAndSolutions,
					solutions
				});
			} else {
				acc.push(currSymptomAndSolutions);
			}
			return acc;
		}, []);
		setSymptomsAndSolutions(nextState);
		setErrors(_getErrors(true));
	};

	const onSymptomFieldChange = (symptomAndSolutions, symptomVal) => {
		const nextState = symptomsAndSolutions.reduce((acc, currSymptomAndSolutions) => {
			if (symptomAndSolutions === currSymptomAndSolutions) {
				acc.push({
					...currSymptomAndSolutions,
					symptom: symptomVal
				});
			} else {
				acc.push(currSymptomAndSolutions);
			}
			return acc;
		}, []);
		setSymptomsAndSolutions(nextState);
		setErrors(_getErrors(true));
	};

	const onSolutionFieldChange = (symptomAndSolutions, solutionIndex, solutionVal) => {
		const nextState = symptomsAndSolutions.reduce((acc, currSymptomAndSolutions) => {
			if (symptomAndSolutions === currSymptomAndSolutions) {
				acc.push({
					...currSymptomAndSolutions,
					solutions: currSymptomAndSolutions.solutions.map((s, i) => {
						if (solutionIndex === i) return solutionVal;
						return s;
					})
				});
			} else {
				acc.push(currSymptomAndSolutions);
			}
			return acc;
		}, []);
		setSymptomsAndSolutions(nextState);
		setErrors(_getErrors(true));
	};

	const changeEditMode = () => {
		setEditMode(!editMode);
	};

	const onCancel = () => {
		setSymptomsAndSolutions(props.data?.data);
		changeEditMode();
	};

	const onSubmit = ev => {
		ev.preventDefault();
		setErrors(_getErrors());
		if (hasErrors(_getErrors())) return;
		const data = {
			category,
			data: symptomsAndSolutions,
		};
		if (props.data) data._id = props.data._id;
		props.onSubmit(data);
		if (props.data) changeEditMode();
	};

	return (
		<form className={CSS.addSolutionForm}
		      action="/api/v1/symptoms-solutions"
		      method="POST"
		      encType="application/json"
		      onSubmit={onSubmit}
		>
			<div>
				<RenderCategorySelector disabled={fieldsDisabled}
				                        errors={errors}
				                        noSelector={Boolean(props.data)}
				                        categories={props.categories}
				                        onCategoryChange={setCategory}
				                        category={props.data?.category}
				                        formatMessage={formatMessage}
				/>
			</div>
			<div className={`${CSS.addSolutionFormItem} ${CSS.symptomSolutionItems}`}>
				<RenderSymptomsSolutions disabled={fieldsDisabled}
				                         errors={errors}
				                         symptomsAndSolutions={symptomsAndSolutions}
				                         onSymptomFieldChange={onSymptomFieldChange}
				                         onSolutionFieldChange={onSolutionFieldChange}
				                         onAddSymptomAndSolutions={addSymptomAndSolutions}
				                         onRemoveSymptomAndSolutions={removeSymptomAndSolutions}
				                         onAddSolutionForSymptom={addSolutionForSymptom}
				                         onRemoveSolutionFromSymptom={removeSolutionFromSymptom}
				                         formatMessage={formatMessage}
				/>
			</div>
			<div className={`${CSS.addSolutionFormItem} ${CSS.submitBtnContainer}`}>
				{isLoading? <CircularProgress className={CSS.prelaoder} size={40} /> : null}
				{
					props.data && !editMode ? (
						<Button disabled={isLoading || disabled}
						        fullWidth
						        type="button"
						        variant="contained"
						        color="primary"
						        onClick={changeEditMode}
						>
							{formatMessage(messages.SolutionFormSubmitBtnEdit)}
						</Button>
					) : null
				}
				{
					props.data && editMode ? (
						<div className={CSS.editModeBtnsContainer}>
							<Button disabled={isLoading || disabled}
							        variant="outlined"
							        color="primary"
							        onClick={onCancel}
							>
								{formatMessage(messages.SolutionFormSubmitBtnCancel)}
							</Button>
							<Button disabled={isLoading || disabled} variant="contained" color="primary" type="submit">
								{formatMessage(messages.SolutionFormSubmitBtnSave)}
							</Button>
						</div>
					) : null
				}
				{
					!props.data ? (
						<Button disabled={isLoading || disabled}
						        fullWidth
						        type="submit"
						        variant="contained"
						        color="primary"
						>
							{formatMessage(messages.SolutionFormSubmitBtnAdd)}
						</Button>
					) : null
				}

			</div>
		</form>
	)
}

SymptomsAndSolutionsForm.propTypes = {
	disabled: PropTypes.bool,
	isLoading: PropTypes.bool,
	symptomsAndSolutions: PropTypes.array,
	onSubmit: PropTypes.func.isRequired,
	data: PropTypes.object
};

function RenderCategorySelector (props) {
	const [catKey, setCatKey] = useState(Math.random());
	const [existMode, setMode] = useState(false);
	const [inputVal, setInputVal] = useState('');
	const [selectVal, setSelectVal] = useState('');
	const inputLabel = useRef(null);
	const [labelWidth, setLabelWidth] = useState(0);

	useEffect(() => {
		setCatKey(Math.random());
		if (!props.noSelector) props.categories?.length && setLabelWidth(inputLabel.current.offsetWidth);
	}, [props.categories?.length]);

	const classes = useStyles();

	const onModeChange = ev => {
		setMode(ev.target.checked);
		const value = ev.target.checked ? selectVal : inputVal;
		props.onCategoryChange(value);
	};

	const onCategoryChange = ev => {
		existMode ? setSelectVal(ev.target.value) : setInputVal(ev.target.value);
		const value = existMode ? selectVal : inputVal;
		props.onCategoryChange(ev.target.value);
	};

	const hasErr = props.errors.category;

	return (
		<FormControl component="fieldset" className={CSS.categoryFieldset}>
			<FormLabel component="legend" className={CSS.categoryLegend}>
				{props.category || props.formatMessage(messages.SolutionFormCatLabel)}
			</FormLabel>
			{
				!props.noSelector ? (
					<div className={CSS.categoryItems}>
						<TextField disabled={existMode || props.disabled}
						           className={!props.categories || !props.categories.length ? classes.minFieldWidth : ''}
						           error={hasErr && !existMode}
						           label={props.formatMessage(messages.SolutionFormCatNewLabel)}
						           placeholder={props.formatMessage(messages.SolutionFormCatNewPlaceholder)}
						           helperText={(hasErr && !existMode) ? props.formatMessage(messages.SolutionFormRequiredErr) : ' '}
						           variant="outlined"
						           onChange={onCategoryChange}
						/>
						{
							props.categories && props.categories.length ? (<React.Fragment>
								<Switch disabled={props.disabled}
								        color="default"
								        checked={existMode}
								        onChange={onModeChange}
								        value={false}
								        className={CSS.categorySwitcher}
								/>
								<div>
									<FormControl variant="outlined" className={classes.marginZero}>
										<InputLabel ref={inputLabel} htmlFor="outlined-age-simple">
											{props.formatMessage(messages.SolutionFormCatExist)}
										</InputLabel>
										<Select disabled={!existMode || props.disabled}
										        error={hasErr && existMode}
										        className={CSS.categoryDropdown}
										        value={selectVal}
										        onChange={onCategoryChange}
										        labelWidth={labelWidth}
										>
											{props.categories.map((category, i) => {
												return <MenuItem key={catKey + i} value={category}>{category}</MenuItem>
											})}
										</Select>
										<FormHelperText>{hasErr && existMode ? props.formatMessage(messages.SolutionFormRequiredErr) : ' '}</FormHelperText>
									</FormControl>
								</div>
							</React.Fragment>) : null
						}

					</div>
				) : null
			}
		</FormControl>
	);
}
RenderCategorySelector.propTypes = {
	disabled: PropTypes.bool,
	noSelector: PropTypes.bool,
	category: PropTypes.string,
	symptomsAndSolutions: PropTypes.array,
	errors: getErrPropTypes(),
	onCategoryChange: PropTypes.func.isRequired
};


function RenderSymptomsSolutions ({formatMessage, disabled, isLoading, ...props}) {
	const classes = useStyles();
	const [solutionKey, setSolutionKey] = useState(Math.random());
	const [symptomKey, setSymptomKey] = useState(Math.random());

	const onSymptomFieldChange = symptomAndSolutions => ev => {
		props.onSymptomFieldChange(symptomAndSolutions, ev.target.value);
	};
	const onSolutionFieldChange = (symptomAndSolutions, solutionIndex) => ev => {
		props.onSolutionFieldChange(symptomAndSolutions, solutionIndex, ev.target.value);
	};
	const removeSymptomAndSolutions = (symptomAndSolutions) => () => {
		props.onRemoveSymptomAndSolutions(symptomAndSolutions);
		setSymptomKey(Math.random());
	};
	const addSolutionForSymptom = (symptomAndSolutions, afterSolutionIndex) => () => {
		props.onAddSolutionForSymptom(symptomAndSolutions, afterSolutionIndex);
		setSolutionKey(Math.random());
	};
	const removeSolutionFromSymptom = (symptomAndSolutions, solutionIndex) => () => {
		props.onRemoveSolutionFromSymptom(solutionIndex, symptomAndSolutions);
		setSolutionKey(Math.random());
	};

	return (
		<React.Fragment>
			{
				props.symptomsAndSolutions.map((item, i) => (
					<React.Fragment key={symptomKey + i}>
						<FormControl component="fieldset">
							<div className={CSS.ssLabelContainer}>
								<FormLabel component="legend">{formatMessage(messages.SolutionFormSSLabel)}</FormLabel>
								<Tooltip title={formatMessage(messages.DeleteSSTooltip)}>
									<IconButton className={classes.gutterL1}
									            disabled={disabled}
									            color="secondary"
									            onClick={removeSymptomAndSolutions(item)}
									>
										<DeleteIcon fontSize="small" />
									</IconButton>
								</Tooltip>
							</div>
							<div className={CSS.symptomSolutionItem}>
								<div className={CSS.symptomSolutionTextFields}>
									<div className={CSS.symptomFieldContainer}>
										<span className={classes.gutterR1}></span>
										<TextField disabled={disabled}
										           className={classes.minFieldWidth}
										           error={props.errors.symptomsAndSolutions[i]?.symptom}
										           defaultValue={item.symptom}
										           fullWidth
										           label={formatMessage(messages.SolutionFormSymptomLabel)}
										           placeholder={formatMessage(messages.SolutionFormSymptomPlaceholder)}
										           helperText={props.errors.symptomsAndSolutions[i]?.symptom ? formatMessage(messages.SolutionFormRequiredErr) : ' '}
										           variant="outlined"
										           onChange={onSymptomFieldChange(item)}
										/>
										<span className={classes.gutterL1}></span>
									</div>
									{
										item.solutions.map((solution, ii) => {
											return (
												<RenderSolutionField key={solutionKey + ii}
												                     error={props.errors.symptomsAndSolutions[i]?.solutions[ii]}
												                     disabled={disabled}
												                     defaultValue={solution}
												                     onSolutionAdd={addSolutionForSymptom(item, ii)}
												                     onSolutionRemove={removeSolutionFromSymptom(item, ii)}
												                     onSolutionFieldChange={onSolutionFieldChange(item, ii)}
												                     disableRemove={item.solutions.length === 1}
												                     formatMessage={formatMessage}
												/>
											);
										})
									}

								</div>
							</div>
						</FormControl>
						<hr />
					</React.Fragment>
				))
			}
			<Tooltip title={formatMessage(messages.AddSSTooltip)}>
				<IconButton className={CSS.addSSBtn} disabled={disabled} color="primary" onClick={props.onAddSymptomAndSolutions}>
					<AddIcon fontSize="small" />
				</IconButton>
			</Tooltip>
		</React.Fragment>
	);
}
RenderSymptomsSolutions.propTypes = {
	disabled: PropTypes.bool,
	errors: getErrPropTypes(),
	symptomsAndSolutions: PropTypes.array,
	onSymptomFieldChange: PropTypes.func.isRequired,
	onSolutionFieldChange: PropTypes.func.isRequired,
	onAddSymptomAndSolutions: PropTypes.func.isRequired,
	onRemoveSymptomAndSolutions: PropTypes.func.isRequired,
	onAddSolutionForSymptom: PropTypes.func.isRequired,
	onRemoveSolutionFromSymptom: PropTypes.func.isRequired,
};

function RenderSolutionField ({formatMessage, disabled, ...props}) {
	const classes = useStyles();

	return (
		<div className={CSS.solutionFieldContainer}>
			<Tooltip title={formatMessage(messages.AddSolutionTooltip)}>
				<IconButton disabled={disabled}
				            className={`${classes.gutterR1} ${CSS.addSolutionBtn}`}
				            color="primary"
				            onClick={props.onSolutionAdd}
				>
					<AddIcon fontSize="small" />
				</IconButton>
			</Tooltip>
			<TextField disabled={disabled}
			           className={classes.minFieldWidth}
			           error={props.error}
			           helperText={props.error ? formatMessage(messages.SolutionFormRequiredErr) : ' '}
			           defaultValue={props.defaultValue}
			           fullWidth
			           label={formatMessage(messages.SolutionFormSolutionLabel)}
			           placeholder={formatMessage(messages.SolutionFormSolutionPlaceholder)}
			           variant="outlined"
			           onChange={props.onSolutionFieldChange}
			/>
			{
				props.disableRemove ? (
					<IconButton disabled={disabled || props.disableRemove}
					            className={`${classes.gutterL1} ${CSS.removeSolutionBtn}`}
					            color="secondary"
					            onClick={props.onSolutionRemove}
					>
						<DeleteIcon fontSize="small" />
					</IconButton>
				) : (
					<Tooltip title={formatMessage(messages.RemoveSolutionTooltip)}>
						<IconButton disabled={disabled || props.disableRemove}
						            className={`${classes.gutterL1} ${CSS.removeSolutionBtn}`}
						            color="secondary"
						            onClick={props.onSolutionRemove}
						>
							<DeleteIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				)
			}
		</div>
	);
}
RenderSolutionField.propTypes = {
	disabled: PropTypes.bool,
	disableRemove: PropTypes.bool,
	error: PropTypes.bool,
	defaultValue: PropTypes.string,
	onSolutionAdd: PropTypes.func.isRequired,
	onSolutionRemove: PropTypes.func.isRequired,
	onSolutionFieldChange: PropTypes.func.isRequired
};

export default injectIntl(SymptomsAndSolutionsForm);
