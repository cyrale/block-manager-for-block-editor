import useShortID from '../../use-short-id';

const {
	url: { cleanForSlug },
} = wp;

const Item = ( {
	isActive,
	isDefault,
	label,
	name,
	onChange,
	title,
	withDefault,
} ) => {
	const shortID = useShortID( 'settings-item-' + cleanForSlug( name ) );

	function handleIsActiveChange() {
		if ( 'function' === typeof onChange ) {
			onChange( {
				isActive: ! isActive,
				isDefault,
			} );
		}
	}

	function handleIsDefaultChange() {
		if ( 'function' === typeof onChange ) {
			onChange( {
				isActive,
				isDefault: ! isDefault,
			} );
		}
	}

	return (
		<div className="bmfbe-block__settings-item">
			<label htmlFor={ shortID }>
				<input
					id={ shortID }
					type="checkbox"
					checked={ isActive }
					onChange={ handleIsActiveChange }
				/>
				{ label ?? title }
				{ name && <em>{ name }</em> }
			</label>
			{ withDefault && (
				<input
					type="checkbox"
					checked={ isDefault }
					onChange={ handleIsDefaultChange }
					disabled={ ! isActive }
				/>
			) }
		</div>
	);
};

export default Item;
