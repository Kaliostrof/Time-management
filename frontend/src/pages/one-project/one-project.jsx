import { useDispatch, useSelector } from 'react-redux';
import styles from './one-project.module.css';
import { useLayoutEffect, useState } from 'react';
import { request } from '../../utils';
import { saveProjectAsync, setProjectData } from '../../actions';
import { closeModal, openModal, removeTaskAsync } from '../../actions';
import { selectProject } from '../../selectors';
import { Icon, Input, Loader } from '../../components';
import { useNavigate, useParams } from 'react-router-dom';

export const OneProject = () => {
	const params = useParams();
	const [projectTitle, setProjectTitle] = useState('');
	const [isEdit, setIsEdit] = useState(false);
	const [isRefresh, setIsRefresh] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const project = useSelector(selectProject);
	const navigate = useNavigate();

	useLayoutEffect(() => {
		setIsLoading(true);
		request(`/projects/${params.id}`)
			.then(({ data }) => {
				dispatch(setProjectData(data));
				setProjectTitle(project.title);
			})
			.finally(() => setIsLoading(false));
	}, [dispatch, project.title, isRefresh]);

	let totaltime;
	let total = [];
	if (project.tasks.length > 0) {
		project.tasks.map((task) => {
			return total.push(task.time);
		});
		totaltime = total.reduce(
			(sum, el) => {
				let s = sum.s + el.sec;
				let m = sum.m + el.min;
				let h = sum.h + el.hr;
				if (s >= 60) {
					s = s - 60;
					m = m + 1;
					return { s, m, h };
				}
				if (m >= 60) {
					m = m - 60;
					h = h + 1;
					return { s, m, h };
				}
				return { s, m, h };
			},
			{ s: 0, m: 0, h: 0 },
		);
	}

	const onSaveEdit = () => {
		let newTitle = projectTitle;
		if (!newTitle) {
			setIsEdit(false);
			setIsRefresh(!isRefresh);
			return;
		} else {
			dispatch(saveProjectAsync(params.id, { title: newTitle })).then(() => {
				navigate(`/projects/${params.id}`);
				setIsEdit(false);
				setIsRefresh(!isRefresh);
			});
		}
	};

	const onCancelEdit = () => {
		setIsEdit(false);
		setProjectTitle(project.title);
	};

	const onTaskDelete = (id) => {
		const projectId = params.id;
		const taskId = id;
		dispatch(
			openModal({
				text: 'Удалить задачу?',
				onConfirm: () => {
					dispatch(removeTaskAsync(projectId, taskId));
					dispatch(closeModal);
				},
				onCancel: () => dispatch(closeModal),
			}),
		);
		setIsRefresh(!isRefresh);
	};

	return (
		<div>
			{isLoading ? (
				<Loader />
			) : (
				<div className={styles['one-project']}>
					<div className={styles['project-card']}>
						<div className={styles.title}>
							<Input
								disabled={!isEdit}
								value={projectTitle}
								height="25px"
								onChange={(event) => setProjectTitle(event.target.value)}
							></Input>
						</div>

						<div className={styles['total-time']}>
							{totaltime
								? `${totaltime.h} час(ов), ${totaltime.m} минут(а), ${totaltime.s} секунд(ы)`
								: 'Времени не было уделено'}
						</div>
						<div className={styles.icon}>
							{isEdit ? (
								<div className={styles['icon-choise']}>
									<Icon
										id="fa-check-circle-o"
										size="18px"
										margin="0 8px 0 0"
										onClick={onSaveEdit}
									/>
									<Icon
										id="fa-times-circle-o"
										size="18px"
										margin="0 8px 0 0"
										onClick={onCancelEdit}
									/>
								</div>
							) : (
								<Icon
									id="fa-pencil-square-o"
									size="18px"
									margin="0 8px 0 0"
									onClick={() => setIsEdit(true)}
								/>
							)}
						</div>
					</div>
					{project.tasks.length > 0 ? (
						<div className={styles['task-list']}>
							{project.tasks.map((task) => {
								const { sec, min, hr } = task.time;
								const time = `${hr} часов, ${min} минут, ${sec} секунд(ы)`;

								return (
									<div key={task.id} className={styles.task}>
										<div> {task.description}</div>
										<div> {time}</div>

										<Icon
											id="fa-trash-o"
											size="18px"
											margin="0 8px 0 0"
											onClick={() => onTaskDelete(task.id)}
										/>
									</div>
								);
							})}
						</div>
					) : (
						<div> Пока никаких задач не выполнено </div>
					)}
				</div>
			)}
		</div>
	);
};
