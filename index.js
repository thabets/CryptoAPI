//importing packages
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

//setting the port #
const PORT = 5000;

//setting express as app
const app = express();

//setting array to store information in it
const articles = [];

//Get function for home page + response
app.get("/", (req, res) => {
  res.json("Welcome to Crypto News API");
});

//Get function for news url
app.get("/news", (req, res) => {
  axios
    .get("https://www.coindesk.com/")
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      //searching for word Bitcoin in a-tag || title and pushing the webpage into the array named articles.
      $('a:contains("Bitcoin")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");

        articles.push({
          title,
          url,
        });
      });
      //searching for word crypto in a-tag and pushing the title and webpage link into the array named articles.
      $('a:contains("crypto")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        articles.push({
          title,
          url,
        });
      });
      res.json(articles);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
