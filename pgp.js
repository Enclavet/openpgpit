#!/usr/bin/env nodejs

const fs = require('fs');
const util = require('util');

var publickeyfile = process.argv.slice(2)[0];
var publickey = fs.readFileSync(publickeyfile).toString(); 

var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

var isbody = false;
var isencrypted = false;
var body = "";
var iscontentheader = false;
var boundary = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

rl.on('line', function(line){
    if(!isbody && !isencrypted) {
        if(!line.match(/^\s*$/)) {
            if(line.match(/^content-type|^content-transfer-encoding|^mime-version/i)) {
		if(line.match(/encrypted|pkcs7-mime|report/i)) {
                    isencrypted = true;
                    console.log(line);
		} else {
		    body += line+'\n';
                    iscontentheader = true;
                }
	    } else if(line.match(/^(\t| )/) && iscontentheader) {
                body += line+'\n';
            } else {
                if(iscontentheader) { iscontentheader = false; }
                console.log(line);
            }
        } else {
            isbody = true;
            body += "\n";
        } 
    } else if(isencrypted) {
        console.log(line);
    } else {
        body += line+'\n';
    }
});

rl.on('close', function() {
    if(!isencrypted) {
	var openpgp = require('openpgp');
	var publicKeyobj = openpgp.key.readArmored(publickey);
	//console.log(body);
	openpgp.encryptMessage(publicKeyobj.keys, body).then(function(pgpMessage) {
	    console.log('Content-Type: multipart/encrypted; protocol="application/pgp-encrypted"; boundary="'+boundary+'"');
	    console.log('MIME-Version: 1.0\n');
	    console.log('--'+boundary);
	    console.log('Content-Type: application/pgp-encrypted; Version="1"');
	    console.log('MIME-Version: 1.0\n');
	    console.log('--'+boundary);
	    console.log('Content-Type: application/octet-stream');
	    console.log('MIME-Version: 1.0\n');
	    console.log(pgpMessage);
	    console.log('--'+boundary+'--');
	}).catch(function(error) {
	    // failure 
	});
    }
});

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
