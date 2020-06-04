import useShortID from '../hooks/use-short-id';
import Checkbox from "./checkbox";

export default function Toggle( {
	children,
	disabled,
	id,
	label,
	onChange,
	value,
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
					checked={ !! value }
					disabled={ !! disabled }
					onChange={ () => onChange && onChange( ! value ) }
				/>
				{ label }
			</label>
			{ children }
		</>
	);
}
