const { exec } = require("child_process");

let child1 = exec(`npm run watch:theme`, (err, stdout, stderr) => {
	console.error(err, stderr);
	console.log(stdout);
});

child1.stdout.pipe(process.stdout);
child1.stderr.pipe(process.stderr);

let child2 = exec(`npm run bundler`, (err, stdout, stderr) => {
	console.error(err, stderr);
	console.log(stdout);
});

child2.stdout.pipe(process.stdout);
child2.stderr.pipe(process.stderr);
process.stdin.pipe(child2.stdin);
