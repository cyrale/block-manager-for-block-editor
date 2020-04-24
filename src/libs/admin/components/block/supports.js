import { useState } from 'react';

const Support = ( props ) => {
	let [ isActive, setIsActive ] = useState( props.isActive );
	let [ value, setValue ] = useState( props.value );

	const handleIsActiveChange = () => {
		isActive = ! isActive;
		setIsActive( isActive );
		triggerOnChange();
	};

	const handleValueChange = () => {
		value = ! value;
		setValue( value );
		triggerOnChange();
	};

	const triggerOnChange = () => {
		props.onChange( {
			isActive,
			value
		} );
	}

	return (
		<div className="bmfbe-block__support">
			<input
				type="checkbox"
				checked={ isActive }
				onChange={ handleIsActiveChange }
				disabled={ props.disabled }
			/>
			{ props.name }
			<input
				type="checkbox"
				checked={ value }
				onChange={ handleValueChange }
				disabled={ props.disabled || ! isActive }
			/>
		</div>
	);
};

const Supports = ( props ) => {
	const [ supports, setSupports ] = useState( props.supports );

	const handleOnChange = ( name, value ) => {
		supports[ name ] = value;
		setSupports( supports );

		triggerOnChange();
	};

	const triggerOnChange = () => {
		props.onChange( supports );
	}

	return (
		<div className="bmfbe-block__supports">
			{ Object.entries( supports ).map( ( [ name, args ] ) => (
				<Support
					key={ name }
					onChange={ ( value ) => handleOnChange( name, value ) }
					{ ...Object.assign( args, { name, disabled: props.disabled } ) }
				/>
			) ) }
		</div>
	);
}

export default Supports;
