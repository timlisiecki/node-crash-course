const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

const server = http.createServer((req, res) => {

    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

    if (pathName === '/products' || pathName === '/') {
        res.writeHead(200, {'Content-type': 'text/html'});
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;

            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);
                res.end(overviewOutput);
            });
        });
    } else if (pathName === '/laptop' && id < laptopData.length) {
        res.writeHead(200, {'Content-type': 'text/html'});
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id];
            const output = replaceTemplate(data, laptop);
            res.end(output);
        });
    } else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, {'Content-type': 'image/jpg'});
            res.end(data);
        });
    } else {
        res.writeHead(404, {'Content-type': 'text/html'});
        res.end('Did not find what you were asking for.');
    }


});

server.listen(1337, '127.0.0.1', () => {
    console.log('Server listiening ...');
});

function replaceTemplate(originalHTML, laptop) {
    let output = originalHTML.replace(/{%PRODUCTNAME%}/g, laptop.productName)
                    .replace(/{%IMAGE%}/g, laptop.image)
                    .replace(/{%PRICE%}/g, laptop.price)
                    .replace(/{%SCREEN%}/g, laptop.screen)
                    .replace(/{%CPU%}/g, laptop.cpu)
                    .replace(/{%STORAGE%}/g, laptop.storage)
                    .replace(/{%RAM%}/g, laptop.ram)
                    .replace(/{%DESCRIPTION%}/g, laptop.description)
                    .replace(/{%ID%}/g, laptop.id);

    return output;
}