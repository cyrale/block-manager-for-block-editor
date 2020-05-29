import GenericTabTitle from '../tab-title';
import { SETTINGS_PANEL_STORE } from './store/constants';

const {
	data: { useSelect },
} = wp;

function TabTitle( { children } ) {
	const { loadingStatus, savingStatus } = useSelect(
		( select ) => ( {
			loadingStatus: select( SETTINGS_PANEL_STORE ).loadingStatus(),
			savingStatus: select( SETTINGS_PANEL_STORE ).savingStatus(),
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
