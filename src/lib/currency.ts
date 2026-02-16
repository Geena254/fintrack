export const formatCurrency = (amount: number): string => {
  return `KSh ${amount.toLocaleString()}`;
};

export const formatCurrencyFixed = (amount: number): string => {
  return `KSh ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};
