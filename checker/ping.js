const http = require('http');
const ping = require('nodejs-tcp-ping');

const server = http.createServer(async (req,res) => {
    const s = req.url.split('/');
    if(s.length != 3) {
        res.end('Error:No IP/Port Match');
        return;
    }
    try {
        const pingResult = await ping.tcpPing({
            attempts: 1,
            host: s[1],
            port: s[2],
            timeout: 600
        });
        console.log(pingResult);
        res.end(JSON.stringify(pingResult[0]));
    } catch (error) {
        res.end(`Error:${error}`);
    }
});
server.listen(process.env.PORT || 1147);