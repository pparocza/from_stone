function setup() {
    createCanvas(windowWidth, windowHeight);
    background(0);
    noStroke();
  }

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }
  
  function draw() {
    background(0);
    from = color(random( 0 , 255 ), random( 0 , 255 ), random( 0 , 255 ), 255);
    to = color(random( 0 , 255 ), random( 0 , 255 ), random( 0 , 255 ), 255);
    c1 = lerpColor(from, to, 0.33);
    c2 = lerpColor(from, to, 0.66);
    for (let i = 0; i < 15; i++) {
      fill(from);
      quad(
        random(0, windowWidth), random(windowHeight),
        random(0, windowWidth), random(windowHeight),
        random(0, windowWidth), random(windowHeight),
        random(0, windowWidth), random(windowHeight)
      );
      fill(c1);
      quad(
        random(0, windowWidth), random(windowHeight),
        random(0, windowWidth), random(windowHeight),
        random(0, windowWidth), random(windowHeight),
        random(0, windowWidth), random(windowHeight)
      );
      fill(c2);
      quad(
        random(0, windowWidth), random(windowHeight),
        random(0, windowWidth), random(windowHeight),
        random(0, windowWidth), random(windowHeight),
        random(0, windowWidth), random(windowHeight)
      );
      fill(to);
      quad(
        random(0, windowWidth), random(windowHeight),
        random(0, windowWidth), random(windowHeight),
        random(0, windowWidth), random(windowHeight),
        random(0, windowWidth), random(windowHeight)
      );
    }
    frameRate(0.5);
  }