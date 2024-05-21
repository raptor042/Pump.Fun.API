import { ethers } from "ethers"
import { ERC20_ABI, PAIR_ABI, PUMP_FUN_ABI, PUMP_FUN_CA, ROUTER_ABI, ROUTER_CA } from "./config.js"
import { getProvider, getSignerI, getSignerII } from "./init.js"

export const launch = async () => {
    const p_f = new ethers.Contract(
        PUMP_FUN_CA,
        PUMP_FUN_ABI,
        getSignerII()
    )

    try {
        const launch = await p_f.launch(
            "Pump.Fun",
            "P.F",
            "The perfect bull run ERC20 token. To the moon 🚀.",
            "https://ipfs.io/pump:fun",
            ["https://x.com/Pump:Fun", "https://t.me/Pump:Fun", "https://youtube.com/Pump:Fun", "https://pump.fun"],
            100000,
            5,
            ethers.ZeroAddress,
            {value: ethers.parseEther("0.01")}
        )
        // console.log(launch)

        p_f.on("Launched", (token, pair, n, e) => {
            console.log(token, pair, n);
        })

        return launch
    } catch (error) {
        console.log(error)
    }
}

export const swap = async () => {
    const router = new ethers.Contract(
        ROUTER_CA,
        ROUTER_ABI,
        getSignerI()
    )

    const pair = new ethers.Contract(
        "0x182E5fac0863244930F53f9Da9a07155066e8DA3",
        PAIR_ABI,
        getProvider()
    )

    const token = new ethers.Contract(
        "0x680462Ff703695A4993b10D3298BCD9606c90b0A",
        ERC20_ABI,
        getProvider()
    )

    try {
        // const reserves = await pair.getReserves()
        // const kLast = await pair.kLast()
        // const priceALast = await pair.priceALast()
        // const priceBLast = await pair.priceBLast()

        // console.log(
        //     ethers.formatEther(reserves[0]),
        //     ethers.formatEther(reserves[1]),
        //     Number(reserves[2])
        // )
        // console.log(kLast)
        // console.log(priceALast)
        // console.log(priceBLast)

        // console.log(Number(ethers.formatEther(kLast[0])) * Number(ethers.formatEther(kLast[1])))
        // console.log(Number(ethers.formatEther(priceALast[0])) / Number(ethers.formatEther(priceALast[1])))
        // console.log(Number(ethers.formatEther(priceBLast[0])) / Number(ethers.formatEther(priceBLast[1])))

        // const supply = await token.totalSupply()
        // const decimals = await token.decimals()
        // const balance = await token.balanceOf("0x182E5fac0863244930F53f9Da9a07155066e8DA3")

        // console.log(ethers.formatEther(supply))
        // console.log(ethers.formatEther(balance))
        // console.log(Number(decimals))

        const swap = await router.swapETHForTokens(
            "0x680462Ff703695A4993b10D3298BCD9606c90b0A",
            "0x03640D168B2C5F35c9C7ef296f0F064a90E5FA62",
            {value: ethers.parseEther("0.0002")}
        )

        token.on("Approval", (owner, spender, value, e) => {
            console.log(owner, spender, value);
        })

        pair.on("Swap", (amount0In, amount0Out, amount1In, amount1Out, e) => {
            console.log(amount0In, amount0Out, amount1In, amount1Out);
        })

        return true
    } catch (error) {
        console.log(error)
    }
}