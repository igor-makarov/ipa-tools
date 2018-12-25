# IPA Tools - a Vagrant box for general-pupose IPA hacking

This box provides a clean environment to run automations on iTunes 12.6, which supports app downloads.

## Setup
```
vagrant plugin install vagrant-scp
vagrant up
```  
(wait for GUI to boot)  
```
./vagrant-vm-login.js
```  
(wait for guest to login)  
```
./itunes-signin.sh "<email>" "<password>"
```  
(wait for iTunes sign in to complete)  

### Setup Notes
* Use a dummy account as this process is by no means secure
* Don't use 2FA account

## Download an app
```
./download.sh "<app URL>"
```

## Take apps out of guest VM
This will SCP the IPAs from guest to `./apps`
```
./takeout.sh
```  

