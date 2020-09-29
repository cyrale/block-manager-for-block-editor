/**
 * External dependencies
 */
import classnames from 'classnames';
import { usePreviousDistinct } from 'react-use';

/**
 * WordPress dependencies
 */
import { Circle, SVG } from '@wordpress/primitives';
import { Icon, check, cloud } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import {
	STATUS_LOADING,
	STATUS_PENDING,
	STATUS_SAVING,
} from '../../stores/common/constants';

const loadingIcon = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 200 200"
		role="img"
		aria-hidden="true"
		focusable="false"
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
			strokeDashoffset="425"
		/>
	</SVG>
);

export default function StatusIcon( { percentage, status } ) {
	const prevStatus = usePreviousDistinct( status );

	let icon = null;
	let iconClassName = '';
	let isFinished = false;

	switch ( status ) {
		case STATUS_LOADING:
			icon = loadingIcon;
			iconClassName = 'loading';
			break;

		case STATUS_SAVING:
			icon = cloud;
			iconClassName = 'cloud';
			break;

		case STATUS_PENDING:
			if ( STATUS_SAVING === prevStatus ) {
				icon = check;
				iconClassName = 'check';
				isFinished = true;
			}
			break;
	}

	return (
		<div className="bmfbe-status-icon">
			{ icon && (
				<>
					<Icon
						icon={ icon }
						size={ 24 }
						className={ `icon icon--${ iconClassName }` }
					/>
					{ ! isNaN( percentage ) && (
						<div
							className={ classnames(
								'bmfbe-status-icon__percentage',
								{ 'is-finished': isFinished }
							) }
						>
							{ percentage }%
						</div>
					) }
				</>
			) }
		</div>
	);
}
