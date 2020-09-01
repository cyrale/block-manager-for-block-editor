import { useSelect } from '@wordpress/data';

import GenericTabTitle from '../tab-title';
import { PATTERNS_STORE } from '../../stores/patterns/constants';

export default function TabTitle( { children } ) {
	const status = useSelect(
		( select ) => select( PATTERNS_STORE ).getStatus(),
		[]
	);

	return <GenericTabTitle status={ status }>{ children }</GenericTabTitle>;
}
