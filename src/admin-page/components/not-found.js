/**
 * WordPress dependencies
 */
import { blockDefault, Icon } from '@wordpress/icons';

export default function NotFound( { label } ) {
	return (
		<div className="bmfbe-not-found">
			<div className="bmfbe-not-found__icon">
				<Icon icon={ blockDefault } size={ 48 } />
			</div>
			<div className="bmfbe-not-found__label">{ label }</div>
		</div>
	);
}
