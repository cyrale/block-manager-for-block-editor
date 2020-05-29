import GenericTabTitle from '../tab-title';
import { SETTINGS_PANEL_STORE } from '../../stores/settings/constants';

const {
	data: { useSelect },
} = wp;

function TabTitle( { children } ) {
	const status = useSelect(
		( select ) => select( SETTINGS_PANEL_STORE ).getStatus(),
		[]
	);

	return <GenericTabTitle status={ status }>{ children }</GenericTabTitle>;
}

export default TabTitle;
