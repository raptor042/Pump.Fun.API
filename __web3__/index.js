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

        return launch
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
        "0x58a5C97E42F6F7dDCE9F038364F597500F4dA2c0",
        PAIR_ABI,
        getProvider()
    )

    const token = new ethers.Contract(
        "0x25b6c30c8aeB85C9962C01ad68073e6842Fe7c01",
        ERC20_ABI,
        getSignerII()
    )

    try {
        // await router.swapETHForTokens(
        //     "0x25b6c30c8aeB85C9962C01ad68073e6842Fe7c01",
        //     "0x6627f8ddc81057368F9717042E38E3DEcb68dAc3",
        //     {value: ethers.parseEther("0.00025")}
        // )

        await router.swapTokensForETH(
            ethers.parseEther("50000"),
            "0x25b6c30c8aeB85C9962C01ad68073e6842Fe7c01",
            "0x6627f8ddc81057368F9717042E38E3DEcb68dAc3"
        )

        // const amountOut = await router.getAmountsOut(
        //     "0x25b6c30c8aeB85C9962C01ad68073e6842Fe7c01",
        //     WETH,
        //     ethers.parseEther("0.0002")
        // )
        // console.log(ethers.formatEther(amountOut))

        // await token.approve("0x2889f3A17242299414aEEf016a0587389a2e7c5a", ethers.parseEther("50000"))

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
        "0x58a5C97E42F6F7dDCE9F038364F597500F4dA2c0",
        PAIR_ABI,
        getProvider()
    )

    try {
        await p_f.deploy("0x25b6c30c8aeB85C9962C01ad68073e6842Fe7c01")

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
        "0x58a5C97E42F6F7dDCE9F038364F597500F4dA2c0",
        PAIR_ABI,
        getProvider()
    )

    const token = new ethers.Contract(
        "0x25b6c30c8aeB85C9962C01ad68073e6842Fe7c01",
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
        const balance = await token.balanceOf("0x58a5C97E42F6F7dDCE9F038364F597500F4dA2c0")
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