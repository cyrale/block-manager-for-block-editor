import { Notice as WPNotice } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { STATUS_PENDING, STATUS_SAVING } from '../../stores/constants';

export default function Notice( { status } ) {
	const previousStatus = useRef( null );

	useEffect( () => {
		previousStatus.current = status;
	}, [ status ] );

	return (
		<div className="bmfbe-notice">
			<div className="bmfbe-notice__content">
				{ STATUS_SAVING === status && (
					<WPNotice status="warning" isDismissible={ false }>
						{ __( 'Saving', 'bmfbe' ) }
					</WPNotice>
				) }
				{ STATUS_PENDING === status &&
					STATUS_SAVING === previousStatus.current && (
						<WPNotice status="success" isDismissible={ false }>
							{ __( 'Saved', 'bmfbe' ) }
						</WPNotice>
					) }
			</div>
		</div>
	);
}
