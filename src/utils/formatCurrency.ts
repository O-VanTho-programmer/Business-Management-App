const formatCurrency = (amount: number | string) => {

    const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/\./g, '')) : amount;
    return new Intl.NumberFormat('vi-VN', { // Using Vietnamese locale for currency format
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numAmount);
};

export default formatCurrency;