/**
 * External dependencies
 */
import { assign, noop, omit } from 'lodash';

/**
 * Internal dependencies
 */
import Styles from './styles';

export default function Variations( { onChange = noop, value } ) {
	return (
		<Styles
			className="bmfbe-block__variations"
			value={ value.map( ( v ) =>
				assign( { label: v.title }, omit( v, [ 'title' ] ) )
			) }
			onChange={ onChange }
		/>
	);
}
