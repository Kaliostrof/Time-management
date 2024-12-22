import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './authorization.module.css';
import { useEffect, useState } from 'react';
import { AuthFormError, Button, Input } from '../../components';
import { Link, useNavigate } from 'react-router-dom';
import { request } from '../../utils';
import { useDispatch, useStore } from 'react-redux';
import { setUser } from '../../actions';
// import { selectUserLogin } from '../../selectors';

const authFormSchema = yup.object().shape({
	login: yup
		.string()
		.required('Заполните логин')
		.matches(/^\w+$/, 'Неверно заполнен логин. Допускаются только буквы и цифры.')
		.min(3, 'Неверно заполнен логин. Минимум 3 символа.')
		.max(15, 'Неверно заполнен логин. Максимум 15 символов.'),
	password: yup
		.string()
		.required('Заполните пароль')
		.matches(
			/^[\w#%]+$/,
			'Неверно заполнен пароль. Допускаются только буквы и цифры.',
		)
		.min(6, 'Неверно заполнен пароль. Минимум 3 символа.')
		.max(20, 'Неверно заполнен пароль. Максимум 20 символов.'),
});

export const Authorization = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			login: '',
			password: '',
		},
		resolver: yupResolver(authFormSchema),
	});
	const [serverError, setServerError] = useState(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();

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

	const onSubmit = ({ login, password }) => {
		request('/login', 'POST', { login, password }).then(({ error, user }) => {
			if (error) {
				setServerError(`Ошибка запроса: ${error}`);
				return;
			}
			dispatch(setUser(user));
			sessionStorage.setItem('userData', JSON.stringify(user));
			navigate('/');
		});
	};

	const formError = errors?.login?.message || errors?.password?.message;
	const errorMessage = formError || serverError;

	// if (userLogin) {
	// 	return <Navigate to="/" />;
	// }

	return (
		<div className={styles.main}>
			<h2 className={styles.title}>Авторизация</h2>
			<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
				<Input
					type="login"
					height="20px"
					width="250px"
					margin="0 0 10px 0"
					placeholder="Логин"
					{...register('login', { onChange: () => setServerError(null) })}
				/>
				<Input
					height="20px"
					width="250px"
					margin="0 0 20px 0"
					type="password"
					placeholder="Пароль"
					{...register('password', { onChange: () => setServerError(null) })}
				/>
				<Button type="submit" disabled={!!formError}>
					Авторизоваться
				</Button>
				{errorMessage && <AuthFormError>{errorMessage}</AuthFormError>}
				<Link to="/register" className={styles.link}>
					Регистрация
				</Link>
			</form>
		</div>
	);
};
