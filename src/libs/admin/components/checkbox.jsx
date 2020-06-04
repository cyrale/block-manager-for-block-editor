const {
	element: { useEffect, useRef },
} = wp;

function Checkbox( {
	checked = false,
	disabled = false,
	id = '',
	indeterminate = false,
	onChange,
} ) {
	const checkRef = useRef( null );

	useEffect( () => {
		checkRef.current.checked = checked;
		checkRef.current.indeterminate = indeterminate;
	}, [ checked, indeterminate ] );

	return (
		<input
			type="checkbox"
			ref={ checkRef }
			id={ id }
			disabled={ disabled }
			onChange={ onChange }
		/>
	);
}

export default Checkbox;
