/**
 * External dependencies
 */
import classnames from 'classnames';
import { find } from 'lodash';

/**
 * WordPress dependencies
 */
import { useEffect, useMemo, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import useSearchForm from '../../../hooks/use-search-form';
import { STATUS_LOADING } from '../../../stores/blocks/constants';
import NotFound from '../not-found';
import SearchForm from '../search-form';
import Category from './category';
import Container from './container';

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

	const [ displayedCategories, setDisplayedCategories ] = useState( {} );

	// Initialize items.
	useEffect( () => {
		setItems( items );
	}, [ items ] );

	// Set displayed category.
	useEffect( () => {
		const defaultDisplayedCategories = {};

		categories.forEach( ( { slug }, index ) => {
			defaultDisplayedCategories[ slug ] = 0 === index;
		} );

		setDisplayedCategories( defaultDisplayedCategories );
	}, [ categories ] );

	const filteredChildren = useMemo( () => {
		const result = {};

		filteredItems.forEach( ( item ) => {
			item.categories.forEach( ( category ) => {
				result[ category ] = [
					...( result[ category ] ?? [] ),
					find(
						children,
						( child ) => child.props.name === item.name
					),
				];
			} );
		} );

		return result;
	}, [ filteredItems ] );

	/**
	 * Handle changes with accordion. Display or hide categories.
	 *
	 * @param {string[]} accordionNames Names of displayed categories.
	 * @since 1.0.0
	 */
	function handleAccordionChange( accordionNames ) {
		const currentDisplayedCategories = {};

		categories.forEach( ( { slug } ) => {
			currentDisplayedCategories[ slug ] = accordionNames.includes(
				slug
			);
		} );

		setDisplayedCategories( currentDisplayedCategories );
	}

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
					{ 0 !== filteredItems.length && (
						<Container
							categories={ categories }
							onChange={ handleAccordionChange }
						>
							{ categories
								.filter(
									( { slug } ) =>
										filteredChildren[ slug ]?.length
								)
								.map( ( category ) => (
									<Category
										key={ category.slug }
										category={ category }
										count={
											filteredChildren[ category.slug ]
												.length
										}
									>
										{ displayedCategories[
											category.slug
										] && filteredChildren[ category.slug ] }
									</Category>
								) ) }
						</Container>
					) }
				</>
			) }
		</div>
	);
}
