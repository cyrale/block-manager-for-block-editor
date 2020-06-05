import useShortID from '../hooks/use-short-id';
import Checkbox from './checkbox';

export default function Toggle( {
	checked = false,
	children,
	disabled = false,
	id = '',
	label = '',
	onChange,
} ) {
	const shortID = useShortID( 'toggle' );

	if ( ! id ) {
		id = shortID;
	}

	return (
		<>
			<label htmlFor={ id }>
				<Checkbox
					id={ id }
					checked={ !! checked }
					disabled={ !! disabled }
					onChange={ ( e ) => onChange && onChange( e.target.checked ) }
				/>
				{ label }
			</label>
			{ children }
		</>
	);
}
