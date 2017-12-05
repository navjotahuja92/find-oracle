#! /usr/bin/env node

const http = require('http');

var COLOR = {
    BOUNDARY: '\x1b[33m%s\x1b[0m',
    HEADLINE: "\x1b[42m%s\x1b[0m",
    EMPTY: "\x1b[43m%s\x1b[0m",
    ERROR: "\x1b[41m%s\x1b[0m"
};

var limit = 3;
var limitIndex = process.argv.indexOf("-l");
var lastIndexOfSearchKey = process.argv.length;
if (limitIndex > -1) { //does our flag exist?
    limit = process.argv[limitIndex + 1]; //grab the next item
    lastIndexOfSearchKey = limitIndex;
}

var searchKeyArray = process.argv.slice(2, lastIndexOfSearchKey);
var searchKey = searchKeyArray.join("+");
console.log(COLOR.EMPTY, "Searching for " + searchKey);



function prettyPrintContact(contact) {
    console.log(COLOR.BOUNDARY, "===============================================");
    console.log("ARIA:  ", contact.ariaKey);
    console.log("EMAIL: ", contact.email);
    console.log("NAME:  ", contact.name);
    console.log("PHONE: ", contact.phone);
    console.log("TITLE: ", contact.title);
    console.log("LINK:  ", "http://namefinder.us.oracle.com/aria?n=" + contact.ariaKey)
    console.log(COLOR.BOUNDARY, "===============================================");
}

function printResponse(response) {
    response = JSON.parse(response);
    // 
    if (!response.data || response.data.length <= 0) {
        console.log(COLOR.EMPTY, "No records found!!!");
    } else {
        console.log(COLOR.HEADLINE, "Records Found!!!");
        for (var i = 0; i <= response.data.length - 1 && i < limit; i++) {
            var contact = response.data[i];
            prettyPrintContact(contact);
        }
    }
}


var options = {
    hostname: 'namefinder.us.oracle.com',
    port: 80,
    path: '/ws/lookup?&q=' + encodeURIComponent(searchKey),
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    var data = '';
    res.on('data', function(chunk) {  
        data += chunk; 
    });
    res.on('end', function() {
        printResponse(data);
        console.log(COLOR.HEADLINE, "Package developerd by Navjot Ahuja. https://github.com/navjotahuja92");
    });
});
req.on('error', function(e) {
    console.log(COLOR.ERROR, 'Problem with request: ' + e.message);
});
req.end();