var _ = require('underscore');
var util = require('util');

exports.irc = Irc;
function Irc(options) {
	var self = {
		user: ''
	};

	_.extend(self, options)

	function collapse(ary) {
		return _.reduce(ary, function(m, i) {
			return m.concat(' ', i);
		}, '').trim();
	}

	function cmd(c, opts) {
		if (opts) {
			o = collapse(opts);
		}
		fmt = util.format('%s %s\r\n', c, o);
		console.log(fmt.trim());
		return fmt;
	}

	function handleMessage(str) {
		var payload = str.split(' ');
		var source  = '';
		if (payload[0].substr(0,1) == ':') {
			source = payload.shift();
		}
		var msg = payload.shift();
		switch (msg) {
			case 'PING':
				self.socket.write(cmd('PONG', payload))
				break;
			case 'PRIVMSG':
				var to = payload.shift();
				var msg = collapse(payload);
				console.log('Private message to %s =  %s', to, msg);
				break;
		}
	}

	self.start = function(socket) {
		self.socket = socket;
		socket.write(cmd('NICK', [self.user]));
		socket.write(cmd('USER', [self.user, 0, '*', ':Sisbot']));
		setTimeout(function() {
			if (self.channels.length > 0) {
				_.each(self.channels, function(channel) {
					socket.write(cmd('JOIN', [':#' + channel]));
				});
			}
		}, 10000);
	};

	self.end = function() {
		console.log('on disconnect');
	};

	self.recv = function(data) {
		_.each(data.toString().split('\n'), function(line) {
			if (line.trim().length > 0) {
				console.log(line);
				handleMessage(line);
			}
		});
	};

	return self;
}
