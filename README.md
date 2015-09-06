# openpgpit
Node.js script to encrypt an email to PGP/Mime format using OpenPGP.js. Inspired by the following guide: https://perot.me/encrypt-specific-incoming-emails-using-dovecot-and-sieve and the following associated script:
https://github.com/mikecardwell/gpgit

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
Copy/Upload your public key to your user's home directory
```
cp public.key /home/<user>/public.key
```
Setup extprograms for sieve in dovecot
```
vi /etc/dovecot/dovecot.conf
```
Look for the following and change:
```
plugin {
  sieve = /var/mail/sievescript/%n/.dovecot.sieve
  sieve_dir = /var/mail/sievescript/%n/scripts/
  sieve_before = /etc/dovecot/global_script/
  sieve_plugins = sieve_extprograms
  sieve_extensions = +vnd.dovecot.filter
  sieve_filter_bin_dir = /etc/dovecot/sieve-filter
}
```
Create the dovecot sieve-filter directory and place the wrapper script
```
mkdir /etc/dovecot/sieve-filter
chown vmail:mail /etc/dovecot/sieve-filter
vi /etc/dovecot/sieve-filter/openpgpjswrapper
```
Paste the following:
```
#!/bin/bash

myvar=$(cat); echo "${myvar}" | /usr/local/src/openpgpit/pgp.js $1
```
Make the script executable
```
chmod +x /etc/dovecot/sieve-filter/openpgpjswrapper
```
Create the sieve rule
```
vi /var/mail/sievescript/<userid>/scripts/managesieve.sieve
```
Paste the following:
```
require ["fileinto", "vnd.dovecot.filter"];
# rule:[Encryption]
if true
{
        filter "openpgpjswrapper" "/home/<userid>/public.key";
        fileinto "INBOX";
}
```
Restart dovecot
```
/etc/init.d/dovecot restart
```
Finished!


