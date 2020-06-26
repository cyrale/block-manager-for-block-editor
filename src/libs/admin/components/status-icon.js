/**
 * WordPress dependencies
 */
import { useEffect, useRef } from '@wordpress/element';
import { check, cloud, Icon } from '@wordpress/icons';
import { Circle, SVG } from '@wordpress/primitives';

/**
 * Internal dependencies
 */
import {
	STATUS_LOADING,
	STATUS_PENDING,
	STATUS_SAVING,
} from '../stores/constants';

const loadingIcon = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 200 200"
		width="22"
		height="22"
		role="img"
		aria-hidden="true"
		focusable="false"
		className="icon icon--loading"
	>
		<Circle
			r="90"
			cx="100"
			cy="100"
			fill="transparent"
			strokeDasharray="565.48"
			strokeDashoffset="0"
		/>
		<Circle
			className="bar"
			r="90"
			cx="100"
			cy="100"
			fill="transparent"
			strokeDasharray="565.48"
			strokeDashoffset="0"
			style={ { strokeDashoffset: 425 } }
		/>
	</SVG>
);

export default function StatusIcon( { status } ) {
	const prevStatus = useRef( null );

	useEffect( () => {
		prevStatus.current = status;
	}, [ status ] );

	return (
		<div className="bmfbe-status-icon">
			{ STATUS_LOADING === status && loadingIcon }
			{ STATUS_SAVING === status && (
				<Icon icon={ cloud } size={ 24 } className="icon icon--cloud" />
			) }
			{ STATUS_PENDING === status &&
				STATUS_SAVING === prevStatus.current && (
					<Icon
						icon={ check }
						size={ 24 }
						className="icon icon--check"
					/>
				) }
		</div>
	);
}
