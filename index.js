//importing packages
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

//setting the port #
const PORT = 5000;

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
    name: "CNNBusiness",
    address: "https://www.cnn.com/business",
    base: "https://www.cnn.com",
  },
  {
    name: "TodayOnChain",
    address: "https://www.todayonchain.com/",
    base: "",
  },
];
//setting array to store information in it
const articles = [];

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
  res.json("Welcome to Crypto News API");
});

//Get function for news url
app.get("/news", (req, res) => {
  res.json(articles);
});
//Getting the information for a specific site
app.get("/news/:cryptoSiteId", async (req, res) => {
  //Getting the value of cryptoSiteId and setting it to siteId
  const siteId = req.params.cryptoSiteId;

  //This is to filter out the siteId address to the params that is requested
  const siteAddress = cryptoSites.filter(
    (cryptoSite) => cryptoSite.name == siteId
  )[0].address;

//This is to establish the articles base site in the case that it is required for the filtered site
  const siteBase = cryptoSites.filter(
    (cryptoSite) => cryptoSite.name == cryptoSiteId
  )[0].base;
  
  //

  axios.get(siteAddress).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const specificArticles = [];

    $('a:contains("Bitcoin")', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      // Pushing the acquired article title, url and source into articles array
      specificArticles.push({
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
      specificArticles.push({
        title,
        url: cryptoSite.base + url,
        source: cryptoSite.name,
      });
    });
  });
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
