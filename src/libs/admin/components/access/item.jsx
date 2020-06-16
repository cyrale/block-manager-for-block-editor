import Checkbox from '../checkbox';

export default function Item( { children, cols, onChange, values } ) {
	/**
	 * Handle changes with checkboxes. Pass them to parent.
	 *
	 * @param {string} col Column name.
	 * @param {boolean} value New value.
	 *
	 * @since 1.0.0
	 */
	function handleOnChange( col, value ) {
		if ( onChange ) {
			onChange( {
				col,
				value,
			} );
		}
	}

	return (
		<tr>
			<td>{ children }</td>
			{ cols.map( ( col ) => (
				<td key={ col }>
					{ col in values && (
						<Checkbox
							checked={ values[ col ].checked }
							indeterminate={ values[ col ].indeterminate }
							onChange={ ( e ) =>
								handleOnChange( col, e.target.checked )
							}
						/>
					) }
				</td>
			) ) }
		</tr>
	);
}
