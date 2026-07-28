export const formatMoney = (value: number | string | null | undefined) => {
	const amount = Number(value ?? 0);

	return `Rs. ${new Intl.NumberFormat('en-PK', {
		maximumFractionDigits: 0
	}).format(amount)}`;
};
