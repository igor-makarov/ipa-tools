#!/usr/bin/env osascript -l JavaScript

ObjC.import('stdlib')

function run(args) {

    const frontmost_app_name = Application('System Events').applicationProcesses.where({ frontmost: true }).name()[0]
    const frontmost_app = Application(frontmost_app_name)
    
    vbox = Application('VirtualBoxVM');
    vbox.activate();
    delay(2);

    typeString('vagrant')
    Application('System Events').keyCode(36)

    frontmost_app.activate()
}

function typeString(string) {
    var se = Application('System Events')

    for (i=0; i<string.length; i++) {
        se.keystroke(string[i])
    }
}