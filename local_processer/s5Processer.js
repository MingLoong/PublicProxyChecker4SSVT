const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const request = require('sync-request');

let pd = {};
function ping(n){
    if(pd[n.node[0]]){
        return pd[n.node[0]];
    }
    let p = request('GET',`${process.env.CHECKER}/${n.node[0]}/${n.node[1]}`).body.toString();
    if(p.match('ping')) {
        p = JSON.parse(p);
        if(p.ping < 600 && p.ping != null) {
            pd[n.node[0]] = JSON.stringify(p);
            return JSON.stringify(p);
        }
    }
    pd[n.node[0]] == JSON.stringify({ping: 601});
    return JSON.stringify({ping: 601});
}

let s5 = fs.readFileSync('socks5.txt').toString();
s5 = s5.split('\n');
let nodef = [];
s5.forEach(s => {if(s) nodef.push({node:s.split(' ')[0].split(':'),source:s})});
let alive = [],fail = [];
nodef.forEach((n,i) => {
    let p = ping(n);
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
    console.log(`${i + 1}/${nodef.length} Fail`);
    fail.push(n.node);
});
fs.writeFileSync('s5Alive',JSON.stringify(alive));
fs.writeFileSync('s5Fail',JSON.stringify(fail));
request('POST',`${process.env.API}/api/s5/postAlive/${process.env.KEY}`,{json: alive});
request('POST',`${process.env.API}/api/s5/postFail/${process.env.KEY}`,{json: fail});