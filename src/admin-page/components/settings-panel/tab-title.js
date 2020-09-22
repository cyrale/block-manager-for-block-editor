import { useSelect } from '@wordpress/data';

import GenericTabTitle from '../tab-title';
import { ITEM_STORE as SETTINGS_STORE } from '../../../stores/settings/constants';

export default function TabTitle( { children, ...props } ) {
	const status = useSelect(
		( select ) => select( SETTINGS_STORE ).getStatus(),
		[]
	);

	return (
		<GenericTabTitle status={ status } { ...props }>
			{ children }
		</GenericTabTitle>
	);
}
