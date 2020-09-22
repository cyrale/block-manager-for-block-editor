/**
 * External dependencies
 */
import { chunk } from 'lodash';

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { COLLECTION_STORE as BLOCKS_STORE } from '../../stores/blocks/constants';
import { COLLECTION_STORE as PATTERNS_STORE } from '../../stores/patterns/constants';
import { ITEM_STORE as SETTINGS_STORE } from '../../stores/settings/constants';
import {
	STATUS_LOADING,
	STATUS_PENDING,
	STATUS_SAVING,
} from '../../stores/common/constants';
import StatusIcon from './status-icon';

export default function SaveContents() {
	const [ modificationCount, setModificationCount ] = useState( 0 );
	const [ modificationTotal, setModificationTotal ] = useState( 0 );

	const {
		modifiedBlocks,
		modifiedPatterns,
		isBlocksModified,
		isPatternsModified,
		isSettingsModified,
		getBlock,
		getPattern,
		settings,
		status,
	} = useSelect( ( select ) => {
		const settingsStore = select( SETTINGS_STORE );
		const blocksStore = select( BLOCKS_STORE );
		const patternsStore = select( PATTERNS_STORE );

		let globalStatus = STATUS_PENDING;

		if (
			STATUS_LOADING === blocksStore.getStatus() ||
			STATUS_LOADING === patternsStore.getStatus() ||
			STATUS_LOADING === settingsStore.getStatus()
		) {
			globalStatus = STATUS_LOADING;
		} else if (
			STATUS_SAVING === blocksStore.getStatus() ||
			STATUS_SAVING === patternsStore.getStatus() ||
			STATUS_SAVING === settingsStore.getStatus()
		) {
			globalStatus = STATUS_SAVING;
		}

		return {
			modifiedBlocks: blocksStore.getModified(),
			modifiedPatterns: patternsStore.getModified(),
			isBlocksModified: blocksStore.isModified(),
			isPatternsModified: patternsStore.isModified(),
			isSettingsModified: settingsStore.isModified(),
			getBlock: blocksStore.getItem,
			getPattern: patternsStore.getItem,
			settings: settingsStore.getItem(),
			status: globalStatus,
		};
	}, [] );

	const { saveItem: saveSettings } = useDispatch( SETTINGS_STORE );
	const { saveItem: saveBlock } = useDispatch( BLOCKS_STORE );
	const { saveItem: savePattern } = useDispatch( PATTERNS_STORE );

	const isModified =
		isBlocksModified || isPatternsModified || isSettingsModified;

	async function batchProcess( items, cb ) {
		const fullItems = items.map( ( { name } ) => {
			return cb.get( name );
		} );

		return chunk( fullItems, 10 ).reduce(
			async ( memo, part ) => [
				...( await memo ),
				...( await Promise.all( part.map( cb.save ) ) ),
			],
			[]
		);
	}

	async function handleOnClick() {
		let currentModificationTotal = 0;

		setModificationCount( 0 );

		if ( isModified ) {
			if ( isSettingsModified ) {
				currentModificationTotal += 1;
			}

			currentModificationTotal += modifiedBlocks.length;
			currentModificationTotal += modifiedPatterns.length;

			setModificationTotal( currentModificationTotal );
		} else {
			setModificationTotal( 0 );
		}

		if ( isSettingsModified ) {
			( async () => {
				await saveSettings( settings );
				setModificationCount( ( prevCount ) => prevCount + 1 );
			} )();
		}

		batchProcess( modifiedBlocks, {
			get: getBlock,
			save: async ( item ) => {
				const result = await saveBlock( item );
				setModificationCount( ( prevCount ) => prevCount + 1 );

				return result;
			},
		} );

		batchProcess( modifiedPatterns, {
			get: getPattern,
			save: async ( item ) => {
				const result = await savePattern( item );
				setModificationCount( ( prevCount ) => prevCount + 1 );

				return result;
			},
		} );
	}

	return (
		<div className="bmfbe-save-contents">
			<div className="bmfbe-save-contents__loader">
				<StatusIcon
					status={ status }
					percentage={
						0 === modificationCount
							? undefined
							: Math.round(
									( 100 * modificationCount ) /
										modificationTotal
							  )
					}
				/>
			</div>
			<Button
				className="bmfbe-save-contents__button"
				disabled={ ! isModified || STATUS_PENDING !== status }
				isBusy={ STATUS_PENDING !== status }
				isPrimary={ true }
				onClick={ handleOnClick }
			>
				{ __( 'Save Changes', 'bmfbe' ) }
			</Button>
		</div>
	);
}
