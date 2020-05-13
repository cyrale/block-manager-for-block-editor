import useShortID from '../../use-short-id';

const {
	i18n: { __ },
	url: { cleanForSlug },
} = wp;

const SupportAlignItem = ( {
	disabled,
	isActive,
	name,
	onChange,
	value: alignValue,
} ) => {
	const shortID = useShortID( 'supports-' + name );

	const supportedValues = [
		{
			label: __( 'Disable', 'bmfbe' ),
			value: false,
		},
		{
			label: __( 'Enable', 'bmfbe' ),
			value: true,
		},
		{
			label: __( 'Left', 'bmfbe' ),
			value: 'left',
		},
		{
			label: __( 'Center', 'bmfbe' ),
			value: 'center',
		},
		{
			label: __( 'Right', 'bmfbe' ),
			value: 'right',
		},
		{
			label: __( 'Wide', 'bmfbe' ),
			value: 'wide',
		},
		{
			label: __( 'Full', 'bmfbe' ),
			value: 'full',
		},
	];

	function handleIsActiveChange() {
		onChange( {
			isActive: ! isActive,
			value: alignValue,
		} );
	}

	function handleValueChange( val ) {
		let newAlignValue;

		if ( 'boolean' === typeof val ) {
			newAlignValue = val;
		} else {
			newAlignValue = ! Array.isArray( alignValue )
				? []
				: [ ...alignValue ];

			if ( ! newAlignValue.includes( val ) ) {
				newAlignValue.push( val );
			} else {
				newAlignValue = newAlignValue.filter( ( v ) => v !== val );
			}
		}

		onChange( {
			isActive,
			value: newAlignValue,
		} );
	}

	return (
		<div className="bmfbe-block__support--align">
			<input
				type="checkbox"
				checked={ isActive }
				onChange={ handleIsActiveChange }
				disabled={ disabled }
			/>
			{ name }
			{ supportedValues.map( ( { label, value: val } ) => {
				const fieldId = shortID + '-' + cleanForSlug( label );

				return (
					<label key={ label } htmlFor={ fieldId }>
						<input
							id={ fieldId }
							type="checkbox"
							checked={
								( Array.isArray( alignValue ) &&
									alignValue.includes( val ) ) ||
								val === alignValue
							}
							onChange={ () => handleValueChange( val ) }
							disabled={ disabled || ! isActive }
						/>
						{ label }
					</label>
				);
			} ) }
		</div>
	);
};

const SupportItem = ( { disabled, isActive, name, onChange, value } ) => {
	const shortID = useShortID( 'supports-' + name );

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
			<label htmlFor={ shortID }>
				<input
					id={ shortID }
					type="checkbox"
					checked={ value }
					onChange={ handleValueChange }
					disabled={ disabled || ! isActive }
				/>
				{ __( 'Enable', 'bmfbe' ) }
			</label>
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
			{ Object.entries( settings ).map( ( [ name, args ] ) => {
				let SupportComponent = SupportItem;

				if ( 'align' === name ) {
					SupportComponent = SupportAlignItem;
				}

				return (
					<SupportComponent
						key={ name }
						onChange={ ( value ) => handleOnChange( name, value ) }
						disabled={ disabled }
						{ ...{ ...args, ...{ name } } }
					/>
				);
			} ) }
		</div>
	);
};

export default Supports;
