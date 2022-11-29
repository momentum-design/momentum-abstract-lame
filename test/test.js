
const https = require('https');

const regArgs = /^([^\=]+)\=([^\=]+)$/;
const getProcessArgs = () => {
    const args = process.argv.slice(2);
    const ret = {};
    args.forEach((str)=>{
        const result = str.match(regArgs);
        if(result && typeof result.length === 'number' && result.length===3) {
            ret[result[1]] = result[2];
        }
    });
    return ret;
}

const args = getProcessArgs();

const send = (data)=> {
   const _data = JSON.stringify(data);
    const _request = https.request({
        hostname: 'webexapis.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${args.webex}`,
            'Content-Type': 'application/json',
            'Content-Length': _data.length
        }
    }, res => {

    })

    _request.on('error', error => {
        console.error('fail to send message');
        console.error(error);
    });
    _request.write(_data);
    _request.end(); 
}

send({
    roomId: '07650870-6fbc-11ed-921d-f576bf41ea68',
    "text": args.a
});