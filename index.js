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
  },
  {
    name: "CNBC Finance",
    address: "https://www.cnbc.com/finance/",
  },
  {
    name: "CNN Business",
    address: "https://www.cnn.com/business",
  },
  {
    name: "Today On Chain",
    address: "https://www.todayonchain.com/",
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
        url,
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
        url,
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

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
