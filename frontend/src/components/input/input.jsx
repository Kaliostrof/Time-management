import { forwardRef } from 'react';
import styled from 'styled-components';

const InputContainer = forwardRef(({ className, ...props }, ref) => {
	return <input className={className} {...props} ref={ref} />;
});

InputContainer.displayName = 'InputContainer';

export const Input = styled(InputContainer)`
	width: ${({ width = '100%' }) => width};
	margin: ${({ margin = '0' }) => margin};
	border-radius: 4px;
	height: ${({ height = '35px' }) => height};
	border: none;
	color: #0d0057;
	background-color: ${({ disabled }) =>
		disabled ? '#ae8de4' : 'rgba(255, 255, 255, 0.75)'};
	font-size: 16px;
	cursor: poiner;
	& :active {
		opacity: 0.9;
	}
	&:hover {
		opacity: 0.9;
	}
`;
