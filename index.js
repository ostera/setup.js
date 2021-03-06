var config = require('./config.json');

if(!config.username || !config.password) {
 	throw "Please configure your username/password in the config.json file";
}

makeShellFile('leostera', '/user/repos');
makeShellFile('ng2', '/orgs/ng2/repos');
makeShellFile('soccergut', '/orgs/soccergut/repos');
// makeShellFile('componentizr', '/orgs/componentizr/repos');

function makeShellFile (name, endpoint) {
	var write  = require('fs').writeFileSync;

	var filename = 'repos.'+name+'.sh';

	console.log('    * getting '+name+' repos');
	require('https').request({
		port: '443',
		hostname: 'api.github.com',
		path: endpoint,
		method: 'GET',
		auth: config.username+":"+config.password
	}, function (response) {
		var jsonString = ""
		response.on('data', function (data) {
			jsonString += data;
		});
		response.on('end', function () {
			var repos = JSON.parse(jsonString).map(function (r) {
				if(/setup.js$/.test(r.name)) return;
				return "git clone "+r.ssh_url+" ~/repos/"+r.full_name;
			}).join('\n');

			write(filename, repos);
			console.log('    * written file',filename);
		})
	}).end();
}
