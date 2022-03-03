const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const request = require('sync-request');

let ss = fs.readFileSync('ss.txt').toString();
ss = ss.split('\n');
let nodef = [];
ss.forEach(s => {if(s) nodef.push({node:s.split(' '),source:s})});
let alive = [],fail = [];
nodef.forEach((n,i) => {
    let p = request('GET',`${process.env.CHECKER}/${n.node[0]}/${n.node[1]}`).body.toString();
    if(p.match('ping')) {
        p = JSON.parse(p);
        if(p.ping < 600 && p.ping != null) {
            alive.push({
                node: n.source,
                ping: p.ping,
                geo: JSON.parse(request('GET',`${process.env.GEOIP}/${n.node[0]}`).body.toString())
            });
            console.log(`${i + 1}/${nodef.length} Accept`);
            return;
        }
    }
    fail.push(n.node);
    console.log(`${i + 1}/${nodef.length} Fail`);
});
fs.writeFileSync('ssAlive',JSON.stringify(alive));
fs.writeFileSync('ssFail',JSON.stringify(fail));
request('POST',`${process.env.API}/api/ss/postAlive/${process.env.KEY}`,{json: alive});
request('POST',`${process.env.API}/api/ss/postFail/${process.env.KEY}`,{json: fail});