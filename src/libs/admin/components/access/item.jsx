import Checkbox from '../checkbox';

function Item( { children, cols, onChange, values } ) {
	function handleOnChange( col, value ) {
		return (
			onChange &&
			onChange( {
				col,
				value,
			} )
		);
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

export default Item;
