import { Button, Icon, Input } from '../../../../components';
import styles from './add-new-project.module.css';

export const AddNewProject = ({ onCreate, projectTitle, setProjectTitle }) => {
	return (
		<div className={styles['new-project']}>
			<Input
				className={styles.input}
				value={projectTitle}
				height="30px"
				margin="0 10px 0 0"
				onChange={(event) => setProjectTitle(event.target.value)}
				placeholder="Создайте новый проект"
			></Input>
			<Button
				type="button"
				width="110px"
				onClick={onCreate}
				disabled={!projectTitle}
			>
				Создать
				<Icon id="fa-plus-square-o" margin=" 4px 0 0 10px" />
			</Button>
		</div>
	);
};
