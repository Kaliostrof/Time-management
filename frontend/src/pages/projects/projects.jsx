import { useDispatch, useSelector } from 'react-redux';
import styles from './projects.module.css';
import { useEffect, useMemo, useState } from 'react';
import { debounce, request } from '../../utils';
import { PAGINATION_LIMIT } from '../../constants';
import { Pagination, Search, AddNewProject, ProjectList } from './components';
import {
	closeModal,
	createProjectAsync,
	openModal,
	removeProjectAsync,
} from '../../actions';
import { useNavigate } from 'react-router-dom';
import { selectUserLogin } from '../../selectors';
import { Loader } from '../../components';

export const Projects = ({ mainProjects, setMainProjects }) => {
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState([]);
	const [shouldSearch, setShouldSearch] = useState(false);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [projectTitle, setProjectTitle] = useState('');
	const [isRefresh, setIsRefresh] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const isUser = useSelector(selectUserLogin);
	const navigate = useNavigate();

	useEffect(() => {
		if (isUser) {
			setIsLoading(true);
			request(
				`/projects/?search=${searchPhrase}&page=${page}&limit=${PAGINATION_LIMIT}`,
			)
				.then(({ data: { projects, lastPage } }) => {
					setMainProjects(projects);
					setLastPage(lastPage);
				})
				.finally(() => setIsLoading(false));
		} else {
			navigate('/login');
		}
	}, [page, shouldSearch, setMainProjects, isRefresh]);

	const startDelayedSearch = useMemo(() => debounce(setShouldSearch, 2000), []);

	const onCreate = () => {
		dispatch(createProjectAsync({ title: projectTitle })).then(() => {
			setProjectTitle('');
			setIsRefresh(!isRefresh);
		});
	};

	const onSearch = ({ target }) => {
		setSearchPhrase(target.value);
		startDelayedSearch(!shouldSearch);
	};

	const onProjectDelete = (id) => {
		dispatch(
			openModal({
				text: 'Удалить проект?',
				onConfirm: () => {
					dispatch(removeProjectAsync(id));
					dispatch(closeModal);
					setIsRefresh(!isRefresh);
				},
				onCancel: () => dispatch(closeModal),
			}),
		);
	};

	return (
		<div className={styles['main-projects']}>
			<div className={styles.head}>
				<h2>Все проекты</h2>
				<AddNewProject
					onCreate={onCreate}
					projectTitle={projectTitle}
					setProjectTitle={setProjectTitle}
				/>
			</div>
			{isLoading ? (
				<Loader />
			) : (
				<div className={styles['list-and-search']}>
					<Search searchPhrase={searchPhrase} onChange={onSearch} />
					{mainProjects.length > 0 ? (
						<div className={styles['project-list']}>
							{mainProjects.map(({ id, title, publishedAt }) => (
								<ProjectList
									key={id}
									id={id}
									title={title}
									publishedAt={publishedAt}
									onDelete={onProjectDelete}
								/>
							))}
						</div>
					) : (
						<div className={styles['no-projects']}>Проекты не найдены</div>
					)}
				</div>
			)}
			{lastPage > 1 && mainProjects.length > 0 && (
				<Pagination page={page} lastPage={lastPage} setPage={setPage} />
			)}
		</div>
	);
};
