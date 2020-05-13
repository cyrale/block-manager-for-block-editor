import { LabeledSettingsItem, TitledSettingsItem } from './settings-item';

const SettingsList = ( { nameKey, onChange, settings } ) => {
	function handleOnChange( name, value ) {
		const currentSettings = settings.map( ( s ) => {
			if ( s.name === name ) {
				s = { ...s, ...value };
			} else if ( s.name !== name && s.isDefault && value.isDefault ) {
				s = { ...s, ...{ isDefault: false } };
			}

			return s;
		} );

		onChange( currentSettings );
	}

	return (
		<div className="bmfbe-block__settings-list">
			{ settings.map( ( s ) => {
				const ItemComponent =
					nameKey === 'label'
						? LabeledSettingsItem
						: TitledSettingsItem;

				return (
					<ItemComponent
						key={ s.name }
						onChange={ ( value ) =>
							handleOnChange( s.name, value )
						}
						{ ...s }
					/>
				);
			} ) }
		</div>
	);
};

export const TitledSettingsList = ( props ) => {
	return <SettingsList nameKey="title" { ...props } />;
};

export const LabeledSettingsList = ( props ) => {
	return <SettingsList nameKey="label" { ...props } />;
};
