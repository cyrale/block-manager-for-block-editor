export default function Head( { children } ) {
	// Hide head if there is less than 2 columns.
	// Assume that more than one user role have access to all post types.
	if ( children.length < 2 ) {
		return <></>;
	}

	return (
		<thead>
			<tr>
				<td></td>
				{ children }
			</tr>
		</thead>
	);
}
