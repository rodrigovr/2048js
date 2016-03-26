var Game2048 = {
	points: 0,
	playing: false,
	contents: [],
	element: null,

	reset: function() {
		this.playing = false;
		this.points = 0; 
		this.contents = [ /* using -1 as a boundary makes checking easier */
			[-1, -1, -1, -1, -1, -1, -1],
			[-1, 0, 0, 0, 0, 0, -1],
			[-1, 0, 0, 0, 0, 0, -1],
			[-1, 0, 0, 0, 0, 0, -1],
			[-1, 0, 0, 0, 0, 0, -1],
			[-1, 0, 0, 0, 0, 0, -1],
			[-1, -1, -1, -1, -1, -1, -1],
		];
	},

	dice: function() {
    		return Math.floor(Math.random() * 4) + 1;
	},

	setBoard: function(board_ref) {
		this.element = document.querySelector(board_ref);
	},

	drawBoard: function() {
		var board = "<tbody>";
		for (var line=1;line<=5;line++) {
			board += "<tr>";
			for (var column=1;column<=5;column++) {
				var value = this.contents[line][column];
				board += "<td class=\"v"+value+"\">"+value+"</td>";
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
			switch (keyCode) {
			case 37: this.spawnRight(); break;
			case 38: this.spawnDown(); break;
			case 39: this.spawnLeft(); break;
			case 40: this.spawnUp(); break;
			default: return;
			}
			this.sumPoints();
		}
		this.drawBoard();
		console.log(this.contents);
	},

	keyLeft: function() {
		for (var line=1; line <= 5; line++) {
			var start=1;
			for (var steps = 1; steps < 5; steps++) {
				for (var column=start; column <= 4; column++) {
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
		for (var column=1; column <= 5; column++) {
			var start=1;			
			for (var steps = 1; steps < 5; steps++) {
				for (var line=start; line < 5; line++) {
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
		for (var line=1; line <= 5; line++) {
			var start=5;
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
		for (var column=1; column <= 5; column++) {
			var start=5;
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
		this.spawnColumn(1);
	},

	spawnUp: function() {
		this.spawnLine(1);
	},

	spawnRight: function() {
		this.spawnColumn(5);
	},
	
	spawnDown: function() {
		this.spawnLine(5);
	},

	spawnColumn: function(column) {
		// truly random first
		for(var tries=1;tries<100;tries++) {
			var line = this.dice();
			if (this.contents[line][column] == 0) {
				this.contents[line][column] = this.dice() == 1 ? 4 : 2;
				return;
			}
		}	
		// sequential next
		for(var line=1; line <=5; line++) {
			if (this.contents[line][column] == 0) {
				this.contents[line][column] = this.dice() == 1 ? 4 : 2;
				return;
			}			
		}
		// game is problably over
	},

	spawnLine: function(line) {
		// truly random first
		for(var tries=1;tries<100;tries++) {
			var column = this.dice();
			if (this.contents[line][column] == 0) {
				this.contents[line][column] = this.dice() == 1 ? 4 : 2;
				return;
			}
		}	
		// sequential next
		for(var column=1; column <=5; line++) {
			if (this.contents[line][column] == 0) {
				this.contents[line][column] = this.dice() == 1 ? 4 : 2;
				return;
			}			
		}
		// game is problably over
	},

	sumPoints: function() {
		for (var line=1;line <= 5;line++) {
			for (var column=1; column <= 5; column++) {
				this.points += this.contents[line][column];
			}
		}		
	},

	canContinue: function() {
	
		for (var line=1;line < 5;line++) {
			for (var column=1; column < 5; column++) {
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
