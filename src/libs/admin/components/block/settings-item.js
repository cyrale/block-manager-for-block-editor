const { omit } = lodash;

export const TitledSettingsItem = ( {
	isActive,
	isDefault,
	name,
	onChange,
	title,
} ) => {
	const handleIsActiveChange = () => {
		onChange( {
			isActive: ! isActive,
			isDefault,
		} );
	};

	const handleIsDefaultChange = () => {
		onChange( {
			isActive,
			isDefault: ! isDefault,
		} );
	};

	return (
		<div className="bmfbe-block__settings-item">
			<input
				type="checkbox"
				checked={ isActive }
				onChange={ handleIsActiveChange }
			/>
			{ title }
			<em>{ name }</em>
			<input
				type="checkbox"
				checked={ isDefault }
				onChange={ handleIsDefaultChange }
				disabled={ ! isActive }
			/>
		</div>
	);
};

export const LabeledSettingsItem = ( props ) => {
	const convertedProps = {
		...omit( props, [ 'label' ] ),
		...{ title: props.label },
	};

	return <TitledSettingsItem { ...convertedProps } />;
};
