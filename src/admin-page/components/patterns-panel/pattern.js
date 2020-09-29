/**
 * WordPress dependencies.
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { COLLECTION_STORE as PATTERNS_STORE } from '../../../stores/patterns/constants';
import {
	default as Access,
	AccessCollapsible as CollapsibleAccess,
} from '../access';
import { CollapsibleContainer } from '../collapsible';
import Description from '../description';
import StatusIcon from '../status-icon';

export default function Pattern( { name } ) {
	const { pattern, status } = useSelect(
		( select ) => ( {
			pattern: select( PATTERNS_STORE ).getItem( name ),
			status: select( PATTERNS_STORE ).getStatus( name ),
		} ),
		[]
	);

	const { updateItem } = useDispatch( PATTERNS_STORE );

	function handleOnChange( access ) {
		updateItem( pattern.name, { access } );
	}

	return (
		<div className="bmfbe-pattern">
			<StatusIcon status={ status } />
			<div className="bmfbe-pattern__content">
				<Description
					classPrefix="pattern"
					name={ name }
					title={ pattern.title }
					description={ pattern.description }
				/>
			</div>
			<CollapsibleContainer>
				<CollapsibleAccess
					className={ `collapsible__wrapper--access` }
					label={ __( 'Enable this pattern', 'bmfbe' ) }
					itemAccess={ pattern.access }
					onChange={ handleOnChange }
				>
					<Access
						value={ pattern.access }
						onChange={ handleOnChange }
					/>
				</CollapsibleAccess>
			</CollapsibleContainer>
		</div>
	);
}
