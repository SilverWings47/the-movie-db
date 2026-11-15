import { intlFormat } from 'date-fns';

export function formatDate(date: string): string {
	const formattedDate = intlFormat(
		date,
		{
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		},
		{
			locale: 'en-US',
		},
	);

	return formattedDate;
}
