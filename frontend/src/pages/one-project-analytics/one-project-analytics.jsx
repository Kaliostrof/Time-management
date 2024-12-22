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
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectProject } from '../../selectors';
import { Button, Icon } from '../../components';
import { useLayoutEffect } from 'react';
import { request } from '../../utils';
import { setProjectData } from '../../actions';
import styles from './one-project-analytics.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
	responsive: true,
	plugins: {
		legend: {
			position: 'top',
		},
		title: {
			display: true,
		},
	},
};

export const OneProjectAnalytics = () => {
	const params = useParams();
	const dispatch = useDispatch();
	const project = useSelector(selectProject);
	const navigate = useNavigate();

	useLayoutEffect(() => {
		request(`/projects/${params.id}`).then(({ data }) => {
			dispatch(setProjectData(data));
		});
	}, [dispatch]);

	let labels = [];
	let time = [];
	if (project.tasks.length > 0) {
		project.tasks.map((task) => {
			labels.push(task.description);
			time.push(task.totalSec);
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

	return (
		<div className={styles['analytics-main']}>
			<div className={styles['back-arrow']}>
				<Button
					type="button"
					width="110px"
					onClick={() => navigate('/analytics')}
				>
					<Icon id="fa-arrow-circle-left" size="28px" margin="0 8px 0 0" />
					Назад
				</Button>
			</div>
			{project.tasks.length > 0 ? (
				<div className={styles['bar-card']}>
					<div className={styles.header}>{project.title}</div>
					<div className={styles['div-bar']}>
						<Bar options={options} data={dataTime} className={styles.bar} />
					</div>
				</div>
			) : (
				<div className={styles['no-data']}>Ни одной выполненной задачи...</div>
			)}
		</div>
	);
};
