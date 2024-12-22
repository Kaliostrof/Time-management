import styles from './footer.module.css';

export const Footer = () => {
	const year = new Date().toLocaleDateString();

	return (
		<div className={styles.footer}>
			<div className={styles.border}></div>

			<div className={styles.content}>
				<div>Timey-wimey!</div>
				<div>{year}</div>
			</div>
		</div>
	);
};
