import { useSelect } from '@wordpress/data';

import { BLOCKS_STORE } from '../../../stores/blocks/constants';
import GenericTabTitle from '../tab-title';

export default function TabTitle( { children } ) {
	const status = useSelect(
		( select ) => select( BLOCKS_STORE ).getStatus(),
		[]
	);

	return <GenericTabTitle status={ status }>{ children }</GenericTabTitle>;
}
