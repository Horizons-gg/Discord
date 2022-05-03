const puppeteer = require("puppeteer")

let Browser
async function PrepBrowser() {
    Browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1500, height: 800 }, args: ['--no-sandbox', '--disable-setuid-sandbox'] })
}

async function Systems() {
    await process.env.systemsArray.forEach(async System => {
        const Page = await Browser.newPage()

        await Page.goto(`http://localhost:${process.env.port}/generate/system?id=${System}`).catch(err => console.log('Failed to Open Page:', System))

        if (!Page) return await Page.close()

        const Select = await Page.waitForSelector("#card_window").catch((err) => console.log(err))
        await Select.screenshot({ path: `./cache/systems/${System}.png` }).catch((err) => console.log(err))

        await Page.close()
    })
}



module.exports = {
    PrepBrowser,
    Systems
}