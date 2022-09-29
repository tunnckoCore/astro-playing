const rand = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const chosen = [];

const items = Array(50)
	.fill(0)
	.map(function reducer(x) {
		let num = x || rand(1, 500);
		// const idx = chosen.indexOf(num);
		// const val = idx !== -1 ? chosen[idx] : false;

		if (chosen.includes(num)) {
			return reducer(false);
		}
		chosen.push(num);
		return num;
	});
