const axios = require("axios");
const jsdom = require("jsdom");
const fs = require("fs");
const request = require("request");
const readline = require("readline");

const { JSDOM } = jsdom;

const typeWords = "";
const words = typeWords.split(" ");
let wordsTitle;

const results = [];

const get = async (word) => {
    axios.get(`https://en.dict.naver.com/#/search?range=word&query=${word}`);
};

const throttleGet = () => {
    const length = words.length;
    let i = 0;
    const getter = () => {
        get(word[i]).then(() => {
            i++;
            if (i < length - 1) {
                setTimeout(() => {
                    getter();
                }, 1000);
            }
        });
    };

    getter();
};

const test = () => {
    axios
        .get("https://en.dict.naver.com/#/search?range=word&query=fetch")
        .then((response) => {
            const $ = new JSDOM(response.data);
            const
        });
};

rl.question("Title ", (title) => {
    wordsTitle = title;
    rl.close();
});

rl.on("close", throttleGet);
