const express = require('express');
const router = express.Router();
const winston = require('winston');
let bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
let User = require('../models/userModel');
const config = require('../config/settings');
let crypto = require('crypto');
let transporter = require('../config/mailer');
const CircularJSON = require('circular-json');
const tokenVerify = require('../auth/verifytoken');
const axios = require('axios');
let findTask = (obj) => {

    return axios.get(`http://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/CongressionalDistricts/FeatureServer/0/query?${obj}`)
        .then(response => {
            console.log(response)
            return response.data
            //res.json({ success: true, method: 'find task', data: response.data });

        })
        .catch(error => {
            console.log(error)
            return error;
            //res.json({ success: false, error: "Data not found" });
        });

}
router.post('/', async (req, res, next) => {

    let text = req.body.text;
    let maxSuggestion = req.body.maxSuggestion || 6;
    let layerSearch = req.body.layerSearch;
    let findObj = {
        "where": "(UPPER(DISTRICTID) LIKE '%310%')",
        "f": "pjson",
        "outFields": "DISTRICTID,OBJECTID"
    }
    if (layerSearch) {
        res.json({ success: true, method: 'find task', data: await findTask(findObj) });
    }
    else {
        var config = {
            host: 'http://autoproxy.verizon.com/cgi-bin/getproxy',
            port: 8000,
            auth: {
                username: 'NAKKAAR',
                password: 'Manga@143'
            }
        };
        axios.get(`http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&text=${text}&maxSuggestions=${maxSuggestion}`, config)
            .then(response => {
                if (response.length < 1) {
                    findTask(findObj);
                }
                else {
                    res.json({ success: true, data: response.data.suggestions });
                }

            })
            .catch(error => {
                res.json({ success: false, error: "Data not found" });
            });
    }

});
router.post('/findAddress', (req, res, next) => {

    let text = encodeURIComponent(req.body.text);
    let maxSuggestion = req.body.maxSuggestion || 6;
    let outFields = req.body.outFields;
    console.log(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&SingleLine=${text}&maxSuggestions=${maxSuggestion}&outFields=${outFields}`)

    if (text) {
        axios.get(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&SingleLine=${text}`)
            .then(response => {
                res.json({ success: true, method: 'find address', data: response.data.candidates[0] });

            })
            .catch(error => {
                res.json({ success: false, error: "Find address Data not found" });
            });
    }
    else {
        res.json({ success: false, error: "Check the input data" });
    }

});
module.exports = router;