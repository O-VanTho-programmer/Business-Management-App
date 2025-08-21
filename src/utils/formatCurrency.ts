const formatCurrency = (amount: number | string) => {

    let numAmount : number;

    if(typeof amount === 'string'){
        const clean = amount.replace(/[^\d.-]/g, "");
        numAmount = parseFloat(clean) || 0;
    }else {
        numAmount = amount;
    }

    return new Intl.NumberFormat('vi-VN', { // Using Vietnamese locale for currency format
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numAmount);
};

export default formatCurrency;