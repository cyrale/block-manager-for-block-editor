import { useState } from 'react';

const Style = ( props ) => {
	const [ isActive, setIsActive ] = useState( props.isActive );
	const [ isDefault, setIsDefault ] = useState( props.isDefault );

	const handleIsActiveChange = () => {
		setIsActive( ! isActive );
	};

	const handleIsDefaultChange = () => {
		setIsDefault( ! isDefault );
	};

	return (
		<div className="bmfbe-block__style">
			<input
				type="checkbox"
				checked={ isActive }
				onChange={ handleIsActiveChange }
			/>
			{ props.label }
			<em>{ props.name }</em>
			<input
				type="checkbox"
				checked={ isDefault }
				onChange={ handleIsDefaultChange }
			/>
		</div>
	);
};

const Styles = ( { styles } ) => (
	<div className="bmfbe-block__styles">
		{ styles.map( ( style ) => (
			<Style key={ style.name } { ...style } />
		) ) }
	</div>
);

export default Styles;
