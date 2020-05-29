import GenericTabTitle from '../tab-title';
import { BLOCKS_PANEL_STORE } from './store/constants';

const {
	data: { useSelect },
} = wp;

function TabTitle( { children } ) {
	const { loadingStatus, savingStatus } = useSelect(
		( select ) => ( {
			loadingStatus: select( BLOCKS_PANEL_STORE ).loadingStatus(),
			savingStatus: select( BLOCKS_PANEL_STORE ).savingStatus(),
		} ),
		[]
	);

	return (
		<GenericTabTitle loadingStatus={ loadingStatus } savingStatus={ savingStatus }>
			{ children }
		</GenericTabTitle>
	);
}

export default TabTitle;
