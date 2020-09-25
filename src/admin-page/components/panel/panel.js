/**
 * External dependencies
 */
import classnames from 'classnames';
import { find } from 'lodash';

/**
 * WordPress dependencies
 */
import { useEffect, useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import useSearchForm from '../../../hooks/use-search-form';
import { STATUS_LOADING } from '../../../stores/blocks/constants';
import NotFound from '../not-found';
import SearchForm from '../search-form';
import { CollapsibleContainer, CollapsibleItem } from '../collapsible';

export default function Panel( {
	categories,
	className,
	children,
	items,
	labels,
	status,
} ) {
	const {
		filteredItems,
		setItems,
		filterValue,
		setFilterValue,
	} = useSearchForm();

	const filteredChildren = useMemo( () => {
		const childrenItems = {};

		filteredItems.forEach( ( item ) => {
			item.categories.forEach( ( category ) => {
				childrenItems[ category ] = [
					...( childrenItems[ category ] ?? [] ),
					find(
						children,
						( child ) => child.props.name === item.name
					),
				];
			} );
		} );

		return childrenItems;
	}, [ filteredItems ] );

	const filteredCategories = useMemo( () => {
		return categories.filter(
			( { slug } ) => filteredChildren[ slug ]?.length
		);
	}, [ filteredChildren ] );

	// Initialize items.
	useEffect( () => {
		setItems( items );
	}, [ items ] );

	return (
		<div className={ classnames( 'bmfbe-settings-panel', className ) }>
			{ STATUS_LOADING !== status && 0 !== categories.length && (
				<>
					<SearchForm
						value={ filterValue }
						placeholder={ labels.searchForm }
						onChange={ setFilterValue }
					/>
					{ 0 === filteredItems.length && (
						<NotFound label={ labels.notFound } />
					) }
					{ 0 !== filteredItems.length &&
						0 !== filteredCategories.length && (
							<CollapsibleContainer
								preOpened={ [ filteredCategories[ 0 ].slug ] }
							>
								{ filteredCategories.map( ( category ) => (
									<CollapsibleItem
										key={ category.slug }
										uuid={ category.slug }
										trigger={
											<>
												{ category.title }
												<em>
													(
													{
														filteredChildren[
															category.slug
														].length
													}
													)
												</em>
											</>
										}
									>
										{ filteredChildren[ category.slug ] }
									</CollapsibleItem>
								) ) }
							</CollapsibleContainer>
						) }
				</>
			) }
		</div>
	);
}
