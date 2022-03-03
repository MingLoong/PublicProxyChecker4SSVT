const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs');
const request = require('sync-request');

function praseNode(link) {
    if(link.match('vmess')){
        try{
            let p = JSON.parse(Buffer.from(link.split('vmess://')[1],'base64').toString().replace(/\'/g,'\"'))
            return {
                type: 'Vmess',
                node: p
            };
        }
        catch(e) {
            console.log(e);
            return false;
        }
    }
    if(link.match('trojan')){
        let n = link.split('://');
        return {
            type: 'Trojan',
            node: {
                ip: n[1].split(':')[0].split('@')[1],
                port: n[1].split('#')[0].split(':')[1],
                password: n[1].split('@')[0]
            }
        };
    }
    return false;
}

let vt = fs.readFileSync('vt.txt').toString();
vt = vt.split('\n');
let nodef = [];
vt.forEach((n,i) => {
    let p = praseNode(n);
    if(p) nodef.push(p);
});
let alive = [],fail = [];
nodef.forEach((n,i) => {
    switch(n.type) {
        case 'Vmess':{
            let try_ = true;
            let p = request(
                'GET',
                `${process.env.CHECKER}/${n.node.add}/${n.node.port}`
            ).body.toString();
            try{
                p = JSON.parse(p);
            }
            catch(e) {
                fail.push(n);
                try_ = false;
                console.log(`${i + 1}/${nodef.length} Fail`);
            }
            if(!try_) return;
            if(p.ping < 600 && p.ping != null) {
                alive.push({
                    node: n,
                    ping: p.ping,
                    geo: JSON.parse(request('GET',`${process.env.GEOIP}/${n.node.add}`).body.toString())
                });
                console.log(`${i + 1}/${nodef.length} Accept`);
                return;
            }
            break;
        }
        case 'Trojan':{
            let try_ = true;
            let p = request(
                'GET',
                `${process.env.CHECKER}/${n.node.ip}/${n.node.port}`
            ).body.toString();
            try{
                p = JSON.parse(p);
            }
            catch(e) {
                fail.push(n);
                try_ = false;
                console.log(`${i + 1}/${nodef.length} Fail`);
            }
            if(!try_) return;
            if(p.ping < 600 && p.ping != null) {
                alive.push({
                    node: n,
                    ping: p.ping,
                    geo: JSON.parse(request('GET',`${process.env.GEOIP}/${n.node.ip}`).body.toString())
                });
                console.log(`${i + 1}/${nodef.length} Accept`);
                return;
            }
            break;
        }
    }
    fail.push(n);
    console.log(`${i + 1}/${nodef.length} Fail`);
});
fs.writeFileSync('vtAlive',JSON.stringify(alive));
fs.writeFileSync('vtFail',JSON.stringify(fail));
request('POST',`${process.env.API}/api/vt/postAlive/${process.env.KEY}`,{json: alive});
request('POST',`${process.env.API}/api/vt/postFail/${process.env.KEY}`,{json: fail});