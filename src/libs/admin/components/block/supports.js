const SupportItem = ( { disabled, isActive, name, onChange, value } ) => {
	function handleIsActiveChange() {
		onChange( {
			isActive: ! isActive,
			value,
		} );
	}

	function handleValueChange() {
		onChange( {
			isActive,
			value: ! value,
		} );
	}

	return (
		<div className="bmfbe-block__support">
			<input
				type="checkbox"
				checked={ isActive }
				onChange={ handleIsActiveChange }
				disabled={ disabled }
			/>
			{ name }
			<input
				type="checkbox"
				checked={ value }
				onChange={ handleValueChange }
				disabled={ disabled || ! isActive }
			/>
		</div>
	);
};

const Supports = ( { disabled, onChange, settings } ) => {
	function handleOnChange( name, value ) {
		settings[ name ] = value;
		onChange( settings );
	}

	return (
		<div className="bmfbe-block__supports">
			{ Object.entries( settings ).map( ( [ name, args ] ) => (
				<SupportItem
					key={ name }
					onChange={ ( value ) => handleOnChange( name, value ) }
					disabled={ disabled }
					{ ...{ ...args, ...{ name } } }
				/>
			) ) }
		</div>
	);
};

export default Supports;
