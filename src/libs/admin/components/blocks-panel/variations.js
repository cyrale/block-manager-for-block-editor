import { noop } from 'lodash';

import Styles from './styles';

export default function Variations( { onChange = noop, value } ) {
	return (
		<Styles
			className="bmfbe-block__variations"
			value={ value }
			onChange={ onChange }
		/>
	);
}
