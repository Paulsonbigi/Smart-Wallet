export const currencyUnit = async(currencyValue: number) => {
    return Math.round(currencyValue * 100)
}

export const currencyValue = async(currencyUnit: number) => {
    return (currencyUnit / 100).toFixed(2)
}
