# openpgpit
Node.js script to encrypt an email to PGP/Mime format using OpenPGP.js

Requirements
npm install util
npm install openpgpjs
npm install fs

Usage:
pgp.js [location of public key]

Example:
The following command will pipe the file mail into pgp.js and the encrypted pgp/mime mail format will be output to stdout.
cat mail | pgp.js [location of public key]

Dovecot intergration to encrypt all incoming emails
TBD
