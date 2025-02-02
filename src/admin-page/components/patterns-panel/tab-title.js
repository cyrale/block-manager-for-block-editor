import { useSelect } from '@wordpress/data';

import GenericTabTitle from '../tab-title';
import { COLLECTION_STORE as PATTERNS_STORE } from '../../../stores/patterns/constants';

export default function TabTitle( { children, ...props } ) {
	const status = useSelect(
		( select ) => select( PATTERNS_STORE ).getStatus(),
		[]
	);

	return (
		<GenericTabTitle status={ status } { ...props }>
			{ children }
		</GenericTabTitle>
	);
}
