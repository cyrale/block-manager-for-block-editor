import { useState } from 'react';

const Support = ( props ) => {
	const [ isActive, setIsActive ] = useState( props.isActive );
	const [ value, setValue ] = useState( props.value );

	const handleIsActiveChange = () => {
		setIsActive( ! isActive );
	};

	const handleValueChange = () => {
		setValue( ! value );
	};

	return (
		<div className="bmfbe-block__support">
			<input
				type="checkbox"
				checked={ isActive }
				onChange={ handleIsActiveChange }
			/>
			{ props.name }
			<input
				type="checkbox"
				checked={ value }
				onChange={ handleValueChange }
				disabled={ ! isActive }
			/>
		</div>
	);
};

const Supports = ( { supports } ) => (
	<div className="bmfbe-block__supports">
		{ Object.entries( supports ).map( ( [ name, args ] ) => (
			<Support key={ name } { ...Object.assign( args, { name } ) } />
		) ) }
	</div>
);

export default Supports;
