export default function ContentLayout( { children, innerRef } ) {
	return (
		<div className="bmfbe-settings__content" ref={ innerRef }>
			{ children }
		</div>
	);
}
