export const formatAddress = (address: string) => {
    if (address === "Multiple" || address === "Unknown") return address
    if (address.length > 12) {
        return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`
    }
    return address
}