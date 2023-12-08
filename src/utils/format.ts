/**
 * Joins elements of an array into a string with a custom delimiter, and a
 * different final delimiter before the last element. This function is useful
 * for creating human-readable lists from array elements.
 *
 * @param {string[]} array - The array of strings to be joined.
 * @param {string} delimiter - The delimiter to use between all elements
 *                             except the last two.
 * @param {string} finalDelimiter - The delimiter to use between the second-to-last
 *                                  and last element.
 * @returns {string} A string formed by joining the array elements, using the specified
 *                   delimiters between elements, and especially between the last two.
 *
 * @example
 * // returns 'apple, orange, or banana'
 * joinWithFinalDelimiter(['apple', 'orange', 'banana'], ', ', ', or ');
 */
function joinWithFinalDelimiter(
	array: string[],
	delimiter: string,
	finalDelimiter: string
): string {
	if (array.length <= 1) return array.join('')
	const last = array.pop()
	return `${array.join(delimiter)}${finalDelimiter}${last}`
}

/**
 * Joins elements of an array into a human-readable list separated by commas,
 * with 'or' before the last element. This function is a specialized wrapper
 * around 'joinWithFinalDelimiter', specifically tailored for lists where
 * elements are typically separated by commas, and 'or' is used before the last element.
 *
 * @param {string[]} array - The array of strings to be joined into a list.
 * @returns {string} A string representing a comma-separated list with 'or'
 *                   before the last element.
 *
 * @example
 * // returns 'apple, orange, or banana'
 * joinWithComma(['apple', 'orange', 'banana']);
 */
function joinWithComma(array: string[]): string {
	return joinWithFinalDelimiter(array, ', ', ', or ')
}

export default {
	joinWithComma,
}
