import { useDispatch, useSelector } from 'react-redux';
import styles from './profile.module.css';
import * as yup from 'yup';
import { selectUserDateOfBirth, selectUserId, selectUserLogin } from '../../selectors';
import { useEffect, useState } from 'react';
import { Button, Icon } from '../../components';
import { AuthFormError } from '../../components';
import { request } from '../../utils';
import { setUser } from '../../actions';

const loginChangeSchema = yup
	.string()
	.matches(/^\w+$/, 'Неверно заполнен логин. Допускаются только буквы и цифры.')
	.max(15, 'Неверно заполнен логин. Максимум 15 символов.');
const loginBlurSchema = yup
	.string()
	.required('Заполните логин')
	.min(3, 'Неверно заполнен логин. Минимум 3 символа.');

const passwordChangeSchema = yup
	.string()
	.matches(/^[\w#%]+$/, 'Неверно заполнен пароль. Допускаются только буквы и цифры.')
	.max(20, 'Неверно заполнен пароль. Максимум 20 символов.');

const passwordBlurSchema = yup
	.string()
	.required('Заполните пароль')
	.min(6, 'Неверно заполнен пароль. Минимум 6 символов.');

const validateAndGetErrorMessage = (schema, value) => {
	let errorMessage = null;

	try {
		schema.validateSync(value);
	} catch ({ errors }) {
		errorMessage = errors.reduce((message, error) => message + error + ' ').trim();
	}

	return errorMessage;
};

export const Profile = () => {
	const [serverError, setServerError] = useState(null);
	const [isLoginEdit, setIsLoginEdit] = useState(false);
	const [isDateEdit, setIsDateEdit] = useState(false);
	const dispatch = useDispatch();
	const userId = useSelector(selectUserId);
	const userLogin = useSelector(selectUserLogin);
	const userDateOfBirth = useSelector(selectUserDateOfBirth)
		.split('.')
		.reverse()
		.join('-');

	const [login, setLogin] = useState('');
	const [checkLogin, setCheckLogin] = useState(false);
	const [checkBirthDate, setCheckBirthDate] = useState(false);
	const [birthDate, setBirthDate] = useState();
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');
	const [error, setError] = useState(null);
	const [isRefresh, setIsRefresh] = useState(false);

	useEffect(() => {
		const userData = sessionStorage.getItem('userData');
		if (!userData) {
			return;
		} else {
			const user = JSON.parse(userData);
			setLogin(user.login);
			setBirthDate(user.dateOfBirth);
		}
	}, [isRefresh]);

	const onLoginChange = ({ target }) => {
		if (target.value !== userLogin) {
			setCheckLogin(true);
		} else {
			setCheckLogin(false);
		}
		setLogin(target.value);

		const newError = validateAndGetErrorMessage(loginChangeSchema, target.value);
		setError(newError);
	};
	const onLoginBlur = ({ target }) => {
		const newError = validateAndGetErrorMessage(loginBlurSchema, target.value);

		setError(newError);
	};

	const onSaveLogin = () => {
		if (!!error || !checkLogin) {
			return;
		}
		request(`/users/${userId}/login`, 'PATCH', { login }).then(({ error, data }) => {
			if (error) {
				setServerError(`Ошибка запроса: ${error}`);
				return;
			}
			dispatch(setUser(data));
			setCheckLogin(false);
			setIsLoginEdit(false);
			setIsRefresh(!isRefresh);
			sessionStorage.setItem('userData', JSON.stringify(data));
		});
	};

	const onBirthDateChange = ({ target }) => {
		const date = target.value.split('.').reverse().join('-');
		if (date !== userDateOfBirth) {
			setCheckBirthDate(true);
		} else {
			setCheckBirthDate(false);
		}

		setBirthDate(date);
	};
	const onSaveBirthDate = () => {
		if (!!error || !checkBirthDate) {
			return;
		}
		request(`/users/${userId}/date`, 'PATCH', { dateOfBirth: birthDate }).then(
			({ error, data }) => {
				if (error) {
					setServerError(`Ошибка запроса: ${error}`);
					return;
				}
				dispatch(setUser(data));
				setIsDateEdit(false);
				setIsRefresh(!isRefresh);
				sessionStorage.setItem('userData', JSON.stringify(data));
			},
		);
	};

	const onOldPasswordChange = ({ target }) => {
		setOldPassword(target.value);

		const newError = validateAndGetErrorMessage(passwordChangeSchema, target.value);
		setError(newError);
	};
	const onNewPasswordChange = ({ target }) => {
		setNewPassword(target.value);

		const newError = validateAndGetErrorMessage(passwordChangeSchema, target.value);
		setError(newError);
	};
	const onRepeatPasswordChange = ({ target }) => {
		setRepeatPassword(target.value);

		const newError = validateAndGetErrorMessage(passwordChangeSchema, target.value);
		setError(newError);
	};
	const onPasswordBlur = ({ target }) => {
		const newError = validateAndGetErrorMessage(passwordBlurSchema, target.value);

		setError(newError);
	};
	const onRepeatPasswordBlur = ({ target }) => {
		const newError = validateAndGetErrorMessage(passwordBlurSchema, target.value);
		setError(newError);

		if (repeatPassword !== newPassword) {
			setError('Введённые пароли не совпадают!');
		}
	};

	const onSavePassword = () => {
		event.preventDefault();
		request(`/users/${userId}/password`, 'PATCH', {
			login,
			oldPassword,
			newPassword,
		}).then(({ error }) => {
			if (error) {
				setServerError(`Ошибка запроса: ${error}`);
				return;
			} else {
				setOldPassword('');
				setNewPassword('');
				setRepeatPassword('');
				setError('Пароль изменён!');
			}
		});
	};

	const dateEdit = () => {
		if (isLoginEdit || oldPassword || newPassword || repeatPassword) {
			return;
		}
		setIsDateEdit(true);
	};

	const loginEdit = () => {
		if (isDateEdit || oldPassword || newPassword || repeatPassword) {
			return;
		}
		setIsLoginEdit(true);
	};

	const errorMessage = error || serverError;

	return (
		<div className={styles.card}>
			<h2 className={styles.title}>Профиль</h2>
			<form className={styles.form}>
				<div className={styles['input-form']}>
					<input
						className={styles.input}
						type="login"
						value={login}
						onChange={onLoginChange}
						onBlur={onLoginBlur}
						disabled={!isLoginEdit}
					/>
					<div className={styles.buttons}>
						{isLoginEdit ? (
							<div className={styles['icon-choise']}>
								<Icon
									id="fa-check-circle-o"
									size="18px"
									margin="0 8px 0 0"
									disabled={!!error || !checkLogin}
									onClick={onSaveLogin}
								/>

								<Icon
									id="fa-times-circle-o"
									size="18px"
									margin="0 8px 0 0"
									onClick={() => {
										setIsLoginEdit(false);
										setLogin(userLogin);
									}}
								/>
							</div>
						) : (
							<Icon
								id="fa-pencil-square-o"
								size="18px"
								margin="0 8px 0 0"
								disabled={
									isDateEdit ||
									oldPassword ||
									newPassword ||
									repeatPassword
								}
								onClick={loginEdit}
							/>
						)}
					</div>
				</div>
			</form>
			<form className={styles.form}>
				<div className={styles['input-form']}>
					<input
						mask="00.00.0000"
						className={styles.input}
						type="date"
						value={birthDate || userDateOfBirth}
						onChange={onBirthDateChange}
						disabled={!isDateEdit}
					/>
					<div className={styles.buttons}>
						{isDateEdit ? (
							<div className={styles['icon-choise']}>
								<Icon
									id="fa-check-circle-o"
									size="18px"
									margin="0 8px 0 0"
									type="submit"
									disabled={!!error || !checkBirthDate}
									onClick={onSaveBirthDate}
								/>
								<Icon
									id="fa-times-circle-o"
									size="18px"
									margin="0 8px 0 0"
									onClick={() => {
										setIsDateEdit(false);
										setBirthDate(userDateOfBirth);
									}}
								/>
							</div>
						) : (
							<Icon
								id="fa-pencil-square-o"
								size="18px"
								margin="0 8px 0 0"
								disabled={
									isLoginEdit ||
									oldPassword ||
									newPassword ||
									repeatPassword
								}
								onClick={dateEdit}
							/>
						)}
					</div>
				</div>
			</form>
			<div className={styles['password-form']}>
				<form className={styles.form}>
					<input
						className={styles.input}
						type="password"
						value={oldPassword}
						placeholder="Старый пароль"
						onChange={onOldPasswordChange}
						onBlur={onPasswordBlur}
					/>
					<input
						className={styles.input}
						type="password"
						placeholder="Новый пароль"
						value={newPassword}
						onChange={onNewPasswordChange}
						onBlur={onPasswordBlur}
					/>
					<input
						className={styles.input}
						type="password"
						placeholder="Повтор пароль"
						value={repeatPassword}
						onChange={onRepeatPasswordChange}
						onBlur={onRepeatPasswordBlur}
					/>
					<Button
						type="submit"
						width="175px"
						onClick={onSavePassword}
						disabled={
							!!error ||
							!(oldPassword && newPassword && repeatPassword) ||
							isLoginEdit ||
							isDateEdit
						}
					>
						Изменить пароль
					</Button>
				</form>
			</div>

			{errorMessage && <AuthFormError>{errorMessage}</AuthFormError>}
		</div>
	);
};
