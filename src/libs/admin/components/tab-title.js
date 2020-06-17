import { STATUS_LOADING, STATUS_SAVING } from '../stores/constants';

export default function TabTitle( { children, status } ) {
	return (
		<>
			{ children }
			{ STATUS_LOADING === status && 'Loading...' }
			{ STATUS_SAVING === status && 'Saving...' }
		</>
	);
}
