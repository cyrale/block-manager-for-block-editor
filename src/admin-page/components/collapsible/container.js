/**
 * External dependencies
 */
import classnames from 'classnames';
import { noop, uniq } from 'lodash';

/**
 * WordPress dependencies
 */
import { createContext, useEffect, useState } from '@wordpress/element';

export const CollapsibleContainerContext = createContext( {
	isItemOpened: noop,
	onTriggerOpening: noop,
	onTriggerClosing: noop,
	registerItem: noop,
} );

export default function CollapsibleContainer( {
	allowMultipleOpened = false,
	className,
	children,
	onChange = noop,
	preOpened = [],
} ) {
	const [ opened, setOpened ] = useState( [] );

	useEffect( () => {
		setOpened( preOpened );
	}, [] );

	function handleOnTriggerOpening( uuid ) {
		setOpened( ( prevOpened ) => {
			const nextOpened = ! allowMultipleOpened
				? [ uuid ]
				: uniq( prevOpened.push( uuid ) );

			onChange( nextOpened );
			return nextOpened;
		} );
	}

	function handleOnTriggerClosing( uuid ) {
		setOpened( ( prevOpened ) => {
			const nextOpened = prevOpened.filter( ( open ) => open !== uuid );

			onChange( nextOpened );
			return nextOpened;
		} );
	}

	return (
		<CollapsibleContainerContext.Provider
			value={ {
				isItemOpened: ( uuid ) => opened.includes( uuid ),
				onTriggerOpening: handleOnTriggerOpening,
				onTriggerClosing: handleOnTriggerClosing,
			} }
		>
			<div
				className={ classnames( 'collapsible__container', className ) }
			>
				{ children }
			</div>
		</CollapsibleContainerContext.Provider>
	);
}
