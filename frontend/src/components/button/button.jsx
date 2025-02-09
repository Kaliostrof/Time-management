import PropTypes from 'prop-types';
import styled from 'styled-components';

const ButtonContainer = ({ children, className, ...props }) => {
	return (
		<button className={className} {...props}>
			{children}
		</button>
	);
};

export const Button = styled(ButtonContainer)`
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 16px;
	width: ${({ width = '100%' }) => width};
	height: ${({ height = '40px' }) => height};
	border-radius: 8px;
	background-color: #c5a5f8;
	opacity: ${({ disabled }) => (disabled ? '0.7' : '1')}

	&:hover {
		border: 1px solid #0b13a0;
		background-color: #d2bbf8;
		cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
	};

	&:focus {
		outline: 6px auto -webkit-focus-ring-color;
	}

	&:focus-visible {
		outline: 6px auto -webkit-focus-ring-color;
	}

	&:disabled {
		color: #d9a9f9;
		background-color: #c1a1f1;
		opacity: 0.7;
		border: none;
	}
`;

Button.propTypes = {
	children: PropTypes.node.isRequired,
	width: PropTypes.string,
};
