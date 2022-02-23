const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const request = require('sync-request');

let ss = fs.readFileSync('ss.txt').toString();
ss = ss.split('\n');
let nodef = [];
ss.forEach(s => {if(s) nodef.push({node:s.split(' '),source:s})});
let alive = [],fail = [];
nodef.forEach(n => {
    let p = request('GET',`${process.env.CHECKER}/${n.node[0]}/${n.node[1]}`).body.toString();
    if(p.match('ping')) {
        p = JSON.stringify(p);
        if(p.ping < 600) {
            alive.push({
                node: n.source,
                ping: p.ping
            });
            return;
        }
    }
    fail.push(n.node);
});
request('POST',`${process.env.API}/api/ss/postAlive/${process.env.KEY}`,JSON.stringify(alive));
request('POST',`${process.env.API}/api/ss/postFail/${process.env.KEY}`,JSON.stringify(fail));