/**
 * WordPress dependencies
 */
import { Icon as WPIcon } from '@wordpress/components';

export default function Icon( { icon } ) {
	return (
		<div className="bmfbe-block__icon">
			{ icon && icon.src && <WPIcon icon={ icon.src } size={ 24 } /> }
		</div>
	);
}
