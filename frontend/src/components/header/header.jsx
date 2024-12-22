import styles from './header.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { selectUserId, selectUserLogin } from '../../selectors';
import { Icon } from '../icon/icon';
import { logout } from '../../actions';

export const Header = () => {
	let login = useSelector(selectUserLogin);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userId = useSelector(selectUserId);

	const onOpenProfile = () => {
		navigate(`/user/${userId}`);
	};

	const onLogout = () => {
		dispatch(logout());
		sessionStorage.removeItem('userData');
		navigate('/login');
	};

	return (
		<div className={styles.header}>
			<div className={styles.content}>
				<div className={styles.navigation}>
					<button type="button" name="button" className={styles['nav-btn']}>
						<NavLink
							id="main"
							style={({ isActive }) => ({
								textDecoration: isActive ? 'underline' : '',
							})}
							to="/"
						>
							Главная
						</NavLink>
					</button>
					<button type="button" name="button" className={styles['nav-btn']}>
						<NavLink
							id="projects"
							style={({ isActive }) => ({
								textDecoration: isActive ? 'underline' : '',
							})}
							to="/projects"
						>
							Проекты
						</NavLink>
					</button>
					<button type="button" name="button" className={styles['nav-btn']}>
						<NavLink
							id="analytics"
							style={({ isActive }) => ({
								textDecoration: isActive ? 'underline' : '',
							})}
							to="/analytics"
						>
							Аналитика
						</NavLink>
					</button>
				</div>
				{userId && (
					<div className={styles.user}>
						<div>{login}</div>
						<div className={styles.dropdown}>
							<button className={styles['dropdown-btn']}>
								<Icon id="fa-user-circle" margin=" 0 10px 0 10px" />
							</button>
							<div className={styles['dropdown-list']}>
								<button
									className={styles['list-btn']}
									onClick={onOpenProfile}
								>
									Профиль
								</button>
								<button className={styles['list-btn']} onClick={onLogout}>
									Выйти
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className={styles.border}></div>
		</div>
	);
};
