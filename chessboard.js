/*===========
  
ICS344 
Assignment 01
2023/09/29

Esam Jaafar
201751810 

===========*/

// Initialize board state with alternating black and white squares
let boardState = Array(8)
  .fill(null)
  .map((_, row) =>
    Array(8)
      .fill(null)
      .map((_, col) => (row + col) % 2)
  )

window.onload = function () {
  // Setup WebGL
  const canvas = document.getElementById('gl-canvas')
  const gl = WebGLUtils.setupWebGL(canvas)

  // Load shaders and initialize attribute buffers
  const program = initShaders(gl, 'vertex-shader', 'fragment-shader')
  gl.useProgram(program)

  // Get Uniform Locations
  const colorUniform = gl.getUniformLocation(program, 'uColor')

  // Initial Draw
  drawChessboard(gl, program, colorUniform)
  // Draw outline
  drawOutline(gl, program, colorUniform)

  // Add mouse click event
  canvas.addEventListener('click', function (event) {
    // Get canvas bounds
    const rect = canvas.getBoundingClientRect()

    // Convert to WebGL coordinates
    const x = ((event.clientX - rect.left) / canvas.width) * 2 - 1
    const y = ((event.clientY - rect.top) / canvas.height) * -2 + 1

    // RGBA color values will be stored here
    const clickX = ((x + 1) * canvas.width) / 2
    const clickY = ((y + 1) * canvas.height) / 2
    const pixelData = new Uint8Array(4)
    gl.readPixels(clickX, clickY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixelData)

    // Find the row and column
    const row = Math.floor((y + 1) * 4)
    const col = Math.floor((x + 1) * 4)

    // Toggle color in boardState
    boardState[row][col] = boardState[row][col] === 1 ? 0 : 1

    // Redraw the board
    drawChessboard(gl, program, colorUniform)
    drawOutline(gl, program, colorUniform) // Draw outline
  })
}

function drawChessboard(gl, program, colorUniform) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      drawSquare(gl, program, colorUniform, row, col, boardState[row][col])
    }
  }
}

function drawSquare(gl, program, colorUniform, row, col, state) {
  const x = col / 4 - 1
  const y = row / 4 - 1

  // Define vertices and indices for square
  const vertices = new Float32Array([
    x,
    y,
    x + 0.25,
    y,
    x + 0.25,
    y + 0.25,
    x,
    y + 0.25,
  ])

  const indices = new Uint16Array([0, 1, 2, 2, 3, 0])

  // Setup Buffers
  setupBuffers(gl, vertices, indices, program)

  // Set color based on state
  const color = state === 1 ? [1, 1, 1, 1] : [0, 0, 0, 1]
  gl.uniform4fv(colorUniform, color)

  // Draw square
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0)
}

function setupBuffers(gl, vertices, indices, program) {
  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  // Load the spiral data into the GPU
  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  // Associate out shader variables with our data buffer
  const position = gl.getAttribLocation(program, 'vPosition')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
}

// Function to draw the outline
function drawOutline(gl, program, colorUniform) {
  const outlineVertices = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1])

  const outlineIndices = new Uint16Array([0, 1, 1, 2, 2, 3, 3, 0])

  // Setup Buffers
  setupBuffers(gl, outlineVertices, outlineIndices, program)

  // Set color to black
  gl.uniform4fv(colorUniform, [0, 0, 0, 1])

  // Draw Outline
  gl.drawElements(gl.LINES, outlineIndices.length, gl.UNSIGNED_SHORT, 0)
}
