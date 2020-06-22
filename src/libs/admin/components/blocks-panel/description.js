import { useSelect } from '@wordpress/data';

import { BLOCKS_STORE, STATUS_SAVING } from '../../stores/blocks/constants';

export default function Description( { description, name, title } ) {
	const status = useSelect(
		( select ) => select( BLOCKS_STORE ).getStatus( name ),
		[]
	);

	return (
		<div className="bmfbe-block__description">
			<h4 className="bmfbe-block__title">
				{ title } { STATUS_SAVING === status && 'Saving...' }
			</h4>
			<p className="bmfbe-block__name">{ name }</p>
			<p>{ description }</p>
		</div>
	);
}
