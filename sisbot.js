var argv = require('optimist')
	.usage('Usage: $0 -d -h [host] -p [port]')
	.options('d', {
		alias: 'debug',
		describe: 'Debugging output',
	})
	.options('h', {
		alias: 'host',
		describe: 'Hostname to connect to',
	})
	.options('p', {
		alias: 'port',
		describe: 'Port to connect to',
		default: 6660
	})
	.boolean(['d'])
	.demand(['h'])
	.argv
;

if (argv.d) {
	console.log('Welcome to sisbot!');
}
console.log('Connecting to %s:%s...', argv.h, argv.p);

var net = require('net');
var client = net.connect({
	host: argv.h,
	port: argv.p
}, function() {
	if (argv.d) {
		console.log('...connected');
	}
});

client.on('data', function(data) {
	console.log(data.toString());
});

client.on('end', function() {
	if (argv.d) {
		console.log('Disconnected.');
	}
});
