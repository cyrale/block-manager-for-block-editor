/**
 * External dependencies
 */
import { noop } from 'lodash';
import { Accordion } from 'react-accessible-accordion';

export default function Container( {
	categories = [],
	children,
	onChange = noop,
} ) {
	return (
		<Accordion
			allowZeroExpanded={ true }
			preExpanded={ [ categories[ 0 ].slug ] }
			onChange={ onChange }
		>
			{ children }
		</Accordion>
	);
}
