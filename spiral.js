/*===========
  
ICS344 
Assignment 01
2023/09/29

Esam Jaafar
201751810 

===========*/

var gl
var points = []

// Function to generate the spiral vertices
function spiral(
  vertices,
  alpha,
  alphaIncrement,
  radius,
  radiusIncrement,
  xCenter,
  yCenter
) {
  alpha = (alpha * Math.PI) / 180.0 // Convert to radians
  alphaIncrement = (alphaIncrement * Math.PI) / 180.0 // Convert to radians

  for (var i = 0; i < vertices; i++) {
    var x = xCenter + radius * Math.cos(alpha)
    var y = yCenter + radius * Math.sin(alpha)

    // Push the current vertex
    points.push(x, y)

    // Increment the angle (alpha) and radius for the next vertex
    alpha += alphaIncrement
    radius += radiusIncrement
  }
}

// Initialization function
window.onload = function init() {
  var canvas = document.getElementById('gl-canvas')
  gl = WebGLUtils.setupWebGL(canvas)
  if (!gl) {
    alert("WebGL isn't available")
    return
  }

  // Setup WebGL viewport
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  // Generate the spiral vertices
  spiral(450, 0, 4, 0.09, 0.0015, 0.0, 0.0)

  // Load the spiral data into the GPU
  var bufferId = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW)

  // Load shaders and initialize attribute buffers
  var program = initShaders(gl, 'vertex-shader', 'fragment-shader')
  gl.useProgram(program)

  // Associate out shader variables with our data buffer
  var vPosition = gl.getAttribLocation(program, 'vPosition')
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(vPosition)

  render()
}

// Render function
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT)
  for (var i = 0; i < points.length / 2 - 1; i++) {
    gl.drawArrays(gl.LINE_STRIP, i, 2) // Drawing a line segment
  }
}
