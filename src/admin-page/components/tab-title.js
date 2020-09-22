/**
 * External dependencies
 */
import { NavLink } from 'react-router-dom';

/**
 * Internal dependencies
 */
import StatusIcon from './status-icon';

export default function TabTitle( { children, status, to } ) {
	return (
		<div className="bmfbe-tab-title">
			<NavLink to={ to }>{ children }</NavLink>
			<StatusIcon status={ status } />
		</div>
	);
}
