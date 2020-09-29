/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { COLLECTION_STORE as BLOCKS_STORE } from '../../../stores/blocks/constants';
import {
	default as Access,
	AccessCollapsible as CollapsibleAccess,
} from '../access';
import { CollapsibleContainer, CollapsibleItem } from '../collapsible';
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
		renderTrigger: ( { label, globalActivation, onChange } ) => (
			<>
				<IndeterminateToggleControl
					onChange={ onChange }
					{ ...globalActivation }
				/>
				{ label }
			</>
		),
		renderContent: ( props ) => <Access { ...props } />,
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
			value: block[ panelName ],
			onChange,
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
