//importing packages
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

//setting the port #
const PORT = process.env.PORT || 8000;

//setting express as app
const app = express();

//Setting up the object within the array to scrape the data from
const cryptoSites = [
  {
    name: "Coindesk",
    address: "https://www.coindesk.com/",
    base: "https://www.coindesk.com",
  },
  {
    name: "CNBCFinance",
    address: "https://www.cnbc.com/finance/",
    base: "https://www.cnbc.com",
  },
  {
    name: "CNBCTech",
    address: "https://www.cnbc.com/technology/",
    base: "https://www.cnbc.com",
  },
  {
    name: "CNNBusiness",
    address: "https://www.cnn.com/business",
    base: "https://www.cnn.com",
  },
  {
    name: "TodayOnChain",
    address: "https://www.todayonchain.com/",
    base: "",
  },
  {
    name: "CryptoSlate",
    address: "https://cryptoslate.com/",
    base: "",
  },
  {
    name: "NewsBTC",
    address: "https://www.newsbtc.com/",
    base: "",
  },
  {
    name: "BitcoinMagazine",
    address: "https://bitcoinmagazine.com/",
    base: "https://bitcoinmagazine.com",
  },
  {
    name: "Bitcoinist",
    address: "https://bitcoinist.com/",
    base: "",
  },
  {
    name: "Forbes",
    address: "https://www.forbes.com/?sh=62d922b92254",
    base: "",
  },
];
//setting array to store information in it
const articles = [];

//This Section Deals With Compiling All The Sources Into One Page
//---------------------------------------------------------------//
cryptoSites.forEach((cryptoSite) => {
  axios.get(cryptoSite.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    //searching for word Bitcoin in a-tag || title and pushing the webpage into the array named articles
    $('a:contains("Bitcoin")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      // Pushing the acquired article title, url and source into articles array
      articles.push({
        title,
        url: cryptoSite.base + url,
        source: cryptoSite.name,
      });
    });
    //Searching for word crypto in a-tag and pushing the title and webpage link into the array named articles
    $('a:contains("Crypto")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");
      // Pushing the acquired article title, url and source into articles array
      articles.push({
        title,
        url: cryptoSite.base + url,
        source: cryptoSite.name,
      });
    });
  });
});

//Get function for home page + response
app.get("/", (req, res) => {
  res.json(
    "Welcome to Crypto News API, to get the articles information please feel free to add '/news' to the end of the link above"
  );
});

//Get function for news url
//This will provide all the sources within the page in json format
app.get("/news", (req, res) => {
  res.json(articles);
});

//This Section Deals With Compiling All The Articles For A Single Source
//---------------------------------------------------------------//

//Getting the information for a specific site
app.get("/news/:cryptoSiteId", (req, res) => {
  //Getting the value of cryptoSiteId and setting it to siteId
  const siteId = req.params.cryptoSiteId;

  //This is to filter out the siteId address to the params that is requested
  const siteAddress = cryptoSites.filter(
    (cryptoSite) => cryptoSite.name === siteId
  )[0].address;

  //This is to establish the articles base site in the case that it is required for the filtered site
  const siteBase = cryptoSites.filter(
    (cryptoSite) => cryptoSite.name === siteId
  )[0].base;

  //This is to establish the scraping of information on the page of the given source and return the required information

  axios
    .get(siteAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $('a:contains("Bitcoin")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");

        // Pushing the acquired article title, url and source into articles array
        specificArticles.push({
          title,
          url: siteBase + url,
          source: siteId,
        });
      });
      //Searching for word crypto in a-tag and pushing the title and webpage link into the array named articles
      $('a:contains("Crypto")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        // Pushing the acquired article title, url and source into articles array
        specificArticles.push({
          title,
          url: siteBase + url,
          source: siteId,
        });
      });
      res.json(specificArticles);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
