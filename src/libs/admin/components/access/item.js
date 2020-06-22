import { noop } from 'lodash';

import IndeterminateToggleControl from '../indeterminate-toggle-control';
import Title from './title';

export default function Item( {
	children,
	cols,
	onChange = noop,
	onClick = noop,
	values,
} ) {
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
			<Title className="row-title" onClick={ onClick }>
				{ children }
			</Title>
			{ cols.map( ( col ) => (
				<td key={ col } className="column-toggle">
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
