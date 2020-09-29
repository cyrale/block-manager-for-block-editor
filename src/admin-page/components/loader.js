/**
 * WordPress dependencies
 */
import { blockDefault, Icon } from '@wordpress/icons';

export default function Loader( { label } ) {
	return (
		<div className="bmfbe-loader">
			<div className="bmfbe-loader__icon">
				<Icon icon={ blockDefault } size={ 48 } />
			</div>
			<div className="bmfbe-not-found__label">{ label }</div>
		</div>
	);
}
