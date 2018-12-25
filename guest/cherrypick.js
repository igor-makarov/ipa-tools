#!/usr/bin/env osascript -l JavaScript

ObjC.import('stdlib')

var iTunesApp;
var appName;

/*
 * OSA entry function ¯\_(ツ)_/¯
 *
 * @param {Object} args The CLI arguments
 */
function run(args) {

    if (args.length < 1) {

        printHelp();

    } else {

            openiTunesWithURL(fixUrl(args[0]));
            downloadApplication();

        }
}

/*
 * Prints nifty lil' help message
 */
var printHelp = function() {

    console.log('Cherrypick - Painless .ipa download from iTunes');
    console.log('\n\tUsage:');
    console.log('\t$ cherrypick.js <App URL on iTunes>');
    console.log('\t  NOTE: If your url contains the ? character, make sure you enclose your URL in "".');

};

/*
 * Convert url from https to itms
 *
 * @param {String} iTunesURL
 */
var fixUrl = function(url) {

    return url.replace('https:', 'itms:');

};

/*
 * Fires up iTunes application and directs it to open our app URL in App Store
 *
 * @param {String} iTunesURL The iTunes URL to open in iTunes. MUST start with "itms://"
 */
var openiTunesWithURL = function(iTunesURL) {

    console.log("[+] Firing up iTunes with location: " + iTunesURL);
    iTunesApp = Application('iTunes');
    iTunesApp.activate();
    iTunesApp.openLocation(iTunesURL);

};

/*
 * Juicy part. This method keeps trying to find the "Download" button on the app's
 * page on iTunes. Every time it bumps the polling interval by one second cause we
 * don't want to be very aggressive.
 */
var downloadApplication = function() {

    var retries = 0;
    var maxRetries = 8;

    while(true) {

        try {


            // Get an array of all UI elements in iTunes window.
			uiElems = Application("System Events").applicationProcesses['iTunes'].windows[0].entireContents()

			// Find all buttons whose description contains 'Get'.
			btns = uiElems.filter(function(element) {
                try {
                    return element.role() == 'AXButton' && (element.description().match(/\bGet\b/) || element.description().match(/\bDownload\b/))
                } catch (e) {}
			})

            btns[0].click()

            console.log('[+] Downloading...');

            break;

        } catch(e) {

            /*
                iTunes needs to load the App Store in its embeded littled browser thingie which might take a while.
                Unfortunately, fucking JXA methods won't return a proper error but rather throw a runtime exception.
                Essentially, we keep retrying by incrementing our delay until we reach the desireable state where the
                "download" control can be paresed and the download can be initiated.
            */
            var delayThreshold = (retries+1) * 2;

            console.log('[!] State not ready yet, retrying in (' + delayThreshold +'s)...');
            delay(delayThreshold);

            if(++retries === maxRetries) {
                console.log('[!] Cannot reach desirable state. Bailing out...');
                $.exit(-1);
            }
        }

    }


};

/*
 * Steps into ObjC lalaland and checks whether our app was downloaded. The app
 * download starts as a *.tmp file in "_/iTunes Media/Downloads". When the download
 * is finished, it's copied over to "_/iTunes Media/Mobile Applications". We Poll
 * that directory and when our file appears, we're done.
 *
 */
var monitorDownload = function() {

    var isFileNotFound = true;

    var downloadsPath = '~/Music/iTunes/iTunes Media/Mobile Applications';

    console.log('Waiting for ' + `${appName}` + ' to finish downloading...');

    var listFiles = Application('System Events').folders.byName(downloadsPath).diskItems.name()

    while(isFileNotFound) {

        var updatedListFiles = Application('System Events').folders.byName(downloadsPath).diskItems.name()

        if (updatedListFiles.length > listFiles.length) {
            isFileNotFound = false;
            console.log('\n\t ✔ Download ' + `${appName}` + ' complete. ');
        }

        // Poll every one second
        delay(2);
    }

};

/*
 * Pretty self explanatory
 */
var quit = function() {
    iTunesApp.quit();
    $.exit(0);
};
