const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const http = require('http');
const db = 'data.json';

function get(inkey) {
    let rawdata = fs.readFileSync(db);
    let data = JSON.parse(rawdata);
    for (let i = 0; i < data.length; i++) if (data[i].key == inkey) return data[i].value;
    return null;
}

function put(inkey, invalue) {
    let rawdata = fs.readFileSync(db);
    let data = JSON.parse(rawdata);
    for (let i = 0; i < data.length; i++) if (data[i].key == inkey) {
        data[i].value = invalue;
        rawdata = JSON.stringify(data);
        fs.writeFileSync(db, rawdata);
        return 'done';
    }
    data.push(
        {
            key: inkey,
            value: invalue
        }
    );
    rawdata = JSON.stringify(data);
    fs.writeFileSync(db, rawdata);
    return 'done';
}

function del(inkey) {
    let rawdata = fs.readFileSync(db);
    let data = JSON.parse(rawdata);
    for (let i = 0; i < data.length; i++) if (data[i].key == inkey) data.splice(i, 1);
    rawdata = JSON.stringify(data, null, 2);
    fs.writeFileSync(db, rawdata);
    return 'done';
}

function list() {return JSON.parse(fs.readFileSync(db));}

function pingSort(arr) {
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            if (arr[j].ping > arr[j+1].ping) {
                var temp = arr[j+1]; 
                arr[j+1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}

const server = http.createServer(async (req,res) => {
    const url = req.url.split('/');
    console.log(url);
    switch(url[1]){
        case 'api': {
            if(url[4] != process.env.TOKEN) {req.end('Error:Token Access Failed.');return;}
            switch(url[2]){
                case 'ss':{
                    console.log('ss');
                    switch(url[3]){
                        case 'postAlive':{
                            if(req.method != 'POST') {req.end('Error:Only POST is accepted.');return;}
                            let arr = [];
                            req.on("data", function(data) {
                                arr.push(data);
                            });
                            req.on("end", function() {
                                let d = Buffer.concat(arr).toString();
                                if(!d) {res.end('Error:No Data POSTed.');return;}
                                put('ssAlive',d);
                            });
                            res.end('DONE');
                            break;
                        }
                        case 'postFail':{
                            if(req.method != 'POST') {req.end('Error:Only POST is accepted.');return;}
                            let arr = [];
                            req.on("data", function(data) {
                                arr.push(data);
                            });
                            req.on("end", function() {
                                let d = Buffer.concat(arr).toString();
                                //if(!d) {res.end('Error:No Data POSTed.');return;}
                                put('ssFail',d);
                            });
                            res.end('DONE');
                            break;
                        }
                    }
                    break;
                }
                case 's5':{
                    console.log('s5');
                    switch(url[3]){
                        case 'postAlive':{
                            if(req.method != 'POST') {req.end('Error:Only POST is accepted.');return;}
                            let arr = [];
                            req.on("data", function(data) {
                                arr.push(data);
                            });
                            req.on("end", function() {
                                let d = Buffer.concat(arr).toString();
                                if(!d) {res.end('Error:No Data POSTed.');return;}
                                put('s5Alive',d);
                            });
                            res.end('DONE');
                            break;
                        }
                        case 'postFail':{
                            if(req.method != 'POST') {req.end('Error:Only POST is accepted.');return;}
                            let arr = [];
                            req.on("data", function(data) {
                                arr.push(data);
                            });
                            req.on("end", function() {
                                let d = Buffer.concat(arr).toString();
                                if(!d) {res.end('Error:No Data POSTed.');return;}
                                put('s5Fail',d);
                            });
                            res.end('DONE');
                            break;
                        }
                    }
                }
                case 'vt':{
                    console.log('vt');
                    switch(url[3]){
                        case 'postAlive':{
                            if(req.method != 'POST') {req.end('Error:Only POST is accepted.');return;}
                            let arr = [];
                            req.on("data", function(data) {
                                arr.push(data);
                            });
                            req.on("end", function() {
                                let d = Buffer.concat(arr).toString();
                                if(!d) {res.end('Error:No Data POSTed.');return;}
                                put('vtAlive',d);
                            });
                            res.end('DONE');
                            break;
                        }
                        case 'postFail':{
                            if(req.method != 'POST') {req.end('Error:Only POST is accepted.');return;}
                            let arr = [];
                            req.on("data", function(data) {
                                arr.push(data);
                            });
                            req.on("end", function() {
                                let d = Buffer.concat(arr).toString();
                                if(!d) {res.end('Error:No Data POSTed.');return;}
                                put('vtFail',d);
                            });
                            res.end('DONE');
                            break;
                        }
                    }
                    break;
                }
            }
        }
        case 'dev':{
            switch(url[2]) {
                case 'getJSON':{
                    res.writeHead(200, {
                        "Content-Type": "text/json;charset=utf-8"
                    });
                    res.end(JSON.stringify({
                        ss: {
                            alive:pingSort(JSON.parse(get('ssAlive'))),
                            fail: JSON.parse(get('ssFail'))
                        },
                        s5: {
                            alive:pingSort(JSON.parse(get('s5Alive'))),
                            fail: JSON.parse(get('s5Fail'))
                        },
                        vt: {
                            alive:pingSort(JSON.parse(get('vtAlive'))),
                            fail: JSON.parse(get('vtFail'))
                        }
                    },null,2));
                    break;
                }
            }
            break;
        }
        case 'user':{
            switch(url[2]) {
                case 'getCount':{
                    res.end(JSON.stringify({
                        ss:{
                            a:JSON.parse(get('ssAlive')).length || 0,
                            f:JSON.parse(get('ssFail')).length || 0
                        },
                        s5:{
                            a:JSON.parse(get('s5Alive')).length || 0,
                            f:JSON.parse(get('s5Fail')).length || 0
                        },
                        vt:{
                            a:JSON.parse(get('vtAlive')).length || 0,
                            f:JSON.parse(get('vtFail')).length || 0
                        }
                    }));
                }                    
            }
            break;
        }
        default:{
            if(req.url == '/') req.url = '/index.html';
            try {
                let f = fs.readFileSync('public' + req.url);
                res.end(f);
            }
            catch(err) {
                res.end('Error:\n    - 404\n    - ' + err.message);
            }
        }
    }
});
server.listen(process.env.PORT || 1149);