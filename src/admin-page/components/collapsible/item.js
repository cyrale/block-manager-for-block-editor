/**
 * External dependencies
 */
import classnames from 'classnames';
import { omit } from 'lodash';
import Collapsible from 'react-collapsible';

/**
 * WordPress dependencies
 */
import { useInstanceId } from '@wordpress/compose';
import { useContext, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { CollapsibleContainerContext } from './container';

export default function Item( {
	className,
	children,
	itemClassName,
	uuid,
	...props
} ) {
	const containerContext = useContext( CollapsibleContainerContext );

	const instanceId = useInstanceId( Item, 'collapsible-item' );
	const instanceUuid = uuid ?? instanceId;

	const [ hideContent, setHideContent ] = useState( true );

	useEffect( () => {
		setHideContent( ! containerContext.isItemOpened( instanceUuid ) );
	}, [] );

	return (
		<div className={ classnames( 'collapsible__wrapper', className ) }>
			<Collapsible
				{ ...{
					...omit( props, [ 'key' ] ),
					...{
						classParentString: classnames(
							'collapsible__item',
							itemClassName
						),
						open: containerContext.isItemOpened( instanceUuid ),
						onOpening: () => setHideContent( false ),
						onClose: () => setHideContent( true ),
						onTriggerOpening: () =>
							containerContext.onTriggerOpening( instanceUuid ),
						onTriggerClosing: () =>
							containerContext.onTriggerClosing( instanceUuid ),
						transitionTime: 200,
					},
				} }
			>
				{ ! hideContent && children }
			</Collapsible>
		</div>
	);
}
