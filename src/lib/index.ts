export const getCellColor = (value: string) => {
	if (value.includes('wall')) return 'bg-gray-500';
	if (value.includes('trap')) return 'bg-red-500';
	if (value.includes('home')) return 'bg-blue-500';
	if (value.includes('stop')) return 'bg-green-500';
	return 'bg-white';
};
