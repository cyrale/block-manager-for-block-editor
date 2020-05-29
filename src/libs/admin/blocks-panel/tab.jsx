import TabTitle from '../components/tab-title';
import { BLOCKS_PANEL_STORE } from './store/constants';

const {
	data: { useSelect },
} = wp;

function Tab( { children } ) {
	const { loadingStatus, savingStatus } = useSelect(
		( select ) => ( {
			loadingStatus: select( BLOCKS_PANEL_STORE ).loadingStatus(),
			savingStatus: select( BLOCKS_PANEL_STORE ).savingStatus(),
		} ),
		[]
	);

	return (
		<TabTitle loadingStatus={ loadingStatus } savingStatus={ savingStatus }>
			{ children }
		</TabTitle>
	);
}

export default Tab;
