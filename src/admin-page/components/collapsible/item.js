/**
 * External dependencies
 */
import Collapsible from 'react-collapsible';
import classnames from 'classnames';
import { omit } from 'lodash';

/**
 * WordPress dependencies
 */
import { useContext, useEffect, useState } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import { CollapsibleContainerContext } from './container';

export default function Item( {
	className,
	children,
	itemClassName,
	opened = false,
	uuid,
	...props
} ) {
	const containerContext = useContext( CollapsibleContainerContext );

	const instanceId = useInstanceId( Item, 'collapsible-item' );
	const instanceUuid = uuid ?? instanceId;

	const [ hideContent, setHideContent ] = useState( true );

	useEffect( () => {
		setHideContent(
			! opened && ! containerContext.isItemOpened( instanceUuid )
		);
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
						easing: 'ease-in-out',
						onClose: () => setHideContent( true ),
						onOpening: () => setHideContent( false ),
						onTriggerClosing: () =>
							containerContext.onTriggerClosing( instanceUuid ),
						onTriggerOpening: () =>
							containerContext.onTriggerOpening( instanceUuid ),
						open:
							opened ||
							containerContext.isItemOpened( instanceUuid ),
						transitionTime: 300,
					},
				} }
			>
				{ ! hideContent && children }
			</Collapsible>
		</div>
	);
}
