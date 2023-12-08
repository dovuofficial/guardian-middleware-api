import { EntityState } from 'src/config/guardianTags'

/**
 * Filters an array of objects based on specified criteria and an optional entity state.
 * If the entity state is provided, only items matching the state are included.
 * If the entity state is null or undefined, all items are included regardless of their state.
 *
 * @param {any[]} data - The array of objects to be filtered.
 * @param {{ [key: string]: any }} filters - An object representing the filter criteria.
 *                                           Each key-value pair corresponds to a property
 *                                           and its desired value within the nested objects
 *                                           of the 'credentialSubject' array.
 * @param {EntityState | null} [entityState=falsely] - An optional parameter to filter items
 *                                                  based on their entity state. If null or
 *                                                  undefined, items are not filtered by state.
 * @returns {any[]} An array containing only those objects from the input 'data' array that meet
 *                  all the filter criteria and, if specified, match the entity state.
 *
 * @example
 * // Example usage
 * const filteredData = applyFilters(data, yourFilters, EntityState.APPROVED);
 */
const applyFilters = (
	data: any[],
	filters: { [key: string]: any },
	status: EntityState | null
): any[] =>
	data.filter(
		(item) =>
			(!status || item?.option?.status === status) &&
			item?.document?.credentialSubject.some((nestedItem) =>
				Object.keys(filters).every(
					(filterKey) => nestedItem[filterKey] === filters[filterKey]
				)
			)
	)

export default applyFilters
