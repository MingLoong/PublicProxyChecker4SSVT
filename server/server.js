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

const server = http.createServer(async (req,res) => {
    const url = req.url.split('/');
    switch(url[1]){
        case 'api': {
            switch(url[2]){
                case 'ss':{
                    switch(url[3]){
                        case 'postAlive':{
                            if(url[4] != )
                        }
                    }
                }
                case 's5':{

                }
                case 'vt':{

                }
            }
        }
        default:{
            if(req.url == '/') req.url = '/index.html';
            try {
                let f = fs.readFileSync('public' + req.url);
                res.end(f);
            }
            catch(err) {
                res.end(err.message);
            }
        }
    }
});
server.listen(process.env.PORT || 1149);