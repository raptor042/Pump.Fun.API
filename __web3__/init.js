import { ethers } from "ethers"
import { config } from "dotenv"

config()

export const getProvider = () => {
    return new ethers.JsonRpcProvider(process.env.BASE_API_URL)
}

export const getSigner = () => {
    return new ethers.Wallet(process.env.PRIVATE_KEY, getProvider())
}

export const getSignerI = () => {
    return new ethers.Wallet(process.env.PRIVATE__KEY, getProvider())
}

export const getSignerII = () => {
    return new ethers.Wallet(process.env.PRIVATE___KEY, getProvider())
}