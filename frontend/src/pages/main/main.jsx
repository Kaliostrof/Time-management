import { useLayoutEffect, useState } from 'react';
import Select from 'react-select';
import styles from './main.module.css';
import { Button, Icon, Loader } from '../../components';
import { request } from '../../utils';
import { useDispatch } from 'react-redux';
// import { selectUserLogin } from '../../selectors';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '../../components/tooltip/tooltip';
import { AddNewProject } from '../projects/components';
import { createProjectAsync } from '../../actions';

export const Main = ({ mainProjects, setMainProjects }) => {
	const [selectedOption, setSelectedOption] = useState(null);
	const [time, setTime] = useState({ sec: 0, min: 0, hr: 0 });
	const [intervalId, setIntervalId] = useState();
	const [isPlay, setIsPlay] = useState(false);
	const [task, setTask] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [projectTitle, setProjectTitle] = useState('');
	const [isRefresh, setIsRefresh] = useState(false);
	// const isUser = useSelector(selectUserLogin);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = sessionStorage.getItem('userData');

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
	}, [setMainProjects, isRefresh]);

	const projectsOption = mainProjects.map((project) => {
		return { value: project.title, label: project.title, id: project.id };
	});

	const onCreate = () => {
		dispatch(createProjectAsync({ title: projectTitle })).then(() => {
			setProjectTitle('');
			setIsRefresh(!isRefresh);
		});
	};

	const timer = () => {
		setTime((prev) => {
			let newTime = { ...prev };

			if (newTime.sec < 59) newTime.sec += 1;
			else {
				newTime.min += 1;
				newTime.sec = 0;
			}

			if (newTime.min === 60) {
				newTime.min = 0;
				newTime.hr += 1;
			}

			return newTime;
		});
	};

	const onAddTask = ({ target }) => {
		setTask(target.value);
	};

	const onPlay = () => {
		if (!intervalId && selectedOption && task) {
			setIsPlay(true);
			let interval = setInterval(timer, 1000);
			setIntervalId(interval);
		}
	};

	const onPause = () => {
		setIsPlay(false);
		clearInterval(intervalId);
		setIntervalId('');
	};

	const onStop = (event) => {
		if (isPlay) {
			setIsPlay(false);
			let hr = time.hr;
			let min = time.min;
			let sec = time.sec;
			if (hr > 0) {
				min = min + hr * 60;
			}
			if (min > 0) {
				sec = sec + min * 60;
			}
			const totalSec = sec;
			event.preventDefault();
			request(`/projects/${selectedOption.id}/tasks`, 'POST', {
				task,
				time,
				totalSec,
			});
			setTask('');
			setIntervalId('');
			clearInterval(intervalId);
			setTime({ sec: 0, min: 0, hr: 0 });
		}
	};

	return (
		<div>
			{isLoading ? (
				<Loader />
			) : (
				<div className={styles.card}>
					{!user && (
						<Button
							type="button"
							width="170px"
							onClick={() => navigate('/login')}
						>
							<Icon
								id="fa-arrow-circle-right"
								size="28px"
								margin="0 8px 0 0"
							/>
							Авторизация
						</Button>
					)}
					<div className={styles['new-project']}>
						<AddNewProject
							onCreate={onCreate}
							projectTitle={projectTitle}
							setProjectTitle={setProjectTitle}
							user={user}
						/>
					</div>
					<div className={styles.timer}>
						<div className={styles.text}>
							{`${time.hr.toString().padStart(2, '0')}:${time.min.toString().padStart(2, '0')}:${time.sec.toString().padStart(2, '0')}`}
						</div>
						<div className={styles.buttons}>
							<Tooltip text="Выберите проект и заполните описание">
								<Icon
									id="fa-play-circle-o"
									margin=" 0 10px 0 10px"
									onClick={onPlay}
									disabled={isPlay}
								/>
							</Tooltip>
							<Tooltip customClass={styles['tooltip-min']} text="Пауза">
								<Icon
									id="fa-pause-circle-o"
									margin=" 0 10px 0 10px"
									onClick={onPause}
									disabled={!isPlay}
								/>
							</Tooltip>
							<Tooltip text="Завершает таймер и сохраняет данные">
								<Icon
									id="fa-stop-circle-o"
									margin=" 0 10px 0 10px"
									onClick={onStop}
									disabled={!isPlay}
								/>
							</Tooltip>
						</div>
					</div>
					<Select
						defaultValue={selectedOption}
						onChange={setSelectedOption}
						options={projectsOption}
						className={styles.select}
						placeholder="Выберите проект"
						noOptionsMessage={() => 'У вас пока нет проектов'}
					/>
					<textarea
						className={styles.task}
						value={task}
						onChange={onAddTask}
						placeholder="Добавьте описание задачи"
					></textarea>
				</div>
			)}
		</div>
	);
};
