import { useDispatch } from 'react-redux';
import styles from './projects.module.css';
import { useLayoutEffect, useMemo, useState } from 'react';
import { debounce, request } from '../../utils';
import { PAGINATION_LIMIT } from '../../constants';
import { Pagination, Search, ProjectList } from './components';
import { closeModal, openModal, removeProjectAsync } from '../../actions';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components';

export const Projects = ({ mainProjects, setMainProjects }) => {
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState([]);
	const [shouldSearch, setShouldSearch] = useState(false);
	const [searchPhrase, setSearchPhrase] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useLayoutEffect(() => {
		const usr = sessionStorage.getItem('userData');
		if (usr) {
			setIsLoading(true);
			request(
				`/projects/?search=${searchPhrase}&page=${page}&limit=${PAGINATION_LIMIT}`,
			)
				.then(({ data: { projects, lastPage }, error }) => {
					if (error) {
						alert(error);
					}
					setMainProjects(projects);
					setLastPage(lastPage);
				})
				.finally(() => setIsLoading(false));
		} else {
			navigate('/login');
		}
	}, [page, shouldSearch, setMainProjects]);

	const startDelayedSearch = useMemo(() => debounce(setShouldSearch, 2000), []);

	const onSearch = ({ target }) => {
		setSearchPhrase(target.value);
		startDelayedSearch(!shouldSearch);
	};

	const onProjectDelete = (id) => {
		dispatch(
			openModal({
				text: 'Удалить проект?',
				onConfirm: () => {
					dispatch(removeProjectAsync(id)).then(
						({ data: { projects, lastPage }, error }) => {
							if (error) {
								alert(error);
							}
							setMainProjects(projects);
							setLastPage(lastPage);
						},
					);
					dispatch(closeModal);
				},
				onCancel: () => dispatch(closeModal),
			}),
		);
	};

	return (
		<div className={styles['main-projects']}>
			<div className={styles.head}>
				<h2>Все проекты</h2>
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
