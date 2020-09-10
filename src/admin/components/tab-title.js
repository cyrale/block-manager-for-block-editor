/**
 * Internal dependencies
 */
import StatusIcon from './status-icon';

export default function TabTitle( { children, status } ) {
	return (
		<div className="bmfbe-tab-title">
			{ children }
			<StatusIcon status={ status } />
		</div>
	);
}
