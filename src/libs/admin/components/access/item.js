import { noop } from 'lodash';

import IndeterminateToggleControl from '../indeterminate-toggle-control';

export default function Item( { children, cols, onChange = noop, values } ) {
	/**
	 * Handle changes with checkboxes. Pass them to parent.
	 *
	 * @param {string} col Column name.
	 * @param {boolean} value New value.
	 *
	 * @since 1.0.0
	 */
	function handleOnChange( col, value ) {
		onChange( {
			col,
			value,
		} );
	}

	return (
		<tr>
			<td>{ children }</td>
			{ cols.map( ( col ) => (
				<td key={ col }>
					{ col in values && (
						<IndeterminateToggleControl
							checked={ values[ col ].checked }
							indeterminate={ values[ col ].indeterminate }
							onChange={ ( { checked } ) =>
								handleOnChange( col, checked )
							}
						/>
					) }
				</td>
			) ) }
		</tr>
	);
}
