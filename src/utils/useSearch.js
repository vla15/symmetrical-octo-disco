import React, { useEffect, useState } from 'react';
import getUsers from '../api/index';

let timeout = null;

function filterResults(persons, searchString) {
	return persons.filter(person => {
		const { name, email } = person;
		const lowerCaseName = name.toLowerCase();
		const lowerCaseEmail = email.toLowerCase();
		if (lowerCaseName.indexOf(searchString) >= 0 || lowerCaseEmail.indexOf(searchString) >= 0) return person;
	})
}

function orderResults(persons, searchString) {
	return persons.slice().sort((a, b) => {
		const [aFirst, aLast] = a.name.toLowerCase().split(' ');
		const [bFirst, bLast] = b.name.toLowerCase().split(' ');
		const aEmailIndex = a.email.toLowerCase().indexOf(searchString);
		const bEmailIndex = b.email.toLowerCase().indexOf(searchString);

		// prioritize full first name 
		if (aFirst === searchString) return -1;
		if (bFirst === searchString) return 1;

		// then full last name
		if (aLast === searchString) return -1;
		if (bLast === searchString) return 1;

		//no match on a have b higher
		if (aEmailIndex === -1) return 1;
		//no match on b have a higher
		if (bEmailIndex === -1) return -1;

		//if both are equal
		if (aEmailIndex === bEmailIndex) {
			//sort by name
			if (a.name < b.name) return -1;
			return 1;
		}
		// if both have search term in email
		// compare when it occurs in the string
		if (aEmailIndex < bEmailIndex) {
			return -1
		} else {
			return 1;
		}
	});
}

export default function useSearch(searchTerm) {
	const [isLoading, setIsLoading] = useState(false);
	const [response, setResponse] = useState([]);
	useEffect(() => {
		async function getResults() {
			const res = await getUsers(`?search=${encodeURIComponent(searchTerm)}`);
			const searchString = searchTerm.toLowerCase();
			const filteredResponse = filterResults(res, searchString);
			const orderedReponse = orderResults(filteredResponse, searchString);
			setResponse(orderedReponse);
			setIsLoading(false);
		}
		if (searchTerm.length > 0) {
			setIsLoading(true);
			timeout = setTimeout(() => {
				if (timeout) {
					clearTimeout(timeout);
				}
				getResults();
			}, 1000);
		}
		return () => clearTimeout(timeout);
	}, [searchTerm]);
	return {
		isLoading,
		response
	}
}