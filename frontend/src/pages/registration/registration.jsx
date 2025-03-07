import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './registration.module.css';
import { useEffect, useState } from 'react';
import { AuthFormError, Button, Input } from '../../components';
import { request } from '../../utils';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { setUser } from '../../actions';
import { selectUserLogin } from '../../selectors';
import { Navigate } from 'react-router-dom';

const regFormSchema = yup.object().shape({
	login: yup
		.string()
		.required('Заполните логин')
		.matches(/^\w+$/, 'Неверно заполнен логин. Допускаются только буквы и цифры.')
		.min(3, 'Неверно заполнен логин. Минимум 3 символа.')
		.max(15, 'Неверно заполнен логин. Мвусимум 15 символов.'),
	dateOfBirth: yup.string().required('Заполните дату рождения'),
	password: yup
		.string()
		.required('Заполните пароль')
		.matches(
			/^[\w#%]+$/,
			'Неверно заполнен пароль. Допускаются только буквы и цифры.',
		)
		.min(6, 'Неверно заполнен пароль. Минимум 6 символов.')
		.max(20, 'Неверно заполнен пароль. Максимум 20 символа.'),
	passcheck: yup
		.string()
		.required('Заполните пароль')
		.oneOf([yup.ref('password'), null], 'Повтор пароля не совпадает'),
});

export const Registration = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			login: '',
			dateOfBirth: '',
			password: '',
			passcheck: '',
		},
		resolver: yupResolver(regFormSchema),
	});
	const [serverError, setServerError] = useState(null);
	const dispatch = useDispatch();
	const userLogin = useSelector(selectUserLogin);
	const store = useStore();

	useEffect(() => {
		let currentWasLogout = store.getState().app.wasLogout;

		return store.subscribe(() => {
			let prevWasLogout = currentWasLogout;
			currentWasLogout = store.getState().app.wasLogout;

			if (currentWasLogout !== prevWasLogout) {
				reset();
			}
		});
	}, [reset, store]);

	const onSubmit = ({ login, password, dateOfBirth }) => {
		request('/register', 'POST', { login, password, dateOfBirth }).then(
			({ error, user }) => {
				if (error) {
					setServerError(`Ошибка запроса: ${error}`);
					return;
				}
				dispatch(setUser(user));
				sessionStorage.setItem('userData', JSON.stringify(user));
			},
		);
	};

	const formError =
		errors?.login?.message ||
		errors?.password?.message ||
		errors?.dateOfBirth?.message ||
		errors?.passcheck?.message;
	const errorMessage = formError || serverError;

	if (userLogin) {
		return <Navigate to="/" />;
	}

	return (
		<div className={styles.main}>
			<h2 className={styles.title}>Регистрация</h2>
			<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
				<Input
					height="20px"
					width="250px"
					margin="0 0 10px 0"
					type="login"
					placeholder="Логин"
					{...register('login', { onChange: () => setServerError(null) })}
				/>
				<Input
					height="20px"
					width="250px"
					margin="0 0 10px 0"
					mask="00.00.0000"
					type="date"
					placeholder="Дата рождения"
					{...register('dateOfBirth', { onChange: () => setServerError(null) })}
				/>
				<Input
					height="20px"
					width="250px"
					margin="0 0 10px 0"
					type="password"
					placeholder="Пароль"
					{...register('password', { onChange: () => setServerError(null) })}
				/>
				<Input
					height="20px"
					width="250px"
					margin="0 0 10px 0"
					type="password"
					placeholder="Повтор пароль"
					{...register('passcheck', { onChange: () => setServerError(null) })}
				/>
				<Button
					type="submit"
					className={styles.btn}
					width="200px"
					disabled={!!formError}
				>
					Зарегистрироваться
				</Button>
				{errorMessage && <AuthFormError>{errorMessage}</AuthFormError>}
			</form>
		</div>
	);
};
