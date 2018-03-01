let express = require('express');
let router = express.Router();
let fs = require("fs");

var GiveAssistance = require('../models/giveAssistanceModel');

let xlsx = require('excel');

//return an array of objects according to key, value, or key and value matching
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else
            //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
            if (i == key && (obj[i].indexOf(val) != -1) || i == key && val == '') { //
                objects.push(obj);
            } else if ((obj[i].indexOf(val) != -1) && key == '') {
                //only add if the object is not already in the array
                if (objects.lastIndexOf(obj) == -1) {
                    objects.push(obj);
                }
            }
    }
    return objects;
}

//return an array of values that match on a certain key
function getValues(obj, key) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
            objects.push(obj[i]);
        }
    }
    return objects;
}

//return an array of keys that match on a certain value
function getKeys(obj, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getKeys(obj[i], val));
        } else if (obj[i] == val) {
            objects.push(i);
        }
    }
    return objects;
}


router.post('/list', (req, res, next) => {

    
    console.log(req.body);
    
    const getInfo = async () => {
        const data = await fs.readFileSync('./public/data/test.json'); 
        const obj = getObjects(JSON.parse(data), 'city', req.body.city)
        res.json(obj);
        //res.setHeader('Content-Type', 'application/json');
       // res.send(JSON.stringify({ a: 1 }));
        //res.send({ name: 'hyderabad' });
    }
    getInfo();
    
});

router.post('/saveAssistance', (req, res, next) => {

    var giveAssistance = new GiveAssistance(req.body);
    console.log(req.body);
    giveAssistance.save(function (err) {
        if (err) {
            res.send({ 'error': err });
            throw err;
        }

        res.send({ 'success': 'data saved successfully' });
    });
    

    

});

function convertToJSON(array) {
    let first = array[0].join()
    let headers = first.split(',');

    let jsonData = [];
    for (let i = 1, length = array.length; i < length; i++) {

        let myRow = array[i].join();
        let row = myRow.split(',');

        let data = {};
        for (let x = 0; x < row.length; x++) {
            data[headers[x]] = row[x];
        }
        jsonData.push(data);

    }
    return jsonData;
};

/* GET users listing. */
router.get('/', function (req, res, next) {
    //res.send('airport request');
   

    

    xlsx('./public/data/test.xlsx', function (err, data) {
        if (err) throw err;

        let convertedData = JSON.stringify(convertToJSON(data))
       // res.send(JSON.stringify(convertToJSON(data)));
        //console.log(jsonDataArray(data));
        //console.log(JSON.stringify(convertToJSON(data)));
        fs.writeFile('./public/data/test.json', convertedData, function (err) {
            if (err) throw err;
        })
        //res.send(convertedData); 
        console.log(data);
    });
});

/* GET users listing. */
router.get('/sameDayTravelling', function (req, res, next) {

    GiveAssistance.find({}, function (err, users) {
        if (err) throw err;

        // object of all the users
        res.json(users);
        console.log(users);
    });
    
    




    
});

module.exports = router;
