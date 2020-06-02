import GenericTabTitle from '../tab-title';
import { BLOCKS_STORE } from '../../stores/blocks/constants';

const {
	data: { useSelect },
} = wp;

function TabTitle( { children } ) {
	const status = useSelect(
		( select ) => select( BLOCKS_STORE ).getStatus(),
		[]
	);

	return <GenericTabTitle status={ status }>{ children }</GenericTabTitle>;
}

export default TabTitle;
