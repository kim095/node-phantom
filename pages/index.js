var page = require('webpage').create();
var fs = require('fs');
var system = require('system'),
    address, filename;

if (system.args.length === 1) {
    console.log('Usage: URL error');
    phantom.exit();
}
address = system.args[1];
address = address.replace(/%26/g, '&');
filename = system.args[2];
page.viewportSize = {
    width: 750,
}
page.paperSize = {
    format: 'A4',
    orientation: 'portrait',
    margin: '0.8cm'
}
page.open(address, function(status) {
    var info = fs.read('tmp.txt');
    var result = page.evaluate(function(info) {
        try {
            document.querySelector('#main').innerHTML = info;
        } catch (e) {
            console.log(e);
        }

        return document.querySelector('#main').innerHTML;
    }, info);
    setTimeout(function() {
        page.paperSize = {
            format: 'A4',
            orientation: 'portrait',
            margin: '0.8cm'
        };
        page.viewportSize = {
            width: 750,
        };
        page.render('pages/' + filename + '.pdf', { format: 'pdf', quality: '100' });
        console.log('http://192.168.100.88:8080/pages/' + filename + '.pdf');
        phantom.exit();
    }, 500);
})