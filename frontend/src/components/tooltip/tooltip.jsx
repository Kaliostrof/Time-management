import { useRef, useState } from 'react';
import styles from './tooltip.module.css';

export const Tooltip = ({ children, text, customClass }) => {
	const [showToolTip, setShowToolTip] = useState(false);
	const refTimeOut = useRef();
	const tooltipClasses = customClass ? `${customClass}` : `${styles.tooltip}`;

	const onMouseEnterHandler = () => {
		refTimeOut.current = setTimeout(() => {
			setShowToolTip(true);
		}, 600);
	};

	const onMouseLeaveHandler = () => {
		clearTimeout(refTimeOut.current);
		setShowToolTip(false);
	};
	return (
		<div
			className={styles.container}
			onMouseEnter={onMouseEnterHandler}
			onMouseLeave={onMouseLeaveHandler}
		>
			{children}
			{showToolTip && <div className={tooltipClasses}>{text}</div>}
		</div>
	);
};
