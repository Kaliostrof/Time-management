import { Icon } from '../../../../components';
import styles from './project-list.module.css';
import { Link } from 'react-router-dom';

export const ProjectList = ({ id, title, onDelete }) => {
	return (
		<div className={styles.card}>
			<Link to={`/projects/${id}`}>{title}</Link>
			<div className={styles.icon}>
				<Icon
					id="fa-trash-o"
					size="20px"
					margin="0 10px 0 0"
					onClick={() => onDelete(id)}
				/>
			</div>
		</div>
	);
};
