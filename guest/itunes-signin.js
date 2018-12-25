#!/usr/bin/env osascript -l JavaScript

ObjC.import('stdlib')

var itunes = null;

function run(args) {
  if (args.length < 2) {
    printHelp();
    return 0
  } 
  
  openiTunes();
  delay(1)
  itunes = Application("System Events").applicationProcesses['iTunes']
  openSignInScreen();
  fillUsernameAndPassword(args[0], args[1])
}

function printHelp() {
  console.log('\n\tUsage:');
  console.log('\t$ itunes-signin.js <email> <password>');
}

function openiTunes() {
  console.log("[+] Firing up iTunes");
  iTunesApp = Application('iTunes');
  iTunesApp.activate();
}

function retry(func) {
  var retries = 0;
  var maxRetries = 8;

  while(true) {
    try {
      func();
      return;
    } catch(e) {
      var delayThreshold = (retries+1) * 2;
      console.log(e, e.stack);
      console.log('[!] State not ready yet, retrying in (' + delayThreshold +'s)...');
      delay(delayThreshold);

      if(++retries === maxRetries) {
        console.log('[!] Cannot reach desirable state. Bailing out...');
        $.exit(-1);
      }
    }
  }
}

// function agreeToTerms() {
//   retry(function() {
//       // Get an array of all UI elements in iTunes window.
//       uiElems = Application("System Events").applicationProcesses['iTunes'].windows[0].entireContents()

//       // Find all buttons whose description contains 'Agree'.
//       btns = uiElems.filter(function(element) {
//         try {
//           return element.role() == 'AXButton' && element.title().match(/Agree/) 
//         } catch (e) {}
//       })

//       // Click on the 1st button found.
//       btns[0].click()

//   });
// }

function openSignInScreen() {
  retry(function() {
    var accountMenu = itunes.menuBars[0].menuBarItems.byName('Account');
    accountMenu.click();

    items = accountMenu.menus[0].menuItems()
    for (var item, i = 0, j = items.length; i < j; i++) {
      item = items[i];
      if (item.enabled() && /^Sign In/.test(item.title())) { 
        item.click();
      }
    }
  });
}

function fillUsernameAndPassword(username, password) {
  uiElems = Application("System Events").applicationProcesses['iTunes'].windows[0].entireContents()

  userField = uiElems.filter(function(element) {
    try {
      return element.role() == 'AXTextField' && element.description() != 'secure text field'
    } catch (e) {}
  })[0]

  passwordField = uiElems.filter(function(element) {
    try {
      return element.role() == 'AXTextField' && element.description() == 'secure text field'
    } catch (e) {}
  })[0]

  userField.value = username

  passwordField.value = password

  var se = Application('System Events')
  se.keyCode(49)
  se.keyCode(51)

  button = uiElems.filter(function(element) {
    try {
      return element.role() == 'AXButton' && element.title() == 'Sign In'
    } catch (e) {}
  })[0]

  button.click()


}
