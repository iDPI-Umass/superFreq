import type { PageServerLoad } from './$types';
import { selectAllUsers } from 'src/lib/resources/users';

export const load: PageServerLoad = async () => {
	const selectUsers = selectAllUsers();
	const users = await selectUsers;

	return { users };
};
