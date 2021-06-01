const baseUrl = `http://localhost:8080`;

export default async function getUsers(endpoint) {
	const response = await fetch(`${baseUrl}/${endpoint}`);
	return response.json();
}