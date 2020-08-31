/**
 * Internal dependencies.
 */
import Description from '../description';

export default function Pattern( { description, name, title } ) {
	return (
		<div className="bmfbe-pattern">
			{ /* <StatusIcon status={ status } /> */ }
			<div className="bmfbe-pattern__content">
				<Description
					classPrefix="pattern"
					name={ name }
					title={ title }
					description={ description }
				/>
			</div>
			{ /* <IndeterminateToggleControl
				label={ __( 'Override supports?', 'bmfbe' ) }
				className="bmfbe-block__override-supports"
				checked={ block.supports_override }
				onChange={ ( { checked } ) =>
					handleBlockChange( {
						supports_override: checked,
					} )
				}
			/> */ }
		</div>
	);
}
