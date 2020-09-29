/**
 * External dependencies
 */
import { difference, mapValues, merge, noop, uniq } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Head, { displayHead } from './head';
import Body from './body';
import Item from './item';
import { ITEM_STORE as SETTINGS_STORE } from '../../../stores/settings/constants';
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
		( select ) => select( SETTINGS_STORE ).getItem(),
		[]
	);

	let rows; // Row names.
	let cols; // Column names.

	let modifiedValues = {}; // Modified values to be used by checkboxes.

	if (
		settings.limit_access_by_section &&
		! settings.limit_access_by_user_group
	) {
		// Display one dimension table: post types.
		rows = extractRows( value );
		cols = [ 'all' ];

		modifiedValues = mergeRowsValues( value );
	} else if (
		! settings.limit_access_by_section &&
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
	 * Return an unique boolean from a collection.
	 *
	 * @param {Object.boolean} values Collection of boolean values.
	 *
	 * @return {boolean} Unique boolean.
	 * @since 1.0.0
	 */
	function flippedValue( values ) {
		const uniqValues = uniq( Object.values( values ) );
		return uniqValues.length !== 1 || ! uniqValues[ 0 ];
	}

	/**
	 * Flip values from column.
	 *
	 * @param {string} columnName Name of the column.
	 *
	 * @return {{}} All values with change on the desired column.
	 * @since 1.0.0
	 */
	function flipColumnValues( columnName ) {
		const newValues = merge( {}, value );
		const invertedValues = invertRowsCols( newValues );

		return mapValues( newValues, ( rowValues ) =>
			mapValues( rowValues, ( colValue, col ) => {
				if ( col === columnName ) {
					return flippedValue( invertedValues[ columnName ] );
				}

				return colValue;
			} )
		);
	}

	/**
	 * Flip values from row.
	 *
	 * @param {string} rowName Name of the row.
	 *
	 * @return {{}} All values with change on the desired row.
	 * @since 1.0.0
	 */
	function flipRowValues( rowName ) {
		const newValues = merge( {}, value );

		return mapValues( newValues, ( rowValues, row ) => {
			if ( row === rowName ) {
				return mapValues( rowValues, () => flippedValue( rowValues ) );
			}

			return rowValues;
		} );
	}

	/**
	 * Handle change on access settings.
	 *
	 * @param {string} index Name of the post type (row) or user group (column) to change settings.
	 * @param {Object} change New value of settings.
	 *
	 * @since 1.0.0
	 */
	function handleOnChange( index, change ) {
		let newValues = merge( {}, value );

		if (
			settings.limit_access_by_section &&
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
			! settings.limit_access_by_section &&
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

	/**
	 * Handle click on column title.
	 *
	 * @param {string} name Name of the column.
	 *
	 * @since 1.0.0
	 */
	function handleOnClickColumn( name ) {
		onChange( flipColumnValues( name ) );
	}

	/**
	 * Handle click on row title.
	 *
	 * @param {string} name Name of the row.
	 *
	 * @since 1.0.0
	 */
	function handleOnClickRow( name ) {
		if (
			! settings.limit_access_by_section &&
			settings.limit_access_by_user_group
		) {
			onChange( flipColumnValues( name ) );
		} else {
			onChange( flipRowValues( name ) );
		}
	}

	return (
		<div
			className={ classnames( 'bmfbe-block__access', {
				'bmfbe-block__access--without-head': ! displayHead( cols ),
			} ) }
		>
			<Table>
				<Head>
					{ cols.map( ( col ) => (
						<Title
							key={ col }
							className="column-title"
							onClick={ () => handleOnClickColumn( col ) }
						>
							{ col }
						</Title>
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
								onClick={ () => handleOnClickRow( row ) }
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
