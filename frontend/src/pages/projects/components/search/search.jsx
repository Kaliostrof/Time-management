import styles from './search.module.css';
import { Icon, Input } from '../../../../components';

export const Search = ({ searchPhrase, onChange }) => {
	return (
		<div className={styles.main}>
			<Input
				value={searchPhrase}
				onChange={onChange}
				placeholder="Что нужно найти?"
			></Input>
			<div className={styles.icon}>
				<Icon inactive="true" id="fa-search" size="21px" />
			</div>
		</div>
	);
};
