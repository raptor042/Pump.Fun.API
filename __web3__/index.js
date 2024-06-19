import { ethers } from "ethers"
import { ERC20_ABI, FACTORY_ABI, FACTORY_CA, PAIR_ABI, PUMP_FUN_ABI, PUMP_FUN_CA, ROUTER_ABI, ROUTER_CA, WETH } from "./config.js"
import { getProvider, getSigner, getSignerI, getSignerII } from "./init.js"

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
        getSignerI()
    )

    const pair = new ethers.Contract(
        "0x5dda4152617990Cb755B61cb554c987029a33451",
        PAIR_ABI,
        getProvider()
    )

    const token = new ethers.Contract(
        "0x6B178234211d1C7B26Ee58c8c4AdC33F84d685Ae",
        ERC20_ABI,
        getSignerI()
    )

    try {
        // await router.swapETHForTokens(
        //     "0x6B178234211d1C7B26Ee58c8c4AdC33F84d685Ae",
        //     "0x6627f8ddc81057368F9717042E38E3DEcb68dAc3",
        //     {value: ethers.parseEther("0.00012")}
        // )

        await router.swapTokensForETH(
            ethers.parseEther("25000"),
            "0x6B178234211d1C7B26Ee58c8c4AdC33F84d685Ae",
            "0x03640D168B2C5F35c9C7ef296f0F064a90E5FA62"
        )

        // const amountOut = await router.getAmountsOut(
        //     "0x6B178234211d1C7B26Ee58c8c4AdC33F84d685Ae",
        //     WETH,
        //     ethers.parseEther("0.0002")
        // )
        // console.log(ethers.formatEther(amountOut))

        // await token.approve("0xC4AF297Dd1e63Efb6aE5C751eeAD554aB8A5DDF0", ethers.parseEther("50000"))

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
        getSigner()
    )

    const factory = new ethers.Contract(
        FACTORY_CA,
        FACTORY_ABI,
        getProvider()
    )

    const _pair = await factory.getPair(WETH, "0x8b554ED1619F5e08a2c5190ef42c5828741CDE3B")
    console.log(_pair)

    const pair = new ethers.Contract(
        _pair,
        PAIR_ABI,
        getProvider()
    )

    const lp = await pair.liquidityProvider()
    console.log(lp)

    try {
        await p_f.deploy("0x8b554ED1619F5e08a2c5190ef42c5828741CDE3B")

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
        "0x5dda4152617990Cb755B61cb554c987029a33451",
        PAIR_ABI,
        getProvider()
    )

    const token = new ethers.Contract(
        "0x6B178234211d1C7B26Ee58c8c4AdC33F84d685Ae",
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
        const balance = await token.balanceOf("0x5dda4152617990Cb755B61cb554c987029a33451")
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