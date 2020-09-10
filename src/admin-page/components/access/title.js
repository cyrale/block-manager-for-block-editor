/**
 * External dependencies
 */
import { noop } from 'lodash';

export default function Title( { className = '', children, onClick = noop } ) {
	return (
		<th className={ className } title={ children }>
			<button type="button" onClick={ onClick }>
				{ children }
			</button>
		</th>
	);
}
