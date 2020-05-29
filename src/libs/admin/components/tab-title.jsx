import { STATUS_PENDING } from '../store/constants';

function TabTitle( { children, loadingStatus, savingStatus } ) {
	return (
		<>
			{ children }
			{ loadingStatus === STATUS_PENDING && 'Loading...' }
			{ savingStatus === STATUS_PENDING && 'Saving...' }
		</>
	);
}

export default TabTitle;
