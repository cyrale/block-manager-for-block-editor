import { SETTINGS_STORE, STATUS_PENDING } from './store/constants';

const {
	data: { useSelect },
} = wp;

function TabTitle( { children } ) {
	const { loadingStatus, savingStatus } = useSelect(
		( select ) => ( {
			loadingStatus: select( SETTINGS_STORE ).loadingStatus(),
			savingStatus: select( SETTINGS_STORE ).savingStatus(),
		} ),
		[]
	);

	return (
		<>
			{ children }
			{ loadingStatus === STATUS_PENDING && 'Loading...' }
			{ savingStatus === STATUS_PENDING && 'Saving...' }
		</>
	);
}

export default TabTitle;
