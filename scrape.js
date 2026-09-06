const fs = require('fs');
const cheerio = require('cheerio');
const https = require('https');

const fetchUrl = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
};

const links = [
  "https://www.cdtmilwaukee.com/bicaklar",
  "https://www.cdtmilwaukee.com/vidalama",
  "https://www.cdtmilwaukee.com/arama?q=M12&category=293",
  "https://www.cdtmilwaukee.com/arama?q=m18&category=293",
  "https://www.cdtmilwaukee.com/elmas",
  "https://www.cdtmilwaukee.com/is-guvenligi-ekipmanlari"
];

async function scrape() {
  const products = [];
  const images = {
    m18: "",
    m12: "",
    elAletleri: "",
    isGuvenligi: ""
  };

  try {
    for (const url of links) {
      console.log("Fetching: " + url);
      const html = await fetchUrl(url);
      const $ = cheerio.load(html);
      
      $('.product-layout').each((i, el) => {
        const name = $(el).find('.name a').text().trim();
        const price = $(el).find('.price').text().replace(/[^0-9,.]/g, '').trim();
        let img = $(el).find('.image img').attr('src');
        if(!img) img = $(el).find('.image img').attr('data-src');

        if(name && img) {
          products.push({ name, price: (price || "0") + " TL", img });
          
          if (url.includes('m18') && !images.m18) images.m18 = img;
          if (url.includes('M12') && !images.m12) images.m12 = img;
          if (url.includes('is-guvenligi') && !images.isGuvenligi) images.isGuvenligi = img;
          if (url.includes('bicaklar') && !images.elAletleri) images.elAletleri = img;
        }
      });
    }

    fs.writeFileSync('scraped_products.json', JSON.stringify({products, images}, null, 2));
    console.log("Done. Scraped " + products.length + " products.");
  } catch(e) {
    console.error(e);
  }
}

scrape();
