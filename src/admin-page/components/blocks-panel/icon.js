/**
 * WordPress dependencies
 */
import { Icon as WPIcon } from '@wordpress/components';

export default function Icon( { icon } ) {
	return (
		<div className="bmfbe-block__icon">
			{ icon?.src && <WPIcon icon={ icon.src } /> }
		</div>
	);
}
