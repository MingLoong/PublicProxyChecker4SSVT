const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const request = require('sync-request');

let s5 = fs.readFileSync('socks5.txt').toString();
s5 = s5.split('\n');
let nodef = [];
s5.forEach(s => {if(s) nodef.push({node:s.split(' ')[0].split(':'),source:s})});
let alive = [],fail = [];
nodef.forEach(n => {
    let p = request('GET',`${process.env.CHECKER}/${n.node[0]}/${n.node[1]}`).body.toString();
    if(p.match('ping')) {
        p = JSON.stringify(p);
        if(p.ping < 600) {
            alive.push({
                node: n.source,
                ping: p.ping,
                geo: JSON.parse(request('GET',`${process.env.GEOIP}/${n.node[0]}`).body.toString())
            });
            return;
        }
    }
    fail.push(n.node);
});
fs.writeFileSync('s5Alive',JSON.stringify(alive));
fs.writeFileSync('s5Fail',JSON.stringify(fail));
request('POST',`${process.env.API}/api/s5/postAlive/${process.env.KEY}`,JSON.stringify(alive));
request('POST',`${process.env.API}/api/s5/postFail/${process.env.KEY}`,JSON.stringify(fail));