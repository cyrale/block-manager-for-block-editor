import Toggle from '../settings/toggle';

const {
	i18n: { __ },
} = wp;

export default function Styles( { className, onChange, value } ) {
	if ( ! className ) {
		className = 'bmfbe-block__styles';
	}

	function handleOnChange( index, field, v ) {
		value[ index ] = {
			...value[ index ],
			[ field ]: v,
		};

		return onChange && onChange( value );
	}

	return (
		<div className={ className }>
			{ value.map( ( style, index ) => {
				return (
					<div key={ style.name } className={ className + '-row' }>
						<Toggle
							label={
								<>
									{ style.label } <em>{ style.name }</em>
								</>
							}
							value={ style.isActive }
							onChange={ ( v ) =>
								handleOnChange( index, 'isActive', v )
							}
						>
							<Toggle
								label={ __( 'Default', 'bmfbe' ) }
								value={ style.isDefault }
								disabled={ ! style.isActive }
								onChange={ ( v ) =>
									handleOnChange( index, 'isDefault', v )
								}
							/>
						</Toggle>
					</div>
				);
			} ) }
		</div>
	);
}
