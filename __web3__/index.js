import { ethers } from "ethers"
import { ERC20_ABI, PAIR_ABI, PUMP_FUN_ABI, PUMP_FUN_CA, ROUTER_ABI, ROUTER_CA, WETH } from "./config.js"
import { getProvider, getSignerI, getSignerII } from "./init.js"

export const launch = async () => {
    const p_f = new ethers.Contract(
        PUMP_FUN_CA,
        PUMP_FUN_ABI,
        getSignerI()
    )

    try {
        const launch = await p_f.launch(
            "Pump.Fun",
            "P.F",
            "The perfect bull run ERC20 token. To the moon 🚀.",
            "https://ipfs.io/pump:fun",
            ["https://x.com/Pump:Fun", "https://t.me/Pump:Fun", "https://youtube.com/Pump:Fun", "https://pump.fun"],
            1000000,
            5,
            "0xAe3A4B3d172FcD16604eb4eaD1a01d41a7f2Ac2e",
            {value: ethers.parseEther("0.05")}
        )
        // console.log(launch)

        p_f.on("Launched", (token, pair, n, e) => {
            console.log(token, pair, n);
        })

        return true
    } catch (error) {
        console.log(error)
    }
}

export const swap = async () => {
    const router = new ethers.Contract(
        ROUTER_CA,
        ROUTER_ABI,
        getSignerII()
    )

    const pair = new ethers.Contract(
        "0x8d86c4Cb9A61876855617298BeD249F87A628B58",
        PAIR_ABI,
        getProvider()
    )

    const token = new ethers.Contract(
        "0xd240d2810dc482FF820A82DE282c9230FEbE5352",
        ERC20_ABI,
        getSignerII()
    )

    try {
        // await router.swapETHForTokens(
        //     "0xd240d2810dc482FF820A82DE282c9230FEbE5352",
        //     "0x03640D168B2C5F35c9C7ef296f0F064a90E5FA62",
        //     {value: ethers.parseEther("0.0002")}
        // )

        await router.swapTokensForETH(
            ethers.parseEther("50000"),
            "0xd240d2810dc482FF820A82DE282c9230FEbE5352",
            "0x6627f8ddc81057368F9717042E38E3DEcb68dAc3"
        )

        // const amountOut = await router.getAmountsOut(
        //     "0xd240d2810dc482FF820A82DE282c9230FEbE5352",
        //     WETH,
        //     ethers.parseEther("0.0002")
        // )
        // console.log(ethers.formatEther(amountOut))

        // await token.approve("0xe5E7f83281B062f3348c0e0Fef42724207E3bAD3", ethers.parseEther("50000"))

        // token.on("Approval", (owner, spender, value) => {
        //     console.log(owner, spender, ethers.formatEther(value))
        // })

        pair.on("Swap", (amount0In, amount0Out, amount1In, amount1Out, e) => {
            console.log(amount0In, amount0Out, amount1In, amount1Out);
        })

        return true
    } catch (error) {
        console.log(error)
    }
}

export const remove = async () => {
    const p_f = new ethers.Contract(
        PUMP_FUN_CA,
        PUMP_FUN_ABI,
        getSignerI()
    )

    const pair = new ethers.Contract(
        "0x8d86c4Cb9A61876855617298BeD249F87A628B58",
        PAIR_ABI,
        getProvider()
    )

    try {
        await p_f.deploy("0xd240d2810dc482FF820A82DE282c9230FEbE5352")

        pair.on("Burn", (reserve0, reserve1, lp, e) => {
            console.log(reserve0, reserve1, lp);
        })

        return true
    } catch (error) {
        console.log(error)
    }
}

export const get = async () => {
    const pair = new ethers.Contract(
        "0x8d86c4Cb9A61876855617298BeD249F87A628B58",
        PAIR_ABI,
        getProvider()
    )

    const token = new ethers.Contract(
        "0xd240d2810dc482FF820A82DE282c9230FEbE5352",
        ERC20_ABI,
        getProvider()
    )

    try {
        const lp = await pair.liquidityProvider()
        const reserves = await pair.getReserves()
        const kLast = await pair.kLast()
        const priceALast = await pair.priceALast()
        const priceBLast = await pair.priceBLast()

        console.log(lp)
        console.log(
            ethers.formatEther(reserves[0]),
            ethers.formatEther(reserves[1]),
            Number(reserves[2])
        )
        console.log(Number(ethers.formatEther(kLast[0])) * Number(ethers.formatEther(kLast[1])))
        console.log(Number(ethers.formatEther(priceALast[0])) / Number(ethers.formatEther(priceALast[1])))
        console.log(Number(ethers.formatEther(priceBLast[0])) / Number(ethers.formatEther(priceBLast[1])))

        const supply = await token.totalSupply()
        const decimals = await token.decimals()
        const balance = await token.balanceOf("0x8d86c4Cb9A61876855617298BeD249F87A628B58")
        const balance_ = await token.balanceOf("0x03640D168B2C5F35c9C7ef296f0F064a90E5FA62")
        const _balance = await token.balanceOf("0x6627f8ddc81057368F9717042E38E3DEcb68dAc3")

        console.log(ethers.formatEther(supply))
        console.log(ethers.formatEther(balance))
        console.log(ethers.formatEther(balance_))
        console.log(ethers.formatEther(_balance))
        console.log(Number(decimals))

        return true
    } catch (error) {
        console.log(error)
    }
}