// ============================================
// MAZE BACKGROUND - Locked State Version
// All state is stored globally to prevent re-rendering on navigation
// ============================================

// Global state - persists across all navigations
window._maze = window._maze || {
  initialized: false,
  dimensions: null,
  state: null,
  animationId: null
};

function initMazeBackground() {
  // If already initialized, do nothing
  if (window._maze.initialized && window._maze.animationId) {
    console.log('🎨 Maze already running, skipping init');
    return;
  }

  var canvas = document.getElementById('bg');
  if (!canvas) {
    setTimeout(initMazeBackground, 100);
    return;
  }

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Lock dimensions on FIRST init only
  if (!window._maze.dimensions) {
    window._maze.dimensions = {
      W: window.innerWidth,
      H: window.innerHeight,
      DPR: Math.min(window.devicePixelRatio || 1, 2),
      CELL: 50
    };
    console.log('🔒 Dimensions locked:', window._maze.dimensions.W, 'x', window._maze.dimensions.H);
  }

  var d = window._maze.dimensions;
  var W = d.W, H = d.H, DPR = d.DPR, CELL = d.CELL;

  // Set canvas size from locked dimensions
  canvas.width = W * DPR;
  canvas.height = H * DPR;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

  var palette = {
    bg: '#080c18',
    particle: ['#5b9cf5','#a78bfa','#34d399','#f472b6','#60a5fa','#c084fc','#38bdf8','#818cf8'],
    symbol: '#a0c4f0',
    glow: ['rgba(91,156,245,0.12)','rgba(167,139,250,0.09)','rgba(52,211,153,0.08)'],
  };

  // Initialize state only once
  if (!window._maze.state) {
    var cols = Math.ceil(W / CELL) + 2;
    var rows = Math.ceil(H / CELL) + 2;
    
    // Build maze
    var maze = [], adj = {};
    for (var r = 0; r < rows; r++) {
      maze[r] = [];
      for (var c = 0; c < cols; c++) {
        maze[r][c] = { right: false, down: false, visited: false };
      }
    }
    
    // Generate maze using DFS
    var stack = [];
    var sr = Math.floor(rows / 2), sc = Math.floor(cols / 2);
    maze[sr][sc].visited = true;
    stack.push([sr, sc]);
    
    while (stack.length) {
      var cur = stack[stack.length - 1];
      var cr = cur[0], cc = cur[1];
      var neighbors = [];
      if (cr > 0 && !maze[cr-1][cc].visited) neighbors.push([cr-1, cc, 'up']);
      if (cr < rows-1 && !maze[cr+1][cc].visited) neighbors.push([cr+1, cc, 'down']);
      if (cc > 0 && !maze[cr][cc-1].visited) neighbors.push([cr, cc-1, 'left']);
      if (cc < cols-1 && !maze[cr][cc+1].visited) neighbors.push([cr, cc+1, 'right']);
      if (neighbors.length === 0) { stack.pop(); continue; }
      var pick = neighbors[Math.floor(Math.random() * neighbors.length)];
      var nr = pick[0], nc = pick[1], dir = pick[2];
      if (dir === 'right') maze[cr][cc].right = true;
      if (dir === 'left') maze[nr][nc].right = true;
      if (dir === 'down') maze[cr][cc].down = true;
      if (dir === 'up') maze[nr][nc].down = true;
      maze[nr][nc].visited = true;
      stack.push([nr, nc]);
    }
    
    // Add extra connections
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        if (c < cols - 1 && !maze[r][c].right && Math.random() < 0.3) maze[r][c].right = true;
        if (r < rows - 1 && !maze[r][c].down && Math.random() < 0.3) maze[r][c].down = true;
      }
    }
    
    // Build adjacency
    function nodeKey(r, c) { return r + ',' + c; }
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var k = nodeKey(r, c);
        adj[k] = [];
        if (maze[r][c].right && c < cols - 1) adj[k].push(nodeKey(r, c+1));
        if (maze[r][c].down && r < rows - 1) adj[k].push(nodeKey(r+1, c));
        if (c > 0 && maze[r][c-1] && maze[r][c-1].right) adj[k].push(nodeKey(r, c-1));
        if (r > 0 && maze[r-1] && maze[r-1][c] && maze[r-1][c].down) adj[k].push(nodeKey(r-1, c));
      }
    }
    
    // Create particles
    var particles = [];
    var pCount = Math.min(80, Math.floor((W * H) / 12000));
    for (var i = 0; i < pCount; i++) {
      var pr = Math.floor(Math.random() * rows);
      var pc = Math.floor(Math.random() * cols);
      particles.push({
        r: pr, c: pc, x: pc * CELL, y: pr * CELL,
        targetX: pc * CELL, targetY: pr * CELL,
        moving: false, speed: 1.2 + Math.random() * 2.5,
        color: palette.particle[Math.floor(Math.random() * palette.particle.length)],
        size: 1.2 + Math.random() * 1.8,
        trail: [], trailMax: 20 + Math.floor(Math.random() * 30),
        life: 0, maxLife: 500 + Math.random() * 800,
        prevDir: null, glowSize: 6 + Math.random() * 8
      });
    }
    
    // Create symbols
    var mathSymbols = ['∇','×','·','∂','∫','→','λ','Σ','θ','φ','ω','∞','Δ','∈'];
    var symbols = [];
    var sCount = Math.min(12, Math.floor((W * H) / 100000));
    for (var i = 0; i < sCount; i++) {
      symbols.push({
        x: Math.random()*W, y: Math.random()*H,
        symbol: mathSymbols[Math.floor(Math.random()*mathSymbols.length)],
        size: 14+Math.random()*22, vy: -0.08-Math.random()*0.15,
        maxAlpha: 0.035+Math.random()*0.045, life: Math.random()*800,
        maxLife: 700+Math.random()*900, rotation: Math.random()*Math.PI*2,
        rotSpeed: (Math.random()-0.5)*0.002
      });
    }
    
    window._maze.state = {
      maze: maze, adj: adj, cols: cols, rows: rows,
      particles: particles, symbols: symbols, time: 0
    };
    
    console.log('🚀 Maze state created:', pCount, 'particles,', sCount, 'symbols');
  }

  var s = window._maze.state;
  var time = s.time;

  function nodeKey(r, c) { return r + ',' + c; }
  function parseKey(k) { var p = k.split(','); return [parseInt(p[0]), parseInt(p[1])]; }

  function drawMaze() {
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(91, 156, 245, 0.6)';
    for (var r = 0; r < s.rows; r++) {
      for (var c = 0; c < s.cols; c++) {
        var x = c * CELL, y = r * CELL;
        if (s.maze[r][c].right) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + CELL, y); ctx.stroke(); }
        if (s.maze[r][c].down) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + CELL); ctx.stroke(); }
      }
    }
  }

  function drawGlows() {
    var glows = [
      { x: W * 0.2, y: H * 0.3, r: 350, color: palette.glow[0] },
      { x: W * 0.78, y: H * 0.65, r: 400, color: palette.glow[1] },
      { x: W * 0.5, y: H * 0.08, r: 280, color: palette.glow[2] }
    ];
    for (var i = 0; i < glows.length; i++) {
      var g = glows[i];
      var ox = Math.sin(time * 0.12 + g.x * 0.01) * 40;
      var oy = Math.cos(time * 0.1 + g.y * 0.01) * 30;
      var grad = ctx.createRadialGradient(g.x + ox, g.y + oy, 0, g.x + ox, g.y + oy, g.r);
      grad.addColorStop(0, g.color); grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    }
  }

  function tickParticle(p) {
    p.life++;
    if (p.life > p.maxLife) {
      p.r = Math.floor(Math.random() * s.rows);
      p.c = Math.floor(Math.random() * s.cols);
      p.x = p.c * CELL; p.y = p.r * CELL;
      p.targetX = p.x; p.targetY = p.y;
      p.life = 0; p.maxLife = 500 + Math.random() * 800;
      p.trail = [];
    }
    if (p.moving) {
      var dx = p.targetX - p.x, dy = p.targetY - p.y;
      if (Math.abs(dx) + Math.abs(dy) < p.speed) {
        p.x = p.targetX; p.y = p.targetY; p.moving = false;
        // Pick next
        var k = nodeKey(p.r, p.c);
        var nb = s.adj[k];
        if (nb && nb.length > 0) {
          var next = nb[Math.floor(Math.random() * nb.length)];
          var parts = parseKey(next);
          p.r = parts[0]; p.c = parts[1];
          p.targetX = p.c * CELL; p.targetY = p.r * CELL;
          p.moving = true;
        }
      } else {
        if (Math.abs(dx) > 0.1) p.x += (dx > 0 ? 1 : -1) * p.speed;
        else p.y += (dy > 0 ? 1 : -1) * p.speed;
      }
    } else {
      var k = nodeKey(p.r, p.c);
      var nb = s.adj[k];
      if (nb && nb.length > 0) {
        var next = nb[Math.floor(Math.random() * nb.length)];
        var parts = parseKey(next);
        p.r = parts[0]; p.c = parts[1];
        p.targetX = p.c * CELL; p.targetY = p.r * CELL;
        p.moving = true;
      }
    }
    p.trail.push({ x: p.x, y: p.y });
    if (p.trail.length > p.trailMax) p.trail.shift();
  }

  function renderParticle(p) {
    var fadeIn = Math.min(1, p.life / 30);
    var fadeOut = Math.min(1, (p.maxLife - p.life) / 60);
    var alpha = fadeIn * fadeOut;
    if (p.trail.length > 2) {
      for (var i = 1; i < p.trail.length; i++) {
        var t = i / p.trail.length;
        ctx.beginPath(); ctx.moveTo(p.trail[i-1].x, p.trail[i-1].y); ctx.lineTo(p.trail[i].x, p.trail[i].y);
        ctx.strokeStyle = p.color; ctx.globalAlpha = alpha * t * 0.5;
        ctx.lineWidth = p.size * (0.3 + t * 0.7); ctx.lineCap = 'round'; ctx.stroke();
      }
    }
    ctx.globalAlpha = alpha * 0.95;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = p.color; ctx.fill();
    ctx.globalAlpha = 1;
  }

  function tickSymbol(sym) {
    sym.y += sym.vy; sym.rotation += sym.rotSpeed; sym.life++;
    if (sym.life > sym.maxLife) {
      sym.x = Math.random()*W; sym.y = H + 50;
      sym.life = 0; sym.maxLife = 700+Math.random()*900;
    }
  }

  function renderSymbol(sym) {
    var fi = Math.min(1, sym.life/120), fo = Math.min(1, (sym.maxLife-sym.life)/120);
    ctx.save(); ctx.translate(sym.x, sym.y); ctx.rotate(sym.rotation);
    ctx.globalAlpha = sym.maxAlpha * fi * fo;
    ctx.font = sym.size + "px serif";
    ctx.fillStyle = palette.symbol; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(sym.symbol, 0, 0); ctx.restore();
  }

  var lastFrameTime = 0;
  var frameInterval = 1000 / 30; // 30 FPS

  function animate(currentTime) {
    if (currentTime - lastFrameTime < frameInterval) {
      window._maze.animationId = requestAnimationFrame(animate);
      return;
    }
    lastFrameTime = currentTime;
    time += 0.016;
    s.time = time;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = palette.bg; ctx.fillRect(0, 0, W, H);
    
    drawGlows();
    drawMaze();
    
    for (var i = 0; i < s.symbols.length; i++) { tickSymbol(s.symbols[i]); renderSymbol(s.symbols[i]); }
    for (var i = 0; i < s.particles.length; i++) { tickParticle(s.particles[i]); renderParticle(s.particles[i]); }
    
    window._maze.animationId = requestAnimationFrame(animate);
  }

  window._maze.initialized = true;
  window._maze.animationId = requestAnimationFrame(animate);
  console.log('✅ Maze animation started');
}

// Only respond to REAL window resize (100px+ change)
window.addEventListener('resize', function() {
  if (!window._maze.dimensions) return;
  var d = window._maze.dimensions;
  var deltaW = Math.abs(window.innerWidth - d.W);
  var deltaH = Math.abs(window.innerHeight - d.H);
  
  // Only resize if change > 100px (actual browser resize, not navigation)
  if (deltaW > 100 || deltaH > 100) {
    console.log('🔄 Real window resize detected, resetting maze');
    window._maze = { initialized: false, dimensions: null, state: null, animationId: null };
    initMazeBackground();
  }
});

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMazeBackground);
} else {
  initMazeBackground();
}
