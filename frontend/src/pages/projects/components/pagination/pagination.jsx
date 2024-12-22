import styles from './pagination.module.css';
import { Button } from '../../../../components';

export const Pagination = ({ page, lastPage, setPage }) => {
	return (
		<div className={styles.main}>
			<Button
				className={styles.btn}
				disabled={page === 1}
				width="110px"
				onClick={() => setPage(1)}
			>
				В начало
			</Button>
			<Button
				className={styles.btn}
				disabled={page === 1}
				width="110px"
				onClick={() => setPage(page - 1)}
			>
				Предыдущая
			</Button>
			<div className={styles['current-page']}>Страница: {page}</div>
			<Button
				disabled={page === lastPage}
				width="110px"
				onClick={() => setPage(page + 1)}
			>
				Следующая
			</Button>
			<Button
				className={styles.btn}
				disabled={page === lastPage}
				width="110px"
				onClick={() => setPage(lastPage)}
			>
				В конец
			</Button>
		</div>
	);
};
