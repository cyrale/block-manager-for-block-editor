import Table from './table';
import Head from './head';
import Title from './title';
import Body from './body';
import Item from './item';
import { SETTINGS_STORE } from '../../stores/settings/constants';

const { difference, mapValues, merge, uniq } = lodash;
const {
	data: { useSelect },
} = wp;

function extractRows( values ) {
	return Object.keys( values );
}

function extractCols( values ) {
	return Object.values( values ).reduce(
		( acc, col ) => [ ...acc, ...difference( Object.keys( col ), acc ) ],
		[]
	);
}

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

function mergeRowsValues( values ) {
	return mapValues( values, ( rowValues ) => {
		const onlyValues = Object.values( rowValues );
		const uniqValues = uniq( onlyValues );

		return {
			all: {
				checked: 1 <= onlyValues.length && 1 === uniqValues.length,
				indeterminate: 2 <= onlyValues.length && 1 < uniqValues.length,
			},
		};
	} );
}

function splitToCheckAndIndeterminateValues( values ) {
	return mapValues( values, ( rowValues ) =>
		mapValues( rowValues, ( colValue ) => ( {
			checked: colValue,
			indeterminate: false,
		} ) )
	);
}

export default function Access( { onChange, value } ) {
	const settings = useSelect(
		( select ) => select( SETTINGS_STORE ).getSettings(),
		[]
	);

	let rows;
	let cols;

	let modifiedValues = {};

	if (
		settings.limit_access_by_post_type &&
		! settings.limit_access_by_user_group
	) {
		rows = extractRows( value );
		cols = [ 'all' ];

		modifiedValues = mergeRowsValues( value );
	} else if (
		! settings.limit_access_by_post_type &&
		settings.limit_access_by_user_group
	) {
		rows = extractCols( value );
		cols = [ 'all' ];

		modifiedValues = mergeRowsValues( invertRowsCols( value ) );
	} else {
		rows = extractRows( value );
		cols = extractCols( value );

		modifiedValues = splitToCheckAndIndeterminateValues( value );
	}

	function handleOnChange( index, change ) {
		let newValues = merge( {}, value );

		if (
			settings.limit_access_by_post_type &&
			! settings.limit_access_by_user_group
		) {
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
			newValues = mapValues( newValues, ( rowValues ) =>
				mapValues( rowValues, ( colValue, col ) => {
					if ( col === index ) {
						colValue = change.value;
					}

					return colValue;
				} )
			);
		} else {
			newValues = merge( newValues, {
				[ index ]: {
					[ change.col ]: change.value,
				},
			} );
		}

		return onChange && onChange( newValues );
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
