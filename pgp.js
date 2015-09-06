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

rl.on('line', function(line){
    if(!isbody && !isencrypted) {
        if(!line.match(/^\s*$/)) {
            if(line.match(/encrypted|pkcs7-mime|report/i)) {
                isencrypted = true;
		console.log(line);
            } else if(line.match(/content-type|content-transfer-encoding|mime-version/i)) {
		body += line+'\n';
                iscontentheader = true;
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
	    console.log('Content-Type: multipart/encrypted; protocol="application/pgp-encrypted"; boundary="6Jge4tP5WExmTiKQstEJ"');
	    console.log('MIME-Version: 1.0\n');
	    console.log('--6Jge4tP5WExmTiKQstEJ');
	    console.log('Content-Type: application/pgp-encrypted; Version="1"');
	    console.log('MIME-Version: 1.0\n');
	    console.log('--6Jge4tP5WExmTiKQstEJ');
	    console.log('Content-Type: application/octet-stream');
	    console.log('MIME-Version: 1.0\n');
	    console.log(pgpMessage);
	    console.log('--6Jge4tP5WExmTiKQstEJ--');
	}).catch(function(error) {
	    // failure 
	});
    }
});
