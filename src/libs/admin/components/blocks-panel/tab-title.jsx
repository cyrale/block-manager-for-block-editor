import GenericTabTitle from '../tab-title';
import { BLOCKS_PANEL_STORE } from './store/constants';

const {
	data: { useSelect },
} = wp;

function TabTitle( { children } ) {
	const status = useSelect(
		( select ) => select( BLOCKS_PANEL_STORE ).getStatus(),
		[]
	);

	return <GenericTabTitle status={ status }>{ children }</GenericTabTitle>;
}

export default TabTitle;
