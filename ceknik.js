const express = require('express');
const app = express();
const puppeteer = require('puppeteer');


app.get('/data/:nik', async (req, res) => {
    let browser = null;
    const datanik = req.params.nik;
    try {
 
    const EnterText = async (selector, text) => {
        await page.click(selector);
        await page.keyboard.type(text);
      }
     
      const C_HEADELESS = true
      const C_OPTIMIZE = true
      const C_SLOWMOTION = 5 
      const U_HOMEPAGE = 'https://cekdptonline.kpu.go.id'     

       browser = await puppeteer.launch({
            headless: C_HEADELESS,
            slowMo: C_SLOWMOTION,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process', // <- this one doesn't works in Windows
                '--disable-gpu',
                '--disable-infobars',
                '--window-position=0,0',
                '--ignore-certifcate-errors',
                '--ignore-certifcate-errors-spki-list',
                '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'
            ],
        });
        const [page] = await browser.pages();

          await page.goto(U_HOMEPAGE, {
            waitUntil: 'networkidle2'
        });

        const FORMULIR = '#__BVID__21';
        await EnterText(FORMULIR, datanik); 

        const searchResultSelector = '#root > main > div.container > div > div > div > div.card-body > div > div > div.wizard-buttons > button:nth-child(2)';
        await page.waitForSelector(searchResultSelector);
        await page.click(searchResultSelector);

            const namaSelector = await page.waitForSelector(
                'xpath///*[@id="root"]/main/div[3]/div/div/div/div[1]/div/div/div[3]/div/div/div/p[2]'
            );
            const nama = await namaSelector.evaluate(el => el.textContent);
            const textSelector = await page.waitForSelector(
                'xpath///*[@id="root"]/main/div[3]/div/div/div/div[1]/div/div/div[3]/div/div/div/p[8]'
            );
            const hslTps = await textSelector.evaluate(el => el.textContent);
            const trimTps = hslTps.substring(0, hslTps.length);
            const myArray = trimTps.split(",");
           // console.log(trimTps)
           // console.log(myArray)
            res.jsonp({
                status: "SUKSES",
                nama:nama.trim(),
                tps: myArray[0].trim(),
                desa: myArray[1].trim(),
                kec: myArray[2].trim()
            });

    } catch (error) {   
        if (!res.headersSent) {
            res.jsonp({
                status: "GAGAL"
            });  
        }

    } finally {
        if (browser) {
            browser.close();
        }
    }
});

app.listen(8080, () => console.log('Listening on PORT: 8080'));