import { merge } from 'lodash';

import { __ } from '@wordpress/i18n';

import Toggle from '../toggle';

export default function Styles( { onChange, value } ) {
	/**
	 * Handle changes on styles.
	 *
	 * @param {string} index Name of the style.
	 * @param {Object.<string, boolean>} change Change on the style.
	 * @since 1.0.0
	 */
	function handleOnChange( index, change ) {
		value[ index ] = merge( {}, value[ index ], change );

		if ( onChange ) {
			onChange( value );
		}
	}

	return (
		<div className="bmfbe-block__styles">
			{ value.map( ( style, index ) => {
				return (
					<div key={ style.name } className="bmfbe-block__styles-row">
						<Toggle
							label={
								<>
									{ style.label } <em>{ style.name }</em>
								</>
							}
							value={ style.isActive }
							onChange={ ( checked ) =>
								handleOnChange( index, { isActive: checked } )
							}
						>
							<Toggle
								label={ __( 'Default', 'bmfbe' ) }
								value={ style.isDefault }
								disabled={ ! style.isActive }
								onChange={ ( checked ) =>
									handleOnChange( index, {
										isDefault: checked,
									} )
								}
							/>
						</Toggle>
					</div>
				);
			} ) }
		</div>
	);
}
