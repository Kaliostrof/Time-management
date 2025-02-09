import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import styles from './analytics.module.css';
import { Link, useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { selectUserLogin } from '../../selectors';
import { useLayoutEffect, useState } from 'react';
import { Icon, Loader } from '../../components';
import { request } from '../../utils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
	responsive: true,
	plugins: {
		legend: {
			position: 'top',
		},
		title: {
			display: true,
			text: 'Все проекты',
		},
	},
};

export const Analytics = ({ mainProjects, setMainProjects }) => {
	let labels = [];
	let time = [];
	let taskCount = [];
	const [isLoading, setIsLoading] = useState(false);
	// const isUser = useSelector(selectUserLogin);
	const navigate = useNavigate();

	useLayoutEffect(() => {
		const usr = sessionStorage.getItem('userData');
		if (usr) {
			setIsLoading(true);
			request('/projects', 'GET')
				.then(({ data: { projects } }) => {
					setMainProjects(projects);
				})
				.finally(() => setIsLoading(false));
		} else {
			navigate('/login');
		}
	}, [setMainProjects]);

	if (mainProjects.length > 0) {
		mainProjects.map((project) => {
			labels.push(project.title);
			if (project.tasks.length > 0) {
				taskCount.push(project.tasks.length);
				time.push(
					project.tasks.reduce((sum, task) => {
						return sum + task.totalSec;
					}, 0),
				);
			} else {
				taskCount.push(0);
				time.push(0);
			}
		});
	}

	const dataTime = {
		labels,
		datasets: [
			{
				label: 'Уделённое время',
				data: time,
				backgroundColor: 'rgba(168, 0, 11, 0.8)',
				borderColor: 'rgba(0, 0, 0, 0)',
				color: 'rgba(0, 0, 0, 0)',
			},
		],
	};

	const dataTaskCount = {
		labels,
		datasets: [
			{
				label: 'Кол-во задач',
				data: taskCount,
				backgroundColor: 'rgba(0, 94, 2, 1)',
				borderColor: 'rgba(0, 0, 0, 0)',
				color: 'rgba(0, 0, 0, 0)',
			},
		],
	};

	return (
		<div>
			{isLoading ? (
				<Loader />
			) : (
				<div className={styles['analytics-main']}>
					{mainProjects.length > 0 ? (
						<div className={styles['bar-card']}>
							<div className={styles['task-card']}>
								<div className={styles.header}>
									<div>Аналитика по проектам</div>
									<Icon
										id="fa-angle-double-down"
										margin=" -2px 10px 0 10px"
									/>
								</div>
								<div className={styles['task-list']}>
									{mainProjects.map((project) => {
										return (
											<ul key={project.id}>
												<Link to={`/analytics/${project.id}`}>
													{project.title}
												</Link>
											</ul>
										);
									})}
								</div>
							</div>
							<div>
								<div className={styles['div-bar']}>
									<Bar
										options={options}
										data={dataTime}
										className={styles.bar}
									/>
								</div>
								<div className={styles['div-bar']}>
									<Bar
										options={options}
										data={dataTaskCount}
										className={styles.bar}
									/>
								</div>
							</div>
						</div>
					) : (
						<div className={styles['no-data']}>
							Увы, нет проектов, по которым можно сделать аналитику
						</div>
					)}
				</div>
			)}
		</div>
	);
};
