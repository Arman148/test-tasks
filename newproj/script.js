const sectors = [
    {color:"#f82", label:"Stack"},
    {color:"#0bf", label:"10"},
    {color:"#fb0", label:"200"},
    {color:"#0fb", label:"50"},
    {color:"#b0f", label:"100"},
    {color:"#f0b", label:"5"},
    {color:"#bf0", label:"500"},
  ];
  
  // Generate random float in range min-max:
  const randomNumber = (m, M) => {

    return Math.random() * (M - m) + m;

  }
  
  const totalNumberOfElements = sectors.length;
  const spinButton = document.getElementById("spin");
  const ctx = document.getElementById("wheel").getContext`2d`;
  const widthOfWheelCanvas = ctx.canvas.width;
  const wheelRadius = widthOfWheelCanvas / 2;
  const PI = Math.PI;
  const degreesInCircle = 2 * PI;
  const angleOfEachElement = degreesInCircle / totalNumberOfElements;
  const deceleration = 0.98;  // 0.995=soft, 0.99=mid, 0.98=hard
  const stopSpeed = 0.001; // Below that number will be treated as a stop

  let isSpinning = false;
  let isAccelerating = false;
  let maxSpeed = 0; // Random ang.vel. to accelerate to 
  let currentSpeed = 0;    // Current angular velocity
  let rotationAngle = 0;       // Angle rotation in wheelRadiusians
  
  let animationFrame = null; // Engine's requestAnimationFrame
  //* Get index of current sector */
  const getIndex = () => Math.floor(totalNumberOfElements - rotationAngle / degreesInCircle * totalNumberOfElements) % totalNumberOfElements;
  
  //* Draw sectors and prizes texts to canvas */
  const drawSector = (sector, i) => {
    const rotationAngle = angleOfEachElement * i;
    ctx.save();
    // COLOR
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(wheelRadius, wheelRadius);
    ctx.arc(wheelRadius, wheelRadius, wheelRadius, rotationAngle, rotationAngle + angleOfEachElement);
    ctx.lineTo(wheelRadius, wheelRadius);
    ctx.fill();
    // TEXT
    ctx.translate(wheelRadius, wheelRadius);
    ctx.rotate(rotationAngle + angleOfEachElement / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(sector.label, wheelRadius - 10, 10);
    //
    ctx.restore();
  };
  
  //* CSS rotate CANVAS Element */
  const rotation = () => {
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${rotationAngle - PI / 2}rad)`;
    spinButton.textContent = !currentSpeed ? "SPIN" : sector.label;
    spinButton.style.background = sector.color;
  };
  
  const frame = () => {
  
    if (!isSpinning) return;
  
    if (currentSpeed >= maxSpeed) isAccelerating = false;
  
    // Accelerate
    if (isAccelerating) {
      currentSpeed ||= stopSpeed; // Initial velocity kick
      currentSpeed *= 1.06; // Accelerate
    }
    
    // Decelerate
    else {
      isAccelerating = false;
      currentSpeed *= deceleration; // Decelerate by friction  
  
      // SPIN END:
      if (currentSpeed < stopSpeed) {
        isSpinning = false;
        currentSpeed = 0;
        cancelAnimationFrame(animationFrame);
      }
    }
  
    rotationAngle += currentSpeed; // Update angle
    rotationAngle %= degreesInCircle;    // Normalize angle
    rotation();      // CSS rotate!
  };
  
  const engine = () => {
    frame();
    animationFrame = requestAnimationFrame(engine)
    
  };
  
  spinButton.addEventListener("click", () => {
      if (isSpinning) return;
      isSpinning = true;
      isAccelerating = true;
      maxSpeed = randomNumber(0.25, 0.40);
      engine(); // Start engine!
  });
  
  // INIT!
  sectors.forEach(drawSector);
  rotation(); // Initial rotation