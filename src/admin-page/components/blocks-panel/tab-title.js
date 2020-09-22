import { useSelect } from '@wordpress/data';

import { COLLECTION_STORE as BLOCKS_STORE } from '../../../stores/blocks/constants';
import GenericTabTitle from '../tab-title';

export default function TabTitle( { children, ...props } ) {
	const status = useSelect(
		( select ) => select( BLOCKS_STORE ).getStatus(),
		[]
	);

	return (
		<GenericTabTitle status={ status } { ...props }>
			{ children }
		</GenericTabTitle>
	);
}
