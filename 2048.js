var Game2048 = {
	points: 0,
	playing: false,
	contents: [],
	element: null,
	size: 4,

	reset: function() {
		this.playing = false;
		this.points = 0;
		var limit = this.size + 1;
		for (var line=0; line <= limit; line++) {
			this.contents[line] = new Array(this.size + 2);
			for (var column=0; column <= limit; column++) {
				var val = (line == 0 || line == limit || column == 0 || column == limit) ? -1 : 0;
				this.contents[line][column] = val;
			}
		}
	},

	dice: function() {
    		return Math.floor(Math.random() * (this.size-1)) + 1;
	},

	setBoard: function(board_ref) {
		this.element = document.querySelector(board_ref);
	},

	setSize: function(grid_size) {
		this.playing = false;
		this.size = grid_size;
	},

	drawBoard: function() {
		var width = 100.0 / this.size;
		var board = "<tbody>";
		for (var line=1;line<=this.size;line++) {
			board += "<tr>";
			for (var column=1;column<=this.size;column++) {
				var value = this.contents[line][column];
				board += "<td class=\"v"+value+"\" style=\"width:"+width+"%\">"+value+"</td>";
			}
			board += "</tr>";
		}
		board += "</tbody><tfoot><tr><td colspan=\"100%\">"+this.points+"</td></tr></tfoot>";
		this.element.innerHTML = board;
	},

	start: function() {
		this.reset();
		this.contents[this.dice()][this.dice()] = 2;
		document.onkeydown = function(evt) {
			evt = evt || window.event;
			Game2048.keyPressed(evt.keyCode)
		};
		this.playing = true;
		this.drawBoard();
	},

	keyPressed: function(keyCode) {

		if (!this.playing) {
			console.log("not playing");
			return;
		}

		switch (keyCode) {
		case 37: this.keyLeft(); break;
		case 38: this.keyUp(); break;
		case 39: this.keyRight(); break;
		case 40: this.keyDown(); break;
		default: return;
		}
		if  (!this.canContinue()) {
			this.playing = false;
			this.showEnd();
		} else {
			var spawned = false;
			switch (keyCode) {
			case 37: spawned=this.spawnRight(); break;
			case 38: spawned=this.spawnDown(); break;
			case 39: spawned=this.spawnLeft(); break;
			case 40: spawned=this.spawnUp(); break;
			default: return;
			}
			if (spawned) {
				this.sumPoints();
			}
		}
		this.drawBoard();
		console.log(this.contents);
	},

	keyLeft: function() {
		for (var line=1; line <= this.size; line++) {
			var start=1;
			for (var steps = 1; steps < 5; steps++) {
				for (var column=start; column < this.size; column++) {
					var value = this.contents[line][column];
					if (value != 0) {
						if (value == this.contents[line][column+1]) {
							this.contents[line][column] *= 2;
							this.contents[line][column+1] = 0;
							start = column+1;
						}
					} else {
						this.contents[line][column] = this.contents[line][column+1];
						this.contents[line][column+1] = 0;
					}
				}
			}
		}
	},

	keyUp: function() {
		for (var column=1; column <= this.size; column++) {
			var start=1;
			for (var steps = 1; steps < 5; steps++) {
				for (var line=start; line < this.size; line++) {
					var value = this.contents[line][column];
					if (value != 0) {
						if (value == this.contents[line+1][column]) {
							this.contents[line][column] *= 2;
							this.contents[line+1][column] = 0;
							start = line+1;
						}
					} else {
						this.contents[line][column] = this.contents[line+1][column];
						this.contents[line+1][column] = 0;
					}
				}
			}
		}
	},

	keyRight: function() {
		for (var line=1; line <= this.size; line++) {
			var start=this.size;
			for (var steps = 1; steps < 5; steps++) {
				for (var column=start; column > 1; column--) {
					var value = this.contents[line][column];
					if (value != 0) {
						if (value == this.contents[line][column-1]) {
							this.contents[line][column] *= 2;
							this.contents[line][column-1] = 0;
							start = column-1;
						}
					} else {
						this.contents[line][column] = this.contents[line][column-1];
						this.contents[line][column-1] = 0;
					}
				}
			}
		}
	},

	keyDown: function() {
		for (var column=1; column <= this.size; column++) {
			var start=this.size;
			for (var steps = 1; steps < 5; steps++) {
				for (var line=start; line > 1; line--) {
					var value = this.contents[line][column];
					if (value != 0) {
						if (value == this.contents[line-1][column]) {
							this.contents[line][column] *= 2;
							this.contents[line-1][column] = 0;
							start = line-1;
						}
					} else {
						this.contents[line][column] = this.contents[line-1][column];
						this.contents[line-1][column] = 0;
					}
				}
			}
		}
	},

	spawnLeft: function() {
		return this.spawnColumn(1);
	},

	spawnUp: function() {
		return this.spawnLine(1);
	},

	spawnRight: function() {
		return this.spawnColumn(this.size);
	},

	spawnDown: function() {
		return this.spawnLine(this.size);
	},

	spawnColumn: function(column) {
		// truly random first
		for(var tries=1;tries<100;tries++) {
			var line = this.dice();
			if (this.contents[line][column] == 0) {
				this.contents[line][column] = this.dice() == 1 ? 4 : 2;
				return true;
			}
		}
		// sequential next
		for(var line=1; line <=5; line++) {
			if (this.contents[line][column] == 0) {
				this.contents[line][column] = this.dice() == 1 ? 4 : 2;
				return true;
			}
		}
		return false;
	},

	spawnLine: function(line) {
		// truly random first
		for(var tries=1;tries<100;tries++) {
			var column = this.dice();
			if (this.contents[line][column] == 0) {
				this.contents[line][column] = this.dice() == 1 ? 4 : 2;
				return true;
			}
		}
		// sequential next
		for(var column=1; column <=5; line++) {
			if (this.contents[line][column] == 0) {
				this.contents[line][column] = this.dice() == 1 ? 4 : 2;
				return true;
			}
		}
		return false;
	},

	sumPoints: function() {
		for (var line=1;line <= this.size;line++) {
			for (var column=1; column <= this.size; column++) {
				this.points += this.contents[line][column];
			}
		}
	},

	canContinue: function() {

		for (var line=1;line <= this.size;line++) {
			for (var column=1; column <= this.size; column++) {
				if (this.contents[line][column] == 0) return true;
				// compare only 2 sides to avoid check everything twice
				if (this.contents[line][column] == this.contents[line-1][column]) return true;
				if (this.contents[line][column] == this.contents[line][column-1]) return true;
			}
		}

		return false;
	},

	showEnd: function() {
		alert("It's over");
	},
};
