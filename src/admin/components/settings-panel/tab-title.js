import { useSelect } from '@wordpress/data';

import GenericTabTitle from '../tab-title';
import { SETTINGS_STORE } from '../../../stores/settings/constants';

export default function TabTitle( { children } ) {
	const status = useSelect(
		( select ) => select( SETTINGS_STORE ).getStatus(),
		[]
	);

	return <GenericTabTitle status={ status }>{ children }</GenericTabTitle>;
}
