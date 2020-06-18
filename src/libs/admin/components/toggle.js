import { noop } from 'lodash';

import { useInstanceId } from '@wordpress/compose';

import Checkbox from './checkbox';

export default function Toggle( {
	checked = false,
	children,
	disabled = false,
	label = '',
	onChange = noop,
} ) {
	const instanceID = useInstanceId( Toggle, 'toggle' );

	return (
		<>
			<label htmlFor={ instanceID }>
				<Checkbox
					id={ instanceID }
					checked={ !! checked }
					disabled={ !! disabled }
					onChange={ ( e ) => onChange( e.target.checked ) }
				/>
				{ label }
			</label>
			{ children }
		</>
	);
}
