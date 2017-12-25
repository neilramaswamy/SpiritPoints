const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));



function getClassScores() {
	let scores = [0, 0, 0, 0];
	for (var key in data) {
		for (var i = 0; i < 4; i++) {
			var a = Number(data[key][i]);
			scores[i] = scores[i] + a;
		}
	}
}