var page = require('webpage').create();
var system = require('system'),
    address;

if (system.args.length === 1) {
    console.log('Usage: URL error');
    phantom.exit();
}
address = system.args[1];
address = address.replace(/%26/g, '&');
page.viewportSize = {
    width: 1920,
    height: 1080,
}
page.open(address, function(status) {
    setTimeout(function() {
        if (status == 'success') {
            var base64 = page.renderBase64('PNG');
            console.log(base64);
            phantom.exit();
        }
    }, 2000);
})