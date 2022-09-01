//size of canvas
kaboom({
    global:true,
    scale: 2,
	fullscreen: true,
    debug:true,
    clearColor: [ 0, 0, 0, 1 ],
});

const PIPE_MARGIN = 80;
const PIPE_OPEN = 120;

loadSprite("bg", "assets/4622710.webp");
//load the background
loadSprite("pipe", "assets/pipe.png");
//load the pipe
loadSprite("bird", "bird.png");
loadSound("wooosh", "assets/Woosh.mp3");
//load the sound 
loadSound("scream", "assets/Scream.mp3");
loadSound("horn", "assets/Horn.mp3");
loadSound("horse", "assets/Hsound.mp3");
loadSound("whizz", "assets/Whiz.mp3");

scene("game", () => {

	const PIPE_MARGIN = 80;
	const PIPE_OPEN = 120;
	const SPEED = 120;
	const JUMP_FORCE = 320;

	gravity(1200);

	layers([
		"game",
		"ui",
	], "game");

	play("horse");

	add([
		sprite("bg", {
			width: width(),
			height: height(),
		}),
	]);

	let score = 0;

	const scoreLabel = add([
		text(score, 32),
		pos(12, 12),
		layer("ui"),
	]);

	const mark = add([
		sprite("bird"),
		pos(80, 80),
		body(),
	]);

	mark.action(() => {
		if (mark.pos.y >= height() + 24) {
			play("scream");
			go("gameover", score);
		}
	});

	loop(1, () => {

		const y = rand(PIPE_MARGIN, height() - PIPE_MARGIN);

		add([
			sprite("pipe", { flipY: true, }),
			pos(width(), y - PIPE_OPEN / 2),
			origin("botleft"),
			"pipe",
		]);

		add([
			sprite("pipe"),
			pos(width(), y + PIPE_OPEN / 2),
			origin("topleft"),
			"pipe",
			{ passed: false, },
		]);

	});

	mark.collides("pipe", () => {
		play("horn");
		go("gameover", score);
	});

	action("pipe", (pipe) => {
		pipe.move(-SPEED, 0);
		if (pipe.passed === false && pipe.pos.x <= mark.pos.x) {
			pipe.passed = true;
			score += 1;
			scoreLabel.text = score;
			play("whizz");
		}
		if (pipe.pos.x <= -120) {
			destroy(pipe);
		}
	});

	keyPress("space", () => {
		mark.jump(JUMP_FORCE);
		play("wooosh");
	});

});

scene("gameover", (score) => {

	add([
		text("Game Over", 16),
		pos(width() / 2, 120),
		origin("center"),
	]);

	add([
		text(score, 48),
		pos(width() / 2, 180),
		origin("center"),
	]);

	keyPress("space", () => {
		go("game");
	});

});

go("game");