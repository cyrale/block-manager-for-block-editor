import { useState } from 'react';

const Variation = ( props ) => {
	const [ isActive, setIsActive ] = useState( props.isActive );
	const [ isDefault, setIsDefault ] = useState( props.isDefault );

	const handleIsActiveChange = () => {
		setIsActive( ! isActive );
	};

	const handleIsDefaultChange = () => {
		setIsDefault( ! isDefault );
	};

	return (
		<div className="bmfbe-block__variation">
			<input
				type="checkbox"
				checked={ isActive }
				onChange={ handleIsActiveChange }
			/>
			{ props.title }
			<em>{ props.name }</em>
			<input
				type="checkbox"
				checked={ isDefault }
				onChange={ handleIsDefaultChange }
			/>
		</div>
	);
};

const Variations = ( { variations } ) => (
	<div className="bmfbe-block__variations">
		{ variations.map( ( variation ) => (
			<Variation key={ variation.name } { ...variation } />
		) ) }
	</div>
);

export default Variations;
