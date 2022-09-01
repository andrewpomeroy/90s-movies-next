import { title } from "process";

const axios = require("axios");
const cheerio = require("cheerio");
const pretty = require("pretty");
const fs = require("fs");
const dashify = require("dashify");

const baseUrl = "https://en.wikipedia.org/wiki/List_of_American_films_of_";
const baseYear = 1990;
const years = [...new Array(10).keys()].map(i => baseYear + i);
// URL of the page we want to scrape

type ScrapedRow = {
  title: string;
  director: string;
  cast: string;
  genre: string;
  notes: string;
}

export type Movie = ScrapedRow & {
  year: string;
  id: string;
}
const removeDuplicates = (movies: Movie[]): Movie[] => {
  let usedIds = new Set();
  const output = movies.filter((movie) => {
    if (!usedIds.has(movie.id)) {
      usedIds.add(movie.id);
      return true;
    }
  })
  return output;
} 

const columns = [
  {
    name: "title",
    selector: "td:nth-child(1)"
  },
  {
    name: "director",
    selector: "td:nth-child(2)"
  },
  {
    name: "cast",
    selector: "td:nth-child(3)"
  },
  {
    name: "genre",
    selector: "td:nth-child(4)"
  },
  {
    name: "notes",
    selector: "td:nth-child(5)"
  },
]


// Async function which scrapes the data
async function getMovies() {
  let movies = [];
  for (let i = 0; i < years.length; i++) {
    const year = years[i];
    const url = baseUrl + year;
    try {
      // Fetch HTML of the page we want to scrape
      const { data } = await axios.get(url);
      // Load HTML we fetched in the previous line
      const $ = cheerio.load(data);
      // // Select all the list items in plainlist class
      // const listItems = $(".plainlist ul li");
      // // Stores data for all countries
      // const countries = [];
      // // Use .each method to loop through the li we selected
      // listItems.each((idx, el) => {
      //   // Object holding data for each country/jurisdiction
      //   const country = { name: "", iso3: "" };
      //   // Select the text content of a and span elements
      //   // Store the textcontent in the above object
      //   country.name = $(el).children("a").text();
      //   country.iso3 = $(el).children("span").text();
      //   // Populate countries array with country data
      //   countries.push(country);
      // });
      // // Logs countries array to the console
      // console.dir(countries);
      // // Write countries array in countries.json file
      const rows = $("table.wikitable tr");

      let output = [];
      rows.each((idx, el) => {
        const rowData = {};
        columns.forEach(col => {
          const cellContent = $(el).find(col.selector).text();
          rowData[col.name] = String(cellContent);  
        })
        const row = rowData as ScrapedRow;
        if (Object.values(rowData).some((value: string) => value?.trim().length)) {
          const newRow = row as Movie;
          newRow.year = year.toString();
          newRow.id = `${dashify(newRow.title)}-${newRow.year}`;
          output.push(newRow);
        }
      });
      // movies.push(...nonEmptyRows);
      // movies.set(year, output);
      movies = [...movies, ...output];

      // fs.writeFile("test.json", JSON.stringify(nonEmptyRows, null, 2), (err) => {
      //   if (err) {
      //     console.error(err);
      //     return;
      //   }
      //   console.log("Successfully written data to file");
      // });
    } catch (err) {
      console.error(err);
    }
  }
  // console.log("%c💣️ movies.length", "background: aliceblue; color: dodgerblue; font-weight: bold", movies.length);
  // return Array.from(movies);
  return removeDuplicates(movies);
}

export default getMovies;