var _ = require('underscore');
var util = require('util');

function cmd(c, opts) {
	if (opts) {
		var o = _.reduce(opts, function(m, i) {
			console.log(m, i);
			return m.concat(' ', i);
		}, '').trim();
	}
	fmt = util.format('%s %s\r\n', c, o);
	console.log(fmt);
	return fmt;
}

exports.irc = Irc;
function Irc(options) {
	var self = {
		user: '',
		pass: ''
	};

	_.extend(self, options)

	self.start = function(socket) {
		self.socket = socket;
		socket.write(cmd('NICK', [self.user]));
		socket.write(cmd('USER', [self.user, 0, '*', ':Sisbot']));
	};

	self.end = function() {
		console.log('on disconnect');
	};

	var i = 0;
	self.recv = function(data) {
		console.log('%s: data', i, data.toString());
		i++;
	};

	return self;
}
