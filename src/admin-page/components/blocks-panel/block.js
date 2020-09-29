/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	default as Access,
	AccessCollapsible as CollapsibleAccess,
} from '../access';
import { CollapsibleContainer, CollapsibleItem } from '../collapsible';
import { COLLECTION_STORE as BLOCKS_STORE } from '../../../stores/blocks/constants';
import Description from '../description';
import ExternalLink from '../external-link';
import Icon from './icon';
import IndeterminateToggleControl from '../indeterminate-toggle-control';
import StatusIcon from '../status-icon';
import Styles from './styles';
import Supports from '../supports';
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
		label: __( 'Supports', 'bmfbe' ),
		link:
			'https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#supports-optional',
		name: 'supports',
		renderContent: ( props ) => <Supports { ...props } />,
		renderTrigger: defaultRenderTrigger,
	},
	{
		label: __( 'Styles', 'bmfbe' ),
		link:
			'https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#styles-optional',
		name: 'styles',
		renderContent: ( props ) => <Styles { ...props } />,
		renderTrigger: defaultRenderTrigger,
	},
	{
		label: __( 'Variations', 'bmfbe' ),
		link:
			'https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#variations-optional',
		name: 'variations',
		renderContent: ( props ) => <Variations { ...props } />,
		renderTrigger: defaultRenderTrigger,
	},
	{
		label: __( 'Enable this block', 'bmfbe' ),
		name: 'access',
		renderContainer: ( props ) => {
			const { block, content, label, name, onChange } = props;

			return (
				<CollapsibleAccess
					key={ `${ block.name }/${ name }` }
					uuid={ name }
					className={ `collapsible__wrapper--${ name }` }
					label={ label }
					itemAccess={ block.access }
					onChange={ onChange }
				>
					{ content }
				</CollapsibleAccess>
			);
		},
		renderContent: ( props ) => <Access { ...props } />,
		renderTrigger: ( { label, globalActivation, onChange } ) => (
			<>
				<IndeterminateToggleControl
					onChange={ onChange }
					{ ...globalActivation }
				/>
				{ label }
			</>
		),
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
	const { block, status } = useSelect(
		( select ) => ( {
			block: select( BLOCKS_STORE ).getItem( name ),
			status: select( BLOCKS_STORE ).getStatus( name ),
		} ),
		[]
	);

	const { updateItem } = useDispatch( BLOCKS_STORE );

	/**
	 * Handle changes on block settings.
	 *
	 * @param {Object} value New block settings.
	 * @since 1.0.0
	 */
	function handleBlockChange( value ) {
		updateItem( name, value );
	}

	function renderPanel( {
		label,
		link,
		name: panelName,
		renderContainer,
		renderContent,
		renderTrigger,
	} ) {
		const onChange = ( value ) =>
			handleBlockChange( {
				[ panelName ]: value,
			} );

		const content = renderContent( {
			disabled: 'supports' === panelName && ! block.supports_override,
			onChange,
			value: block[ panelName ],
		} );

		if ( renderContainer ) {
			return renderContainer( {
				block,
				content,
				label,
				name: panelName,
				onChange,
			} );
		}

		return (
			<CollapsibleItem
				key={ `${ name }/${ panelName }` }
				uuid={ panelName }
				className={ `collapsible__wrapper--${ panelName }` }
				trigger={ renderTrigger( {
					label,
					link,
				} ) }
			>
				{ content }
			</CollapsibleItem>
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
					.map( ( panel ) => renderPanel( panel ) ) }
			</CollapsibleContainer>
		</div>
	);
}
