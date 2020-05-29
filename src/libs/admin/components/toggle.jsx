import useShortID from '../hooks/use-short-id';

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
				<input
					id={ id }
					type="checkbox"
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
