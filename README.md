# openpgpit
Node.js script to encrypt an email to PGP/Mime format using OpenPGP.js

###Requirements
```
apt-get install nodejs
apt-get install npm
npm install util
npm install openpgp
npm install fs
```
###Usage:
pgp.js [location of public key]

###Example:
The following command will pipe the file mail into pgp.js and the encrypted pgp/mime mail format will be output to stdout.
```
cat mail | pgp.js [location of public key]
```
###Dovecot intergration to encrypt all incoming emails
####Debian 8.1 x64
Install nodejs and npm
```
apt-get install nodejs
apt-get install npm
```

Clone the openpgpit repository
```
cd /usr/local/src
git clone https://github.com/Enclavet/openpgpit/
```

Install dependencies
```
npm install util
npm install fs
npm install openpgp
```
