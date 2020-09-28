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
						open:
							opened ||
							containerContext.isItemOpened( instanceUuid ),
						onOpening: () => setHideContent( false ),
						onClose: () => setHideContent( true ),
						onTriggerOpening: () =>
							containerContext.onTriggerOpening( instanceUuid ),
						onTriggerClosing: () =>
							containerContext.onTriggerClosing( instanceUuid ),
						easing: 'ease-in-out',
						transitionTime: 300,
					},
				} }
			>
				{ ! hideContent && children }
			</Collapsible>
		</div>
	);
}
