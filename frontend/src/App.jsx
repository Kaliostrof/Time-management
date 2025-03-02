import styles from './App.module.css';
import { Route, Routes } from 'react-router-dom';
import { Header, Footer, Modal } from './components';
import {
	Authorization,
	Main,
	OneProject,
	OneProjectAnalytics,
	Profile,
	Projects,
	Registration,
} from './pages';
import { useLayoutEffect, useState } from 'react';
import { Analytics } from './pages/analytics/analytics';
import { setUser } from './actions';
import { useDispatch } from 'react-redux';

const App = () => {
	const [mainProjects, setMainProjects] = useState([]);
	const dispatch = useDispatch();

	useLayoutEffect(() => {
		const user = sessionStorage.getItem('userData');
		dispatch(setUser(JSON.parse(user)));
	}, [dispatch]);

	return (
		<>
			<div className={styles.app}>
				<Header />
				<div className={styles.page}>
					<Routes>
						<Route path="/login" element={<Authorization />} />
						<Route
							path="/"
							element={
								<Main
									mainProjects={mainProjects}
									setMainProjects={setMainProjects}
								/>
							}
						/>
						<Route path="/register" element={<Registration />} />
						<Route path="/user/:id" element={<Profile />} />
						<Route
							path="/projects"
							element={
								<Projects
									mainProjects={mainProjects}
									setMainProjects={setMainProjects}
								/>
							}
						/>
						<Route path="/projects/:id" element={<OneProject />} />
						<Route
							path="/analytics"
							element={
								<Analytics
									mainProjects={mainProjects}
									setMainProjects={setMainProjects}
								/>
							}
						/>
						<Route path="/analytics/:id" element={<OneProjectAnalytics />} />
						<Route path="*" element="Такая страница не существует" />
					</Routes>
				</div>
				<Footer />
				<Modal />
			</div>
		</>
	);
};

export default App;
