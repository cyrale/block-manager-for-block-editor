/**
 * External dependencies
 */
import { mapValues, uniq } from 'lodash';

/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { COLLECTION_STORE as BLOCKS_STORE } from '../../../stores/blocks/constants';
import { ITEM_STORE as SETTINGS_STORE } from '../../../stores/settings/constants';
import Access from '../access';
import {
	CollapsibleContainer,
	CollapsibleFake,
	CollapsibleItem,
} from '../collapsible';
import Description from '../description';
import ExternalLink from '../external-link';
import Icon from './icon';
import IndeterminateToggleControl from '../indeterminate-toggle-control';
import Styles from './styles';
import Supports from '../supports';
import StatusIcon from '../status-icon';
import Variations from './variations';

const defaultRenderTrigger = ( { label, link } ) => (
	<>
		{ label }
		{ link && <ExternalLink link={ link } /> }
	</>
);

/**
 * Panels to display below of block description.
 *
 * @constant {({name: string, label: string, Component: *})[]}
 * @since 1.0.0
 */
const panels = [
	{
		name: 'supports',
		label: __( 'Supports', 'bmfbe' ),
		link:
			'https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#supports-optional',
		renderTrigger: defaultRenderTrigger,
		renderContent: ( props ) => <Supports { ...props } />,
	},
	{
		name: 'styles',
		label: __( 'Styles', 'bmfbe' ),
		link:
			'https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#styles-optional',
		renderTrigger: defaultRenderTrigger,
		renderContent: ( props ) => <Styles { ...props } />,
	},
	{
		name: 'variations',
		label: __( 'Variations', 'bmfbe' ),
		link:
			'https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#variations-optional',
		renderTrigger: defaultRenderTrigger,
		renderContent: ( props ) => <Variations { ...props } />,
	},
	{
		name: 'access',
		label: __( 'Enable this block', 'bmfbe' ),
		renderTrigger: ( { label, link, globalActivation, onChange } ) => (
			<>
				<IndeterminateToggleControl
					onChange={ onChange }
					{ ...globalActivation }
				/>{ ' ' }
				{ label }
				{ link && <ExternalLink link={ link } /> }
			</>
		),
		renderContent: ( props ) => <Access { ...props } />,
	},
];

/**
 * Default status for displayed panels (all hidden).
 *
 * @constant {Object.<string, boolean>}
 * @since 1.0.0
 */
const defaultDisplayedPanels = {};
panels.forEach( ( { name } ) => {
	defaultDisplayedPanels[ name ] = false;
} );

export default function Block( { name } ) {
	const { block, settings, status } = useSelect(
		( select ) => ( {
			block: select( BLOCKS_STORE ).getItem( name ),
			settings: select( SETTINGS_STORE ).getItem(),
			status: select( BLOCKS_STORE ).getStatus( name ),
		} ),
		[]
	);

	const { updateItem } = useDispatch( BLOCKS_STORE );

	// Get uniquely values for access panel.
	const uniqFlatValues = uniq(
		Object.values(
			mapValues( block.access, ( postTypeValues ) =>
				Object.values( postTypeValues )
			)
		).reduce( ( acc, values ) => [ ...acc, ...values ], [] )
	);

	// Display access panel or fake it?
	const displayGlobalActivation =
		! settings.limit_access_by_section &&
		! settings.limit_access_by_user_group;
	// Split value to be used by checkbox.
	const globalActivation = {
		checked: 1 === uniqFlatValues.length && uniqFlatValues[ 0 ],
		indeterminate: 1 < uniqFlatValues.length,
	};

	/**
	 * Handle changes on block settings.
	 *
	 * @param {Object} value New block settings.
	 * @since 1.0.0
	 */
	async function handleBlockChange( value ) {
		updateItem( name, value );
	}

	/**
	 * Handle changes with global checkbox for access panel.
	 *
	 * @param {boolean} value New access value for all properties.
	 * @since 1.0.0
	 */
	function handleOnGlobalAccessChange( value ) {
		const newAccess = mapValues( block.access, ( postTypeValues ) =>
			mapValues( postTypeValues, () => value )
		);

		handleBlockChange( {
			access: newAccess,
		} );
	}

	function renderPanel( {
		label,
		link,
		name: panelName,
		renderContent,
		renderTrigger,
	} ) {
		return (
			<CollapsibleItem
				key={ `${ name }/${ panelName }` }
				uuid={ panelName }
				className={ `collapsible__wrapper--${ panelName }` }
				trigger={ renderTrigger( {
					label,
					link,
					globalActivation,
					onChange: ( { checked } ) =>
						handleOnGlobalAccessChange( checked ),
				} ) }
			>
				{ renderContent( {
					disabled:
						'supports' === panelName && ! block.supports_override,
					value: block[ panelName ],
					onChange: ( checked ) =>
						handleBlockChange( {
							[ panelName ]: checked,
						} ),
				} ) }
			</CollapsibleItem>
		);
	}

	function renderFakePanel( {
		label,
		link,
		name: panelName,
		renderTrigger,
	} ) {
		return (
			<CollapsibleFake
				key={ `${ name }/${ panelName }` }
				uuid={ panelName }
				className={ `collapsible__wrapper--${ panelName }` }
				trigger={ renderTrigger( {
					label,
					link,
					globalActivation,
					onChange: ( { checked } ) =>
						handleOnGlobalAccessChange( checked ),
				} ) }
			/>
		);
	}

	return (
		<div className="bmfbe-block">
			<StatusIcon status={ status } />
			<div className="bmfbe-block__content">
				<Icon icon={ block.icon } />
				<Description
					classPrefix="block"
					name={ name }
					title={ block.title }
					description={ block.description }
				/>
			</div>
			<IndeterminateToggleControl
				label={ __( 'Override supports?', 'bmfbe' ) }
				className="bmfbe-block__override-supports"
				checked={ block.supports_override }
				onChange={ ( { checked } ) =>
					handleBlockChange( {
						supports_override: checked,
					} )
				}
			/>
			<CollapsibleContainer>
				{ panels
					.filter(
						( { name: panelName } ) =>
							// Hide empty panels.
							( ! Array.isArray( block[ panelName ] ) ||
								block[ panelName ].length > 0 ) &&
							// Hide supports panel.
							( 'supports' !== panelName ||
								block.supports_override )
					)
					.map( ( panel ) =>
						'access' === panel.name && displayGlobalActivation
							? renderFakePanel( panel )
							: renderPanel( panel )
					) }
			</CollapsibleContainer>
		</div>
	);
}
