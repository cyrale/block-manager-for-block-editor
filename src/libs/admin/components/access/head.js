export function displayHead( children ) {
	// Hide head if there is less than 2 columns.
	// Assume that more than one user role have access to all post types.
	return children.length >= 2;
}

export default function Head( { children } ) {
	if ( ! displayHead( children ) ) {
		return <></>;
	}

	return (
		<thead>
			<tr>
				<th></th>
				{ children }
			</tr>
		</thead>
	);
}
