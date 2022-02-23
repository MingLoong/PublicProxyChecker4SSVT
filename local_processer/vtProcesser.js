const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const request = require('sync-request');

function praseNode(link) {
    if(link.match('vmess')){
        return {
            type: 'Vmess',
            node: JSON.parse(link.split('vmess://')[1].toString('base64'))
        };
    }
    if(link.match('trojan')){
        let n = link.split('taojan://')[1];
        return {
            type: 'Trojan',
            node: {
                ip: n.split(':')[0].split('@')[1],
                port: n.split('#')[0].split(':')[1],
                password: n.split('@')[0]
            }
        };
    }
}

let vt = fs.readFileSync('dl.txt').toString();
vt = vt.split('\n');
let nodef = [];
vt.forEach(n => {
    let p = praseNode(n);
    if(n) nodef.push(p);
});
let alive = [],fail = [];
nodef.forEach(n => {
    switch(n.type) {
        case 'Vmess':{
            let p = request(
                'GET',
                `${process.env.CHECKER}/${n.add}/${n.port}`
            ).body.toString();
            if(p.ping < 600) {
                alive.push({
                    node: n,
                    ping: p.ping
                });
                return;
            }
        }
        case 'Trojan':{
            let p = request(
                'GET',
                `${process.env.CHECKER}/${n.ip}/${n.port}`
            ).body.toString();
            if(p.ping < 600) {
                alive.push({
                    node: n,
                    ping: p.ping
                });
                return;
            }
        }
    }
    fail.push(n);
});
request('POST',`${process.env.API}/api/vt/postAlive/${process.env.KEY}`,JSON.stringify(alive));
request('POST',`${process.env.API}/api/vt/postFail/${process.env.KEY}`,JSON.stringify(fail));