var argv = require('optimist')
	.usage('Usage: $0 -d -h [host] -p [port] -u [user:pass]')
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
	.options('u', {
		alias: 'user',
		describe: 'User to connect with',
		default: 'sisbot'
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
var irc = require('./irc.js').irc({
	user: argv.u
});

var client = net.connect({
	host: argv.h,
	port: argv.p
});

client.on('connect', function() {
	if (argv.d) {
		console.log('Connected.');
	}
	irc.start(client);
});

client.on('data', function(data) {
	irc.recv(data);
});

client.on('end', function() {
	irc.end();
	if (argv.d) {
		console.log('Disconnected.');
	}
});
