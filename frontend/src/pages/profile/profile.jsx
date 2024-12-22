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
	const [isPasswordEdit, setIsPasswordEdit] = useState(false);
	const dispatch = useDispatch();
	const userId = useSelector(selectUserId);
	const userLogin = useSelector(selectUserLogin);
	const userDateOfBirth = useSelector(selectUserDateOfBirth)
		.split('.')
		.reverse()
		.join('-');

	const [login, setLogin] = useState(userLogin);
	const [birthDate, setBirthDate] = useState(userDateOfBirth);
	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');
	const [error, setError] = useState(null);

	useEffect(() => {
		const userData = sessionStorage.getItem('userData');
		if (!userData) {
			return;
		}
	}, []);

	const onLoginChange = ({ target }) => {
		setLogin(target.value);

		const newError = validateAndGetErrorMessage(loginChangeSchema, target.value);
		setError(newError);
	};
	const onLoginBlur = ({ target }) => {
		const newError = validateAndGetErrorMessage(loginBlurSchema, target.value);

		setError(newError);
	};

	const onSaveLogin = () => {
		request(`/users/${userId}/login`, 'PATCH', { login }).then(({ error, user }) => {
			if (error) {
				setServerError(`Ошибка запроса: ${error}`);
				return;
			}
			dispatch(setUser(user));
			setIsLoginEdit(false);
			sessionStorage.setItem('userData', JSON.stringify(user));
		});
	};

	const onBirthDateChange = ({ target }) => {
		const date = target.value.split('.').reverse().join('-');
		setBirthDate(date);
	};
	const onSaveBirthDate = () => {
		request(`/users/${userId}/date`, 'PATCH', { dateOfBirth: birthDate }).then(
			({ error, user }) => {
				if (error) {
					setServerError(`Ошибка запроса: ${error}`);
					return;
				}
				dispatch(setUser(user));
				setIsDateEdit(false);
				sessionStorage.setItem('userData', JSON.stringify(user));
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
		setIsPasswordEdit(true);
		request(`/users/${userId}/password`, 'PATCH', {
			login,
			oldPassword,
			newPassword,
		}).then(({ error }) => {
			if (error) {
				setServerError(`Ошибка запроса: ${error}`);
				setIsPasswordEdit(false);
				return;
			}
			setIsPasswordEdit(false);
			setError('Пароль изменён');
			setOldPassword('');
			setNewPassword('');
			setRepeatPassword('');
			// dispatch(setUser(user));
			// sessionStorage.setItem('userData', JSON.stringify(user));
		});
	};

	const onCancelDateEdit = () => {
		setIsDateEdit(false);
	};

	const onCancelLoginEdit = () => {
		setIsLoginEdit(false);
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
									disabled={!!error}
									onClick={onSaveLogin}
								/>

								<Icon
									id="fa-times-circle-o"
									size="18px"
									margin="0 8px 0 0"
									onClick={onCancelLoginEdit}
								/>
							</div>
						) : (
							<Icon
								id="fa-pencil-square-o"
								size="18px"
								margin="0 8px 0 0"
								onClick={() => setIsLoginEdit(true)}
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
						value={birthDate}
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
									disabled={!!error}
									onClick={onSaveBirthDate}
								/>
								<Icon
									id="fa-times-circle-o"
									size="18px"
									margin="0 8px 0 0"
									onClick={onCancelDateEdit}
								/>
							</div>
						) : (
							<Icon
								id="fa-pencil-square-o"
								size="18px"
								margin="0 8px 0 0"
								onClick={() => setIsDateEdit(true)}
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
						disabled={!!error || isPasswordEdit}
					>
						Изменить пароль
					</Button>
				</form>
			</div>

			{errorMessage && <AuthFormError>{errorMessage}</AuthFormError>}
		</div>
	);
};
