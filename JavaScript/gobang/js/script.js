var chessBoard = [];
var me = true;
var over = false;

//赢法数组
var wins = [];

//赢法统计数组
var myWin = [];
var cWin = [];

for(var i=0; i<15; i++) {
	chessBoard[i] = [];
	for(var j=0; j<15; j++) {
		chessBoard[i][j] = 0;
	}
}

for(var i=0; i<15; i++) {
	wins[i]=[];
	for(var j=0; j<15; j++) {
		wins[i][j] = [];
	}
}

var count = 0;

//所有的横线赢法
for(var i=0; i<15; i++) {
	for(var j=0; j<11; j++) {
		for(var k=0; k<5; k++) {
			wins[i][j+k][count] = true;
		}
		count++;
	}
}
//所有的竖线赢法
for(var i=0; i<15; i++) {
	for(var j=0; j<11; j++) {
		for(var k=0; k<5; k++) {
			wins[j+k][i][count] = true;
		}
		count++;
	}
}
//所有的斜线赢法
for(var i=0; i<11; i++) {
	for(var j=0; j<11; j++) {
		for(var k=0; k<5; k++) {
			wins[i+k][j+k][count] = true;
		}
		count++;
	}
}
//所有的反斜线赢法
for(var i=0; i<11; i++) {
	for(var j=14; j>3; j--) {
		for(var k=0; k<5; k++) {
			wins[i+k][j-k][count] = true;
		}
		count++;
	}
}

console.log(count);

for(var i=0; i<count; i++){
	myWin[i] = 0;
	cWin[i] = 0;
}

var chess = document.getElementById("chess");
var context = chess.getContext("2d");

context.strokeStyle = "#bfbfbf";

var logo = new Image();
logo.src="img/logo.jpg";
logo.onload = function() {
	context.globalAlpha=0.05;
	context.drawImage(logo, 50, 50, 350, 350);
	context.globalAlpha=1;
	drawChessBoard();

}

var drawChessBoard = function() {
	for (var i = 0; i<15; i++) {
		context.moveTo(15 + i*30, 15);
		context.lineTo(15 + i*30, 435);
		context.stroke();
		context.moveTo(15, 15 + i*30);
		context.lineTo(435, 15 + i*30);
		context.stroke();
	}
}

var oneStep = function(i, j, me) {
	context.beginPath();
	context.arc(15 + i*30, 15 + j*30,  12, 0, 2 * Math.PI);
	context.closePath();
	var gradient = context.createRadialGradient(15 + i*30 - 2, 15 + j*30 - 2, 12, 15 + i*30 + 2, 15 + j*30 + 2, 0);
	if(me) {
		gradient.addColorStop(0, "#0a0a0a");
		gradient.addColorStop(1, "#636766");

	} else {
		gradient.addColorStop(0, "#d1d1d1");
		gradient.addColorStop(1, "#f9f9f9");
	}
	context.fillStyle = gradient;
	context.fill();
}

chess.onclick = function(e) {
	if(over){
		return;
	}
	if(!me) {
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30); 
	var j = Math.floor(y / 30); 
	if(chessBoard[i][j] == 0) {
		oneStep(i, j, me);
		chessBoard[i][j] = 1;

		for(var k=0; k<count; k++) {
			if(wins[i][j][k]) {
				myWin[k]++;
				cWin[k] = 6;
				if(myWin[k] == 5) {
					info = "You Win!╰(*°▽°*)╯ Restart the Game?";
					setTimeout("restart(info)",200);
					over = true;
				}
			}
		}
		if(!over) {
			me = !me;
			computerAI();
		}
	}
}


var computerAI = function() {
	var myScore = [];
	var cScore = [];
	var max = 0; //保存最高分
	var u = 0, v = 0;	//保存最高分数点的坐标
	for(var i=0; i<15; i++) {
		myScore[i]=[];
		cScore[i] = [];
		for(var j=0; j<15; j++) {
			myScore[i][j] = 0;
			cScore[i][j] = 0;
		}
	}
	for(var i=0; i<15; i++) {
		for(var j=0; j<15; j++) {
			if(chessBoard[i][j] == 0) {
				for(var k=0; k<count; k++) {
					if(wins[i][j][k]) {
						if(myWin[k] == 1) {
							myScore[i][j] += 200;
						} else if(myWin[k] == 2) {
							myScore[i][j] += 400;
						} else if(myWin[k] == 3) {
							myScore[i][j] += 2000;
						} else if(myWin[k] == 4) {
							myScore[i][j] += 10000;
						}
						if(cWin[k] == 1) {
							cScore[i][j] += 220;
						} else if(cWin[k] == 2) {
							cScore[i][j] += 420;
						} else if(cWin[k] == 3) {
							cScore[i][j] += 2100;
						} else if(cWin[k] == 4) {
							cScore[i][j] += 20000;
						}
					}
				}
				if(myScore[i][j] > max) {
					max = myScore[i][j];
					u = i;
					v = j;
				} else if(myScore[i][j] == max) {
					if(cScore[i][j] > cScore[u][v]) {
						u = i;
						v = j;
					}
				}
				if(cScore[i][j] > max) {
					max = cScore[i][j];
					u = i;
					v = j;
				} else if(cScore[i][j] == max) {
					if(myScore[i][j] > myScore[u][v]) {
						u = i;
						v = j;
					}
				}
			}
		}
	}
	oneStep(u, v, false);
	chessBoard[u][v] = 2;
	for(var k=0; k<count; k++) {
		if(wins[u][v][k]){
			cWin[k]++;
			myWin[k] = 6;
			if(cWin[k] == 5) {
				over = true;
				info = "You Lose! (TvT) Restart the Game?";
				setTimeout("restart(info)",200);
			}
		}
	}
	if(!over) {
		me = !me;
	}
}

function restart(info) {
	var r = confirm(info);
	if(r) {
		window.location.reload();
	}
}
