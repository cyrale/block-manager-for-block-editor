/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { CollapsibleContainer, CollapsibleItem } from '../collapsible';
import ExternalLink from '../external-link';
import InternalSupports from '../supports';

export default function Supports( props ) {
	return (
		<CollapsibleContainer>
			<CollapsibleItem
				className="collapsible__wrapper--supports"
				trigger={
					<>
						{ __( 'Supports', 'bmfbe' ) }
						<ExternalLink link="https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#supports-optional" />
					</>
				}
			>
				<InternalSupports { ...props } />
			</CollapsibleItem>
		</CollapsibleContainer>
	);
}
