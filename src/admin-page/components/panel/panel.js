/**
 * External dependencies
 */
import { find, intersection } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { useEffect, useMemo, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { CollapsibleContainer, CollapsibleItem } from '../collapsible';
import Loader from '../loader';
import NotFound from '../not-found';
import { STATUS_LOADING } from '../../../stores/common/constants';
import SearchForm from '../search-form';
import useSearchForm from '../../../hooks/use-search-form';

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

	const [ opened, setOpened ] = useState( [] );

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

	useEffect( () => {
		if ( categories.length ) {
			setOpened( [ categories[ 0 ].slug ] );
		}
	}, [ categories ] );

	// Keep one collapsible item opened.
	useEffect( () => {
		if (
			opened.length &&
			filteredCategories.length &&
			0 ===
				intersection(
					opened,
					filteredCategories.map( ( c ) => c.slug )
				).length
		) {
			setOpened( [ filteredCategories[ 0 ].slug ] );
		}
	}, [ filteredCategories ] );

	function handleCollapsibleOnChange( collapsibleOpened ) {
		setOpened( collapsibleOpened );
	}

	return (
		<div className={ classnames( 'bmfbe-settings-panel', className ) }>
			{ STATUS_LOADING === status && <Loader label={ labels.loading } /> }
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
								// preOpened={ [ filteredCategories[ 0 ].slug ] }
								onChange={ handleCollapsibleOnChange }
							>
								{ filteredCategories.map( ( category ) => (
									<CollapsibleItem
										key={ category.slug }
										uuid={ category.slug }
										opened={ opened.includes(
											category.slug
										) }
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
