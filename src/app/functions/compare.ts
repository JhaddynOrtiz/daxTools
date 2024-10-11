import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpsProxyAgent } from 'https-proxy-agent';

import * as _ from 'lodash';


export class Functions {

    private body = {
        "CheckDuplicates": {
            "ProductUrl": true,
            "ProductName": true,
            "ProductId": true
        },
        "CheckMappingCodes": true,
        "CultureCode": "es-ES",
        "Environment": "QA",
        "Regex": {
            "Manufacturer": [
                {
                    "Code": "Philips",
                    "Match": true
                }
            ],
            "ProductName": [
                {
                    "Code": "&amp|&#xE9|&#xE2|&#xEE|&#xE0|&#x2019|&#xB0",
                    "Match": false
                }
            ],
            "ProductUrl": [
                {
                    "Code": "https://www.casasbahia.com.br/",
                    "Match": true
                }
            ],
            "ProductId": [
                {
                    "Code": "#|&|;|:|,",
                    "Match": false
                }
            ],
            "Price": [
                {
                    "Code": "^[0-9]*$|(\\d+\\.\\d+(.\\d+(.\\d+)?)?)|\\d+",
                    "Match": true
                }
            ],
            "Stock": [
                {
                    "Code": "InStock|OutOfStock",
                    "Match": true
                }
            ],
            "ImageUri": [
                {
                    "Code": "https://imgs.casasbahia.com.br/",
                    "Match": true
                }
            ]
        },
        "RobotTypes": {
            "Name": "Crawler",
            "TaskID": "RrpStpIT2gv7VLluD",
            "ExcludeFields": []
        },
        "debugLog": false
    }




    compare(objetoProd: any, objetoQA: any, inputP: any, inputQ: any, crawler: any, compareBy: any) {
        let inputProd = inputP.startUrls ? inputP.startUrls : inputP.data.input.startUrls;
        let inputQA = inputQ.startUrls ? inputQ.startUrls : inputQ.data.input.startUrls;


        let diffPrice: any[] = [];
        let diffStock: any[] = [];
        let diffName: any[] = [];
        let diffId: any[] = [];
        let diffUrl: any[] = [];
        let diffImg: any[] = [];
        let missedArr: any[] = [];


        objetoProd.forEach((el1: any) => {
            let same = true;

            let missed = true;
            for (let el2 of objetoQA) {
                for (var prop in el1) {
                    if (el1[compareBy] === el2[compareBy]) {

                        if (el2.hasOwnProperty(prop)) {

                            if (el1[prop] != el2[prop] && el1[compareBy] == el2[compareBy]) {
                                console.log(`${compareBy}: ${el1[compareBy]} => prod.${prop}: ${el1[prop]} != CS_QA.${prop}: ${el2[prop]}`);
                                switch (prop) {
                                    case 'ProductId':
                                        diffId.push({
                                            prodUrl1: el1.ProductUrl,
                                            prodUrl2: el2.ProductUrl,
                                            prodId1: el1.ProductId,
                                            prodId2: el2.ProductId
                                        })
                                        break;
                                    case 'ProductUrl':
                                        diffUrl.push({
                                            prodUrl1: el1.ProductUrl,
                                            prodUrl2: el2.ProductUrl,
                                            prodId1: el1.ProductId,
                                            prodId2: el2.ProductId
                                        })
                                        break;
                                    case 'Price':
                                        diffPrice.push({
                                            prodUrl1: el1.ProductUrl,
                                            prodUrl2: el2.ProductUrl,
                                            prodId1: el1.ProductId,
                                            prodId2: el2.ProductId,
                                            Price1: el1.Price,
                                            Price2: el2.Price
                                        })
                                        break;
                                    case 'Stock':
                                        diffStock.push({
                                            prodUrl1: el1.ProductUrl,
                                            prodUrl2: el2.ProductUrl,
                                            prodId1: el1.ProductId,
                                            prodId2: el2.ProductId,
                                            Stock1: el1.Stock,
                                            Stock2: el2.Stock
                                        })

                                        break;
                                    case 'ImageUri':
                                        diffImg.push({
                                            prodUrl1: el1.ProductUrl,
                                            prodUrl2: el2.ProductUrl,
                                            prodId1: el1.ProductId,
                                            prodId2: el2.ProductId,
                                            ImageUri1: el1.ImageUri,
                                            ImageUri2: el2.ImageUri
                                        })

                                        break;
                                    case 'ProductName':
                                        diffName.push({
                                            prodUrl1: el1.ProductUrl,
                                            prodUrl2: el2.ProductUrl,
                                            prodId1: el1.ProductId,
                                            prodId2: el2.ProductId,
                                            ProductName1: el1.ProductName,
                                            ProductName2: el2.ProductName
                                        })

                                        break;

                                    default:
                                        console.log(prop)
                                        break;
                                }
                                same = false;
                            }
                        }
                    }
                }
                if (el1[compareBy] == el2[compareBy]) {
                    missed = false;
                }
            }
            if (missed == true) {

                missedArr.push({
                    prodUrl1: el1.ProductUrl,
                    prodId1: el1.ProductId,
                })
                console.log(`${compareBy}: ${el1[compareBy]} not exist ${el1.ProductName}`);

                same = false;
            }
            return !same
        })
        let diffInput: any[] = []
        inputProd.forEach((el1: any) => {
            let same = true;

            let missed = true;
            for (let el2 of inputQA) {
                for (var prop in el1.userData) {
                    if (el1.userData.Manufacturer === el2.userData.Manufacturer && el1.userData.Brand === el2.userData.Brand) {

                        if (!el1.hasOwnProperty('diff')) {
                            el1['diff'] = {};
                            el1.diff['differenceIn'] = [];
                        }
                        if (el2.userData.hasOwnProperty(prop) && crawler) {
                            el1.diff.comparedProps.push(prop);
                            if (el1.url != el2.url && el1.userData.Manufacturer === el2.userData.Manufacturer && el1.userData.Brand === el2.userData.Brand && !el1.diff.differenceIn.includes('URL')) {
                                console.log(`This input: ${el1.url} => prod.URL: ${el1.url} != CS_QA.URL: ${el2.url}`);
                                diffInput.push(`This input: ${el1.url} => prod.URL: ${el1.url} != CS_QA.URL: ${el2.url}`);
                                el1.diff.differenceIn.push('URL');
                                same = false;
                            } else if (el1.userData[prop] != el2.userData[prop] && el1.userData.Manufacturer === el2.userData.Manufacturer && el1.userData.Brand === el2.userData.Brand && !el1.diff.differenceIn.includes(prop)) {
                                console.log(`This input: ${el1.url} => prod.${prop}: ${el1.userData[prop]} != CS_QA.${prop}: ${el2.userData[prop]}`);
                                diffInput.push(`This input: ${el1.url} => prod.${prop}: ${el1.userData[prop]} != CS_QA.${prop}: ${el2.userData[prop]}`);
                                el1.diff.differenceIn.push(prop);
                                same = false;
                            }

                        }
                    }
                    if (el1.url == el2.url && !crawler) {
                        if (!el1.hasOwnProperty('diff')) {
                            el1['diff'] = {};
                            el1.diff['differenceIn'] = [];
                        }
                        el1.diff.comparedProps.push(prop);
                        if (el2.userData.hasOwnProperty(prop) && el1.userData[prop] != el2.userData[prop]) {
                            console.log(`This input: ${el1.url} => prod.${prop}: ${el1.userData[prop]} != CS_QA.${prop}: ${el2.userData[prop]}`);
                            diffInput.push(`This input: ${el1.url} => prod.${prop}: ${el1.userData[prop]} != CS_QA.${prop}: ${el2.userData[prop]}`);
                            el1.diff.differenceIn.push(prop);
                            same = false;
                        } else if (!el2.userData.hasOwnProperty(prop)) {
                            console.log(`This input: ${el1.url} => prod.${prop}: ${el1.userData[prop]} != CS_QA.${prop}: ${el2.userData[prop]}`);
                            diffInput.push(`This input: ${el1.url} => prod.${prop}: ${el1.userData[prop]} != CS_QA.${prop}: ${el2.userData[prop]}`);
                            el1.diff.differenceIn.push(prop);
                            same = false;
                        }
                    }
                }
                for (var prop in el2.userData) {
                    if (el1.userData.Manufacturer === el2.userData.Manufacturer && el1.userData.Brand === el2.userData.Brand) {

                        if (!el1.hasOwnProperty('diff')) {
                            el1['diff'] = {};
                            el1.diff['differenceIn'] = [];
                        }
                        if (el2.userData.hasOwnProperty(prop) && crawler) {
                            el1.diff.comparedProps.push(prop);
                            if (el1.url != el2.url && el1.userData.Manufacturer === el2.userData.Manufacturer && el1.userData.Brand === el2.userData.Brand && !el1.diff.differenceIn.includes('URL')) {
                                console.log(`This input: ${el1.url} => prod.URL: ${el1.url} != CS_QA.URL: ${el2.url}`);
                                diffInput.push(`This input: ${el1.url} => prod.URL: ${el1.url} != CS_QA.URL: ${el2.url}`);
                                el1.diff.differenceIn.push(prop);
                                same = false;
                            } else if (el1.userData[prop] != el2.userData[prop] && el1.userData.Manufacturer === el2.userData.Manufacturer && el1.userData.Brand === el2.userData.Brand && !el1.diff.differenceIn.includes(prop)) {
                                console.log(`This input: ${el1.url} => prod.${prop}: ${el1.userData[prop]} != CS_QA.${prop}: ${el2.userData[prop]}`);
                                diffInput.push(`This input: ${el1.url} => prod.${prop}: ${el1.userData[prop]} != CS_QA.${prop}: ${el2.userData[prop]}`);
                                el1.diff.differenceIn.push(prop);
                                same = false;
                            }

                        }
                    }
                    if (el1.url == el2.url && !crawler) {
                        if (!el1.hasOwnProperty('diff')) {
                            el1['diff'] = {};
                            el1.diff['differenceIn'] = [];
                        }
                        el1.diff.comparedProps.push(prop);
                        if (el2.userData.hasOwnProperty(prop) && el1.userData[prop] != el2.userData[prop]) {
                            console.log(`This input: ${el1.url} => prod.${prop}: ${el1.userData[prop]} != CS_QA.${prop}: ${el2.userData[prop]}`);
                            el1.diff.differenceIn.push(prop);
                            same = false;
                        } else if (!el2.userData.hasOwnProperty(prop)) {
                            console.log(`This input: ${el1.url} => prod.${prop}: ${el1.userData[prop]} != CS_QA.${prop}: ${el2.userData[prop]}`);
                            el1.diff.differenceIn.push(prop);
                            same = false;
                        }
                    }
                }
                if (el1[compareBy] == el2[compareBy]) {
                    missed = false;
                }
            }
            if (missed == true) {
                if (!el1.hasOwnProperty('diff')) {
                    el1['diff'] = {};
                    el1.diff['differenceIn'] = [];
                }
                console.log(`This input: ${el1.url} not exist`);

                el1.diff.differenceIn.push(el1.url);
                same = false;
            }
            //console.log(same)
            return !same
        })

        const differences = {
            diffPrice: {
                length: diffPrice.length,
                ejm: diffPrice[0]
            },
            diffStock: {
                length: diffStock.length,
                ejm: diffStock[0]
            },
            diffName: {
                length: diffName.length,
                ejm: diffName[0]
            },
            diffId: {
                length: diffId.length,
                ejm: diffId[0]
            },
            diffUrl: {
                length: diffUrl.length,
                ejm: diffUrl[0]
            },
            diffImg: {
                length: diffImg.length,
                ejm: diffImg[0]
            },
            diffInput: {
                length: diffInput.length,
                ejm: diffInput[0]
            },
            missed: {
                length: missedArr.length,
                ejm: missedArr[0]
            },
            objetoProd: {
                length: objetoProd.length
            },
            objetoQA: {
                length: objetoQA.length
            }
        }
        return differences;

    }


    async analisis(url: any, userToken: any, save: any, erease: any) {
        const taskId = url.split('tasks/')[1].split('/')[0];
        const runId = url.split('/runs/')[1].split('#')[0];
        const organization = url.split('organization/')[1].split('/')[0];


        async function getTask() {
            const response = await fetch(`https://api.apify.com/v2/actor-tasks/${taskId}?token=${userToken}`, {
                // agent: httpsAgent
            });
            const task = await response.json();
            return task;
        }
        async function getLastRun() {
            const response = await fetch(`https://api.apify.com/v2/actor-tasks/${taskId}/runs/last?token=${userToken}`, {
                // agent: httpsAgent
            });
            const lastRun = await response.json();
            return lastRun;
        }

        async function getLog() {
            const response = await fetch(`https://api.apify.com/v2/logs/${runId}?token=${userToken}`, {
                // agent: httpsAgent
            });
            const log = await response.text();
            return log;
        }


        const lastRun = await getLastRun();
        const task = await getTask();
        const log = await getLog();

        async function getInput() {
            const response = await fetch(`https://api.apify.com/v2/key-value-stores/${lastRun.data.defaultKeyValueStoreId}/records/INPUT?token=${userToken}`, {
                // agent: httpsAgent
            });
            const input = await response.json();
            return input;
        }
        const input = await getInput();

        //YrQuEkowkNCLdk4j2 cheerio

        const nombre = task.data.name;
        const actId = lastRun.data.actId; // type
        const tipo = nombre.split('-').pop();
        const error = log.match(/(?<=Last Error Message: ).*/ig)?.pop();
        const inputType = nombre.toUpperCase().includes('PPU') ? 'Updater' : 'Crawler';
        const inputsLength = input.startUrls.length;
        const proxy = input.proxyConfiguration;
        const proxyRotation = input.proxyRotation;
        const version = lastRun.data.options.build;
        const search = `https://console.apify.com/organization/${organization}/actors/tasks?query=${nombre.split('-')[1]}`;
        const memory = lastRun.data.options.memoryMbytes;
        const timeOut = lastRun.data.options.timeoutSecs;
        const duracion = lastRun.data.stats.runTimeSecs;
        const costo = Math.round(lastRun.data.usageTotalUsd * 10000) / 10000;
        const webUrl = input.startUrls[0].url;
        const originalUrl = input.startUrls[0].userData.OriginalUrl;
        const pageFunc = input.pageFunction;
        const metamorph = lastRun.metamorph > 0;


        switch (true) {
            case pageFunc.includes("json.") && /$\.|$\(/i.test(pageFunc):
                var tipoProg = 'Mixto'
                break;

            case pageFunc.includes("json."):
                tipoProg = 'API'
                break;

            case /\$\.|\$\(/gi.test(pageFunc):
                tipoProg = 'DOM'
                break;

            default:
                tipoProg = 'Other'
                break;
        }
        switch (actId) {
            case 'YrQuEkowkNCLdk4j2':
                var actor = 'Cheerio'
                break;

            case 'YJCnS9qogi9XxDgLB':
                actor = 'Puppeteer'
                break;

            default:
                actor = 'Other'
                break;
        }

        const analisis = {
            Name: nombre,
            Id: runId,
            ActId: actId,
            Type: tipo,
            Actor: actor,
            Error: error,
            InputType: inputType,
            InputsLength: inputsLength,
            Proxy: proxy,
            ProxyRotation: proxyRotation,
            Version: version,
            Search: search,
            Memory: memory,
            TimeOut: timeOut,
            Duration: duracion,
            Cost: `${costo}$`,
            RunUrl: url,
            WebUrl: webUrl,
            OriginalUrl: originalUrl,
            TipoProg: tipoProg,
            Metamorph: metamorph
        }

        return analisis;
    }
    async uniquesBy(objeto: any, prop: any) {
        let uniques = _.uniqBy(objeto, prop);

        return uniques;
    }

    async QAProd(objeto: any, prop: any) {

        let uniques = await this.uniquesBy(objeto, prop);

        let errors: any[] = [];
        for (const el of objeto) {
            var error = [];
            if (!errors.find(item => item['ProductId'] === el['ProductId']) && !el.hasOwnProperty('Handled')) {
                if (el['ProductName'] && el['ProductId'] && el['ProductUrl']) {
                    if (el['ProductName'].match(/\s\s+/) || el['ProductName'].match(/^\s+|\s+$/) || el['ProductUrl'].match(/^\s+|\s+$/)) {
                        error.push('Double space or extra space');
                    }
                    if ((el['Price'] && !Number.isFinite(el['Price'])) || (el['ProductId'] && Number.isFinite(el['ProductId'])) || (el['RatingSourceValue'] && !Number.isFinite(el['RatingSourceValue'])) || (el['ReviewCount'] && !Number.isFinite(el['ReviewCount']))) {
                        error.push('Wrong format');
                    }
                    if ((el['Price'] && el['Price'] == null) || !el['ProductName']) {
                        error.push('Without value');
                    }
                    if (uniques.filter((item: any) => item['ProductId'] === el['ProductId']).length > 1 || uniques.filter((item: any) => item['ProductUrl'] === el['ProductUrl']).length > 1) {
                        error.push(`Repeated ${uniques.filter((item: any) => item['ProductId'] === el['ProductId']).length}-ID, ${uniques.filter((item: any) => item['ProductUrl'] === el['ProductUrl']).length}-URL`);
                    }
                } else {
                    error.push('Property is missing');
                }

                if (error.length > 0) {
                    var prodWithError = el;
                    prodWithError['error'] = error;
                    errors.push(prodWithError);
                }
            }

        }

        return errors;
    }

    async createComment(QA: string, compleUrlProd: any, compleUrlQA: string, Production: any, compval: any, Manufacturers: string, ImageUri: string) {

        const qaRunId = QA.split('/runs/')[1].split('#')[0];
        const taskId = QA.split('tasks/')[1].split('/')[0];
        const compTaskId = compleUrlQA?.split('tasks/')[1]?.split('/')[0];
        const prodRunId = Production.split('/runs/')[1].split('#')[0];
        const prodToken = 'apify_api_94yploUc38a42oWZy6cTFvL10EKlEy20cFqn';
        const qaToken = 'apify_api_U4Wd5n7V9USgdsBpkYDpB8WUfhkJEX3wh0LV';


        async function getQaRun() {
            const response = await fetch(`https://api.apify.com/v2/actor-runs/${qaRunId}?token=${qaToken}`, {
            });
            const lastRun = await response.json();
            return lastRun;
        }
        const lastRun = await getQaRun();
        const datasetId = lastRun.data.defaultDatasetId;

        async function getQaResults() {
            const response = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${qaToken}&clean=true`, {
            });
            const lastRun = await response.json();
            return lastRun;
        }
        const dataset = await getQaResults();
        const objetoQA = dataset.filter((el: any) => { return !el.hasOwnProperty('Handled') });
        let res = await this.QAProd(objetoQA, 'ProductId');
        if (res.length > 0) { console.log('ROBOT WITH ISSUES, FIX IT'); return }
        const dataPrice = objetoQA && objetoQA[0].Price
        const dataStock = objetoQA && objetoQA[0].Stock
        async function getInput() {
            const response = await fetch(`https://api.apify.com/v2/key-value-stores/${lastRun.data.defaultKeyValueStoreId}/records/INPUT?token=${qaToken}`, {
            });
            const input = await response.json();
            return input;
        }
        async function getTask() {
            const response = await fetch(`https://api.apify.com/v2/actor-tasks/${taskId}?token=${qaToken}`, {
            });
            const task = await response.json();
            return task;
        }
        const input = await getInput();
        const task = await getTask();

        const nombre = task.data.name;
        const inputsLength = input.startUrls.length;
        const inputType = nombre.toUpperCase().includes('PPU') ? 'Updater' : 'Crawler';
        const inputTypeR = nombre.toUpperCase().includes('PPU') ? 'Crawler' : 'Updater';
        const proxy = input.proxyConfiguration?.apifyProxyGroups?.shift() || 'AUTO';
        const proxyResi = proxy == 'AUTO' ? undefined : input.proxyConfiguration.apifyProxyCountry;
        const proxyRotation = input.proxyRotation;
        const version = lastRun.data.options.build;
        const memory = lastRun.data.options.memoryMbytes;
        const timeOut = lastRun.data.options.timeoutSecs;
        const duracion = lastRun.data.stats.runTimeSecs;
        const costo = Math.round(lastRun.data.usageTotalUsd * 10000) / 10000;
        const startUrls = nombre.toUpperCase().includes('PPU') ? task.data.input.startUrls : input.startUrls;

        const productUrl = dataset.shift().ProductUrl.replace(/(?<=https:\/\/.*\/).*/, '');

        const error = inputType == 'Updater' ? Number(inputsLength) - Number(dataset.length) : '';

        async function getProdRun() {
            const response = await fetch(`https://api.apify.com/v2/actor-runs/${prodRunId}?token=${prodToken}`, {
            });
            const lastRun = await response.json();
            return lastRun;
        }
        const ProdRun = await getProdRun();
        const datasetProdId = ProdRun.data.defaultDatasetId;
        const keyValProdId = ProdRun.data.defaultKeyValueStoreId;

        async function getDataProd() {
            const response = await fetch(`https://api.apify.com/v2/datasets/${datasetProdId}/items?token=${prodToken}&clean=true`, {
            });
            const dataProd = await response.json();
            return dataProd;
        }

        async function getInputProd() {
            const response = await fetch(`https://api.apify.com/v2/key-value-stores/${keyValProdId}/records/INPUT?token=${prodToken}`, {
            });
            const dataProd = await response.json();
            return dataProd;
        }
        let objetoProd = await getDataProd();
        let inputProd = await getInputProd();
        const crawler = inputType == 'Crawler' ? true : false

        objetoProd = objetoProd.filter((el: any) => { return !el.hasOwnProperty('Handled') });
        const compareProd = await this.compare(objetoProd, objetoQA, inputProd, input, crawler, 'ProductUrl')
        const changedPrice = compareProd.diffPrice?.ejm
        const changedStock = compareProd.diffStock?.ejm
        const changedName = compareProd.diffName?.ejm
        const changedId = compareProd.diffId?.ejm
        const changedUrl = compareProd.diffUrl?.ejm
        const changedImg = compareProd.diffImg?.ejm
        const changedInput = compareProd.diffInput?.ejm
        const missed = compareProd.missed?.ejm
        var validationUrl: any
        var comparisonUrl: any
        var compValidationUrl: any
        const cultureCode = inputType == 'Crawler' ? input.startUrls[0].userData["Culture Code"] : ""

        let validationBody = this.body;
        validationBody.Regex.Manufacturer[0].Code = Manufacturers;
        validationBody.CultureCode = cultureCode;
        validationBody.Regex.ProductUrl[0].Code = productUrl;
        validationBody.Regex.ImageUri[0].Code = ImageUri || "";
        validationBody.RobotTypes.Name = inputType;
        validationBody.RobotTypes.TaskID = taskId;

        async function getValidation(validationBodyR: any) {
            const response = await fetch("https://api.apify.com/v2/actor-tasks/cs_qa~cs-qa-validation/runs?token=apify_api_U4Wd5n7V9USgdsBpkYDpB8WUfhkJEX3wh0LV", {
                method: "POST",
                body: JSON.stringify(validationBodyR),
                headers: {
                    'content-type': 'application/json'
                },
            });
            const lastRun = await response.json();
            return lastRun;
        }
        const validation = await getValidation(validationBody);
        const delay = (delayInms: any) => {
            return new Promise(resolve => setTimeout(resolve, delayInms));
        };
        await delay(36000);

        async function getValidationSumari() {
            const response = await fetch(`https://api.apify.com/v2/datasets/${validation.data.defaultDatasetId}/items?clean=true&format=json`, {
            })
            var val = await response.json();

            if (val.length) {
                const response2 = await fetch(val[2]?.Summary, {
                });
                var lastRun = await response2.json();
            }
            return lastRun;
        }
        const sumari = await getValidationSumari();
        if (sumari) {
            var success = sumari[0].Fields[0].Pass;
            var handled = sumari[0].Other.Handled;
        }
        if (compval) {

            async function getCompleRun() {
                const response = await fetch(`https://api.apify.com/v2/actor-runs/${qaRunId}?token=${qaToken}`, {
                });
                const lastRun = await response.json();
                return lastRun;
            }
            const compleRun = await getCompleRun();
            const datasetCompleId = compleRun.data.defaultDatasetId;

            async function getCompleResults() {
                const response = await fetch(`https://api.apify.com/v2/datasets/${datasetCompleId}/items?token=${qaToken}&clean=true`, {
                });
                const lastRun = await response.json();
                return lastRun;
            }
            const datasetComple = await getCompleResults();
            const objetoComple = datasetComple.filter((el: any) => { return !el.hasOwnProperty('Handled') });
            let res = await this.QAProd(objetoComple, 'ProductId');
            if (res.length > 0) { console.log('ROBOT WITH ISSUES, FIX IT'); return }
            const complePrice = objetoComple && objetoComple[0].Price
            const compleStock = objetoComple && objetoComple[0].Stock

            const skipPrice = complePrice && dataPrice ? false : true
            const skipStock = compleStock && dataStock ? false : true
            async function getComparison() {
                const response = await fetch("https://api.apify.com/v2/actor-tasks/cs_qa~cs-crawl-updater-comparison/runs?token=apify_api_U4Wd5n7V9USgdsBpkYDpB8WUfhkJEX3wh0LV", {
                    method: "POST",
                    body: JSON.stringify({
                        "CrawlerId": inputType == 'Crawler' ? taskId : compTaskId,
                        "Environment": "QA",
                        "OverrideCrawlRunId": "",
                        "OverrideUpdaterRunId": "",
                        "SkipPrice": skipPrice,
                        "SkipStock": skipStock,
                        "UpdaterId": inputType == 'Crawler' ? compTaskId : taskId,
                        "debugLog": false
                    }),
                    headers: {
                        'content-type': 'application/json'
                    },
                });
                const lastRun = await response.json();
                return lastRun;
            }

            const comparison = await getComparison();

            let compValiBody = this.body;
            compValiBody.RobotTypes.TaskID = compTaskId;
            compValiBody.RobotTypes.Name = inputType == 'Crawler' ? 'Updater' : 'Crawler';
            compValiBody.Regex.ImageUri[0].Code = inputType == 'Crawler' ? ImageUri : '';

            const compValidation = await getValidation(compValiBody);

            validationUrl = `https://console.apify.com/organization/${validation.data.userId}/actors/tasks/${validation.data.actorTaskId}/runs/${validation.data.id}#log`;
            comparisonUrl = `https://console.apify.com/organization/${comparison.data.userId}/actors/tasks/${comparison.data.actorTaskId}/runs/${comparison.data.id}#log`;
            compValidationUrl = `https://console.apify.com/organization/${compValidation.data.userId}/actors/tasks/${compValidation.data.actorTaskId}/runs/${compValidation.data.id}#log`;

        }

        let description = '';
        if (!missed && objetoProd.length != 0 && compareProd.missed.length != objetoProd.length) {

            description += changedUrl ? `* Changed product URL from: ${changedUrl.prodUrl1} to: ${changedUrl.prodUrl1}` : '* Kept product URL'
            description += changedInput ? `\n* Changed inputs: ${changedInput.prodUrl1}` : '\n* Kept inputs'
            description += changedId ? `\n* Changed productID from: ${changedId.prodId1} to: ${changedId.prodId1}` : '\n* Kept product ID'
            description += changedImg ? `\n* Changed ImageUri from: ${changedImg.ImageUri1} to: ${changedImg.ImageUri2}` : '\n* Kept Image URI'
            description += changedName ? `\n* Changed Name from: ${changedName.ProductName1} to: ${changedName.ProductName2}` : '\n* Kept Name'
        }
        const comment =
            `**${inputType} Input**
    
    ${'```'}
      "startUrls": ${JSON.stringify(startUrls, null, 4)} 
    ${'```'}
    
    
    **Description:**
    
    ${description}
    
    **Comparison:**
    
    The results were compared with the production [comparison](${comparisonUrl}).
    In Production environment ->> [Apify Prod ${inputTypeR}](${compleUrlProd}) 
    In CS_QA environment ->> [Apify QA ${inputTypeR}](${compleUrlQA})
    In validation ->> [Apify validation ${inputTypeR}](${compValidationUrl})
    
    **Configuration:**
    
    **Actor & Build version:** ${version}
    **Timeout:** ${timeOut}
    **Memory:** ${memory}MB
    **Cost:** ${costo}$
    **Duration:** ${duracion}seg
    
    **Proxy Configuration:**
    
    ${proxy}${proxyResi ? '\n country: ' + proxyResi : ''}
    ${proxyRotation}
    
    **${inputType} robot is in CS_QA environment** | Validation test:
    
    **${inputType} robot:** 
    * Last run: [Apify CS_QA](${QA})
    * Validation [Apify validation](${validationUrl})
    
    
    |     | ${inputType} | ${inputTypeR} | Notes |
    | --- |------|--------|-------|
    | Last run  | [Apify last Run](${QA}) | [Apify last Run](${compleUrlQA}) | Sucess => ${success} Handled => ${handled || '0'} Errors => ${error}  |  
    | Validation | [Apify validation](${validationUrl}) | [Apify validation](${compValidationUrl}) | |
    | Comparison | [Apify comparison](${comparisonUrl}) | [Apify comparison](${comparisonUrl}) | |
     `

        return comment;
    }

    getTaskRunResults(runId: string) {
    }

}
