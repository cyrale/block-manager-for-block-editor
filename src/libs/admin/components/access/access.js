import { difference, mapValues, merge, noop, uniq } from 'lodash';

import { useSelect } from '@wordpress/data';

import Body from './body';
import Head from './head';
import Item from './item';
import { SETTINGS_STORE } from '../../stores/settings/constants';
import Table from './table';
import Title from './title';

/**
 * Extract row names in given object.
 *
 * @param {Object} values Object to extract row names.
 *
 * @return {string[]} Row names.
 * @since 1.0.0
 */
function extractRows( values ) {
	return Object.keys( values );
}

/**
 * Extract column names in given object.
 *
 * @param {Object} values Object to extract column names.
 *
 * @return {string[]} Column names.
 * @since 1.0.0
 */
function extractCols( values ) {
	return Object.values( values ).reduce(
		( acc, col ) => [ ...acc, ...difference( Object.keys( col ), acc ) ],
		[]
	);
}

/**
 * Invert rows and columns of given object.
 *
 * @param {Object} values Object to invert rows and columns.
 *
 * @return {Object} Object with rows and columns inverted.
 * @since 1.0.0
 */
function invertRowsCols( values ) {
	const invertedValues = {};

	Object.entries( values ).forEach( ( [ row, rowValues ] ) => {
		Object.entries( rowValues ).forEach( ( [ col, colValue ] ) => {
			if ( undefined === invertedValues[ col ] ) {
				invertedValues[ col ] = {};
			}

			invertedValues[ col ][ row ] = colValue;
		} );
	} );

	return invertedValues;
}

/**
 * Merge values of a row into an unique value.
 *
 * @param {Object} values Object with values to merge.
 *
 * @return {Object} Object with merged rows.
 * @since 1.0.0
 */
function mergeRowsValues( values ) {
	return mapValues( values, ( rowValues ) => {
		const onlyValues = Object.values( rowValues );
		const uniqValues = uniq( onlyValues );

		return {
			all: {
				checked:
					1 <= onlyValues.length &&
					1 === uniqValues.length &&
					uniqValues[ 0 ],
				indeterminate: 2 <= onlyValues.length && 1 < uniqValues.length,
			},
		};
	} );
}

/**
 * Split all values of an object into values with `checked` and `indeterminate` properties.
 *
 * @param {Object} values Object with values to split.
 *
 * @return {Object} Object with split values.
 * @since 1.0.0
 */
function splitToCheckAndIndeterminateValues( values ) {
	return mapValues( values, ( rowValues ) =>
		mapValues( rowValues, ( colValue ) => ( {
			checked: colValue,
			indeterminate: false,
		} ) )
	);
}

export default function Access( { onChange = noop, value } ) {
	const settings = useSelect(
		( select ) => select( SETTINGS_STORE ).getSettings(),
		[]
	);

	let rows; // Row names.
	let cols; // Column names.

	let modifiedValues = {}; // Modified values to be used by checkboxes.

	if (
		settings.limit_access_by_post_type &&
		! settings.limit_access_by_user_group
	) {
		// Display one dimension table: post types.
		rows = extractRows( value );
		cols = [ 'all' ];

		modifiedValues = mergeRowsValues( value );
	} else if (
		! settings.limit_access_by_post_type &&
		settings.limit_access_by_user_group
	) {
		// Display one dimension table: user roles.
		rows = extractCols( value );
		cols = [ 'all' ];

		modifiedValues = mergeRowsValues( invertRowsCols( value ) );
	} else {
		// Display 2 dimensions table: post types/user roles.
		rows = extractRows( value );
		cols = extractCols( value );

		modifiedValues = splitToCheckAndIndeterminateValues( value );
	}

	/**
	 * Handle change on access settings.
	 *
	 * @param {string} index Name of the post type (row) or user group (column) to change settings.
	 * @param {Object} change New value of settings.
	 */
	function handleOnChange( index, change ) {
		let newValues = merge( {}, value );

		if (
			settings.limit_access_by_post_type &&
			! settings.limit_access_by_user_group
		) {
			// Process values for one dimension table: post types.
			newValues = mapValues( newValues, ( rowValues, key ) => {
				if ( key === index ) {
					rowValues = mapValues( rowValues, () => change.value );
				}

				return rowValues;
			} );
		} else if (
			! settings.limit_access_by_post_type &&
			settings.limit_access_by_user_group
		) {
			// Process values for one dimension table: user roles.
			newValues = mapValues( newValues, ( rowValues ) =>
				mapValues( rowValues, ( colValue, col ) => {
					if ( col === index ) {
						colValue = change.value;
					}

					return colValue;
				} )
			);
		} else {
			// Process values for 2 dimensions table: post types/user roles.
			newValues = merge( newValues, {
				[ index ]: {
					[ change.col ]: change.value,
				},
			} );
		}

		// Pass new values to event callback.
		onChange( newValues );
	}

	return (
		<div className="bmfbe-block__access">
			<Table>
				<Head>
					{ cols.map( ( col ) => (
						<Title key={ col }>{ col }</Title>
					) ) }
				</Head>
				<Body>
					{ rows.map( ( row ) => {
						return (
							<Item
								key={ row }
								cols={ cols }
								values={ modifiedValues[ row ] }
								onChange={ ( e ) => handleOnChange( row, e ) }
							>
								{ row }
							</Item>
						);
					} ) }
				</Body>
			</Table>
		</div>
	);
}
