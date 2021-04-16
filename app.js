var seeds = [];
var particles = [];
var MAX_SEEDS = 5;

function setup() {
	var cnv = createCanvas(innerWidth,innerHeight,P2D);
	cnv.parent('#wrapper');
	frameRate(60);
	background(0);
	imageMode(CENTER);
	colorMode(HSB,360,100,150,100);
}

function draw() {
	var unfinished = seeds.filter(seed=>!seed.finished);
	if (unfinished.length==0) {
		background(0);
	}
	else {
		fill(0,10);
		noStroke();
		rect(0,0,width,height);
		seeds.map(seed => {
			if (!seed.finished) {
				seed.draw();
			}
		});
	}
	
}

function mouseClicked() {
	var unfinished = seeds.filter(seed=>!seed.finished);
	if (unfinished.length<MAX_SEEDS) {
		var h = int(random(1.0)*360);
		let nSeed = new Seed(mouseX,mouseY,h);
		seeds.push(nSeed);
		if (seeds.length>MAX_SEEDS) {
			seeds.splice(0,1);
		}
	}	
}

function windowResized() {
	seeds.map(seed=>seed.finished=true);
	resizeCanvas(innerWidth,innerHeight);
}

class Seed {
	constructor(x,y,h) {
		this.noiseScale = 0.2;
		this.u = 0;
		this.n = 0;
		this.i = 0;
		this.j = 0;
		this.x = x;
		this.y = height;
		this.nx = x;
		this.ny = height;
		this.ix = x;
		this.iy = y;
		this.h = h;
		this.deltaY = 0;
		this.finished = false;
	}
	draw() {
		this.ny -= 13*(this.deltaY+0.07);
		if (this.ny > this.iy+5) {
			this.deltaY = Math.sqrt(this.ny - this.iy)/Math.sqrt(height);
			this.i++;
			this.n = (noise(this.noiseScale*this.i)*50-25)*this.deltaY;
			this.nx = this.ix+this.n;
			noFill();
			stroke(255);
			strokeWeight(10.0*Math.sqrt(height - this.iy)/Math.sqrt(height));
			line(this.x,this.y,this.nx,this.ny);
			this.x = this.nx;
			this.y = this.ny;
		} else {
			this.j++;
			if (this.j==15) {
				this.flower = new Flower(this.ix,this.iy,this.h);
			}
			if (this.j>15 && !this.flower.finished) {
				this.flower.draw();
			}
			else if(this.j>15 && this.flower.finished) {
				this.finished = true;
				//console.log('finished!');
			}
		}

	}
}

class Flower {
	constructor(ix,iy,h) {
		this.NUM = 500;
		this.INUM = 250;
		this.particles = [];
		this.iparticles = [];
		this.h = h;
		this.r = 4.5*Math.sqrt(height - iy)/Math.sqrt(height);
		this.finished = false;
		//console.log(this.r);
		for (let i=0; i<this.NUM; i++) {
			let angle = random(PI*2);
			let len = random(4.0*(1-(1.0*iy/height)),10.0*(1-(1.0*iy/height)));
			let nparticle = new Particle(ix,iy,cos(angle)*len,sin(angle)*len,this.r,46,30,150);
			this.particles.push(nparticle);
		}
		for (let i=0; i<this.INUM; i++) {
			let angle = random(PI*2);
			let len = random(5.0*(1-(1.0*iy/height)));
			let niparticle = new Particle(ix,iy,cos(angle)*len,sin(angle)*len,this.r,this.h,60,150);
			this.iparticles.push(niparticle);
		}
		//console.log(this.particles);
	}
	draw() {
		this.particles.map(particle=>{
			if (!particle.finished){
				particle.update();
				particle.draw();
			} else {
				this.finished = true;
			}
		});
		this.iparticles.map(iparticle=>{
			if (!iparticle.finished){
				iparticle.update();
				iparticle.draw();
			} else {
				this.finished = true;
			}
		});
	}
}

class Particle {
	constructor(x,y,vx,vy,r,h,s,b) {
		this.location = createVector(x,y);
		this.velocity = createVector(vx,vy);
		this.acceleration = createVector(0.0,0.02);
		this.radius = r;
		this.h = h;
		this.s = s;
		this.b = b;
		this.finished = false;
	}
	update() {
		this.velocity.add(this.acceleration);
		this.velocity.mult(0.98);
		this.location.add(this.velocity);
	}
	draw() {
		this.b-=1;
		if (this.b>0) {
			fill(this.h,this.s,this.b);
			noStroke();
			ellipse(this.location.x,this.location.y,this.radius,this.radius);
		}
		else {
			this.finished = true;
		}
	}
}