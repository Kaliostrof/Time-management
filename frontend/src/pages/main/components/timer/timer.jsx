import { Icon } from '../../../../components';
import { Tooltip } from '../../../../components/tooltip/tooltip';
import styles from './timer.module.css';

export const Timer = ({ onPause, onPlay, onStop, isPlay, time }) => {
	return (
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
	);
};
