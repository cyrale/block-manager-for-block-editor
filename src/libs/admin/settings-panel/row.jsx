const {
	url: { cleanForSlug },
} = wp;

export default function Row( { children, name } ) {
	const className =
		'bmfbe-settings-panel__row bmfbe-settings-panel__row--' +
		cleanForSlug( name );

	return <div className={ className }>{ children }</div>;
}
