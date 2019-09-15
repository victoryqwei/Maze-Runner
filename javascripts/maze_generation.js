//
// This file generates a maze using a variant of recursive backtracking
//

function Maze(w, h)
{
	this.w = w;
	this.h = h;
	this.map = new Array();
	for(var mh = 0; mh < h; ++mh) { this.map[mh] = new Array(); for(var mw = 0; mw < w; ++mw) { this.map[mh][mw] = {'n':0,'s':0,'e':0,'w':0,'v':0}; } }
	this.dirs = ['n', 's', 'e', 'w'];
	this.modDir = {
		'n' : { y : -1, x : 0, o : 's' },
		's' : { y : 1, x : 0, o : 'n' },
		'e' : { y : 0, x : -1, o : 'w' },
		'w' : { y : 0, x : 1, o : 'e' }
	};

	this.build(0, 0);
}

Maze.prototype.build = function(x, y)
{
	var x = 0;
	var y = 0;

	this.explore(x, y);
	this.toGrid();
};

Maze.prototype.explore = function(ex, ey)
{
	this.dirs = sortRand(this.dirs);

	for(d in this.dirs)
	{
		var nx = ex + this.modDir[this.dirs[d]].x;
		var ny = ey + this.modDir[this.dirs[d]].y;

		if(nx >= 0 && nx < this.w && ny >= 0 && ny < this.h && this.map[ny][nx].v==0)
		{
			this.map[ey][ex][this.dirs[d]] = 1;
			this.map[ey][ex].v = 1;
			this.map[ny][nx][this.modDir[this.dirs[d]].o] = 1;

			this.explore(nx, ny);
		}
	}
};

Maze.prototype.toGrid = function()
{
	var grid = new Array();
	for(var mh = 0; mh < (this.h * 2 + 1); ++mh) { grid[mh] = new Array(); for(var mw = 0; mw < (this.w * 2 + 1); ++mw) { grid[mh][mw] = 0; } }

	for(var y = 0; y < this.h; ++ y)
	{
		var py = (y * 2) + 1;

		for(var x = 0; x < this.w; ++x)
		{
			var px = (x * 2) + 1;

			if(this.map[y][x].v==1) { grid[py][px] = 1; }

			for(d in this.dirs)
			{
				if(this.map[y][x][this.dirs[d]]==1) { grid[(py+this.modDir[this.dirs[d]].y)][(px+this.modDir[this.dirs[d]].x)] = 1; }
			}
		}
	}

	this.gridMap = grid;
	this.gridW	= grid.length;
	this.gridH	= grid[0].length;
};

function sortRand(a)
{
	var out = new Array();
	var l	= a.length;

	for(x in a)
	{
		do { var p = Math.floor(Math.random() * (l * 1000)) % l; } while(typeof out[p]!='undefined');

		out[p] = a[x];
	}

	return out;
}

function generate_maze() {
	maze = [];
	
	// Initialize maze
	for (let y = 0; y < height; y++) {
		maze.push([]);
		for (let x = 0; x < width; x++) {
		  maze[y][x] = false;
		} 
	}

	// declare starting cell a passage
	maze[y_pos][x_pos] = true;
	maze_list.push([[y_pos],[x_pos]]);

	// generate maze
	while (true)
	{
		y_pos = maze_list[maze_list.length-1][0];
		x_pos = maze_list[maze_list.length-1][1];
		// find all neighbours of current cell position
		var valid_directions = [];

		// check up
		if (y_pos != height-1){
			// ensure that it is not already a passage
			if (maze[y_pos+1] && !maze[y_pos+1][x_pos] && valid_position(y_pos, x_pos+1, 0)) {
				valid_directions.push([y_pos+1][x_pos]);
			}
		}
		// check right
		if (x_pos != width-1){
			// ensure that it is not already a passage
			if (!maze[y_pos][x_pos+1] && valid_position(y_pos+1, x_pos, 1)) {
				valid_directions.push([y_pos][x_pos+1]);
			}
		}
		// check down
		if (y_pos > 0){
			// ensure that it is not already a passage
			if (maze[y_pos-1] && !maze[y_pos-1][x_pos] && valid_position(y_pos, x_pos-1, 2)) {
				valid_directions.push([y_pos-1][x_pos]);
			}
		}
		// check left
		if (x_pos > 0){
			// ensure that it is not already a passage
			if (!maze[y_pos][x_pos-1] && valid_position(y_pos-1, x_pos, 3)) {
				valid_directions.push([y_pos][x_pos-1]);
			}
		}

		// if any valid neighbours, randomly choose one, else backtrack
		if (valid_directions.length !== 0){
			var selected_element = randInt(0, valid_directions.length);

			maze_list.push([valid_directions[selected_element]]);
		}
		else{
			maze_list.pop();
		}
	}
}

function valid_position(y, x, direction){
	// make sure only passage that is neighbours with the selected cell is its parent
	if (direction === 0) // direction is up
	{
		// check left, and left up
		if (x !== 0){
			if (maze[y][x-1])
				return false;

			if (y != height)
			{
				if (maze[y+1] && maze[y+1][x-1])
					return false;
			}
		}

		// check up
		if (y != height-1){
			if (maze[y+1] && maze[y+1][x])
					return false;
		}

		// check right and up right
		if (x != length-1){
			if (maze[y][x+1])
				return false;

			if (y != height)
			{
				if (maze[y+1] && maze[y+1][x+1])
					return false;
			}
		}
	}


	else if (direction == 1) // direction is right
	{
		// check up and up right
		if (y != height+1){
			if (maze[y+1] && maze[y+1][x])
				return false;

			if (x != width+1)
			{
				if (maze[y+1] && maze[y+1][x+1])
					return false;
			}
		}

		// check right
		if (x != width+1){
			if (maze[y][x+1])
				return false;
		}

		// check down and down right
		if (y !== 0){
			if (maze[y-1] && maze[y-1][x])
				return false;

			if (x != width+1)
			{
				if (maze[y-1] && maze[y-1][x+1])
					return false;
			}
		}
	}


	else if (direction == 2) // direction is down
	{
		// check right and right down
		if (x != width-1){
			if (maze[y][x+1])
				return false;

			if (y !== 0)
			{
				if (maze[y-1] && maze[y-1][x+1])
					return false;
			}
		}

		// check down
		if (y !== 0){
			if (maze[y-1] && maze[y-1][x])
					return false;
		}

		// check left and down left
		if (x !== 0){
			if (maze[y][x-1])
				return false;

			if (y != height-1)
			{
				if (maze[y-1] && maze[y-1][x-1])
					return false;
			}
		}
	}


	else if (direction == 3) // direction is left
	{
		// check down and down left
		if (y !== 0){
			if (maze[y+1] && maze[y+1][x])
				return false;

			if (x !== 0)
			{
				if (maze[y-1] && maze[y-1][x-1])
					return false;
			}
		}

		// check left
		if (x !== 0){
			if (maze[y][x+1])
					return false;
		}

		// check up and up left
		if (y != height-1){
			if (maze[y+1] && maze[y+1][x])
				return false;

			if (x !== 0)
			{
				if (maze[y+1] && maze[y+1][x-1])
					return false;
			}
		}
	}

	// if nothing wrong
	return true;
}