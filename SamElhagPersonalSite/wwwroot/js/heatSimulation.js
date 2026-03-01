window.HeatSimulation = {
    _animationId: null,

    dispose: function () {
        if (this._animationId) {
            cancelAnimationFrame(this._animationId);
            this._animationId = null;
        }
    },

    init: function () {
        this.dispose();

        const canvas = document.getElementById('simulationCanvas');
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false; // Not applicable with putImageData; disable to avoid overhead

        const width = canvas.width;
        const height = canvas.height;
        const self = this;

        let params = {
            alpha: 0.5,
            airspeed: 100,
            surfaceTemp: 500,
            ambientTemp: 288,
            angleOfAttack: 5,
            dt: 0.006,
            paused: false,
            showMath: false,
            showStreamlines: true
        };

        const gridWidth = 560;
        const gridHeight = 240;
        const dx = width / gridWidth;
        const dy = height / gridHeight;

        const k = 0.0262;
        const rho = 1.225;
        const cp = 1005;
        const mu = 1.81e-5;
        const Pr = 0.71;

        const N = gridWidth * gridHeight;
        let T        = new Float64Array(N).fill(params.ambientTemp);
        let Tnew     = new Float64Array(N).fill(params.ambientTemp);
        let u        = new Float64Array(N);
        let v        = new Float64Array(N);
        let airfoilMask = new Uint8Array(N); // 0 = air, 1 = airfoil

        // Pixel buffer — allocated once, reused every frame
        const imageData = ctx.createImageData(width, height);
        const pixels    = imageData.data; // Uint8ClampedArray, length = width * height * 4 (RGBA)

        let particles = [];

        // Add mouse tracking for temperature display
        const hoverTempElement = document.getElementById('hoverTemp');
        if (canvas && hoverTempElement) {
            canvas.addEventListener('mousemove', (e) => {
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;

                const mouseX = (e.clientX - rect.left) * scaleX;
                const mouseY = (e.clientY - rect.top) * scaleY;

                const j = Math.floor(mouseX / dx);
                const i = Math.floor(mouseY / dy);

                if (i >= 0 && i < gridHeight && j >= 0 && j < gridWidth) {
                    const idx = i * gridWidth + j;
                    const temp = T[idx].toFixed(1);
                    const tempC = (temp - 273.15).toFixed(1);
                    const isAirfoil = airfoilMask[idx] ? ' (Airfoil Surface)' : '(Air)';
                    hoverTempElement.textContent = `Temperature: ${temp} K (${tempC} °C Cordinates: ${Math.round(mouseX)},${Math.round(mouseY)})${isAirfoil}`;
                    hoverTempElement.style.display = 'block';
                }
            });

            canvas.addEventListener('mouseleave', () => {
                hoverTempElement.textContent = 'Hover over canvas to see temperature';
                hoverTempElement.style.display = 'block';
            });
        }

        function nacaAirfoil(x, c) {
            c = c || 1.0;
            const t = 0.12;
            if (x < 0 || x > c) return 0;
            const xNorm = x / c;
            const yt = 5 * t * c * (
                0.2969 * Math.sqrt(xNorm) -
                0.1260 * xNorm -
                0.3516 * xNorm * xNorm +
                0.2843 * xNorm * xNorm * xNorm -
                0.1015 * xNorm * xNorm * xNorm * xNorm
            );
            return yt;
        }

        function initializeSimulation() {
            const centerY = gridHeight / 2;
            const chordStart = Math.floor(gridWidth * 0.15);
            const chordLength = Math.floor(gridWidth * 0.6);
            const angleRad = params.angleOfAttack * Math.PI / 180;

            for (let i = 0; i < gridHeight; i++) {
                for (let j = 0; j < gridWidth; j++) {
                    const idx = i * gridWidth + j;
                    T[idx] = params.ambientTemp;
                    airfoilMask[idx] = 0;
                    u[idx] = params.airspeed;
                    v[idx] = 0;
                }
            }

            for (let i = 0; i < gridHeight; i++) {
                for (let j = 0; j < gridWidth; j++) {
                    const idx = i * gridWidth + j;
                    const xLocal = (j - chordStart) * dx;
                    const yLocal = (i - centerY) * dy;
                    const xRot = xLocal * Math.cos(-angleRad) - yLocal * Math.sin(-angleRad);
                    const yRot = xLocal * Math.sin(-angleRad) + yLocal * Math.cos(-angleRad);
                    const thickness = nacaAirfoil(xRot, chordLength * dx);

                    if (xRot >= 0 && xRot <= chordLength * dx && Math.abs(yRot) <= thickness) {
                        airfoilMask[idx] = 1;
                        T[idx] = params.surfaceTemp;
                    }
                }
            }

            for (let i = 0; i < gridHeight; i++) {
                for (let j = 0; j < gridWidth; j++) {
                    const idx = i * gridWidth + j;
                    if (!airfoilMask[idx]) {
                        const xLocal = (j - chordStart) * dx;
                        const yLocal = (i - centerY) * dy;
                        const xRot = xLocal * Math.cos(-angleRad) - yLocal * Math.sin(-angleRad);
                        const yRot = xLocal * Math.sin(-angleRad) + yLocal * Math.cos(-angleRad);
                        const r = Math.sqrt(xRot * xRot + yRot * yRot);
                        const theta = Math.atan2(yRot, xRot);
                        const circulation = params.angleOfAttack * 0.5;

                        if (r > 0.01) {
                            const vr = params.airspeed * (1 - (chordLength * dx * 0.25) / (r * r)) * Math.cos(theta);
                            const vtheta = -params.airspeed * (1 + (chordLength * dx * 0.25) / (r * r)) * Math.sin(theta) + circulation / r;
                            u[idx] = vr * Math.cos(theta) - vtheta * Math.sin(theta);
                            v[idx] = vr * Math.sin(theta) + vtheta * Math.cos(theta);
                        }
                    }
                }
            }

            particles = [];
            for (let i = 0; i < 300; i++) {
                particles.push({
                    x: Math.random() * width * 0.2,
                    y: Math.random() * height,
                    trail: []
                });
            }
        }

        function updateHeatTransfer() {
            for (let i = 1; i < gridHeight - 1; i++) {
                for (let j = 1; j < gridWidth - 1; j++) {
                    const idx  = i * gridWidth + j;
                    const idxL = idx - 1;
                    const idxR = idx + 1;
                    const idxU = idx - gridWidth;
                    const idxD = idx + gridWidth;

                    if (airfoilMask[idx]) {
                        Tnew[idx] = params.surfaceTemp;
                    } else {
                        const d2Tdx2 = (T[idxR] - 2 * T[idx] + T[idxL]) / (dx * dx);
                        const d2Tdy2 = (T[idxD] - 2 * T[idx] + T[idxU]) / (dy * dy);
                        const dTdx = u[idx] > 0 ? (T[idx] - T[idxL]) / dx : (T[idxR] - T[idx]) / dx;
                        const dTdy = v[idx] > 0 ? (T[idx] - T[idxU]) / dy : (T[idxD] - T[idx]) / dy;
                        const diffusion = params.alpha * (d2Tdx2 + d2Tdy2);
                        const convection = -u[idx] * dTdx - v[idx] * dTdy;
                        Tnew[idx] = T[idx] + params.dt * (diffusion + convection * 0.1);
                    }
                }
            }
            var tmp = T; T = Tnew; Tnew = tmp;
        }

        function updateParticles() {
            particles.forEach(function (p) {
                const i = Math.floor(p.y / dy);
                const j = Math.floor(p.x / dx);

                if (i >= 0 && i < gridHeight && j >= 0 && j < gridWidth && !airfoilMask[i * gridWidth + j]) {
                    const idx = i * gridWidth + j;
                    p.trail.push({ x: p.x, y: p.y });
                    if (p.trail.length > 40) p.trail.shift();
                    p.x += u[idx] * 0.15;
                    p.y += v[idx] * 0.15;
                } else {
                    p.trail = [];
                }

                if (p.x > width || p.x < 0 || p.y > height || p.y < 0) {
                    p.x = Math.random() * width * 0.2;
                    p.y = Math.random() * height;
                    p.trail = [];
                }
            });
        }

        function render() {
            // Build pixel buffer — one pass over grid cells, write directly to RGBA array
            for (let i = 0; i < gridHeight; i++) {
                for (let j = 0; j < gridWidth; j++) {
                    const temp       = T[i * gridWidth + j];
                    const normalized = Math.max(0, Math.min(1,
                        (temp - params.ambientTemp) / (params.surfaceTemp - params.ambientTemp)
                    ));
                    let r, g, b;

                    if (normalized < 0.25) {
                        const t = normalized / 0.25;
                        r = 0; g = Math.floor(t * 255); b = 255;
                    } else if (normalized < 0.5) {
                        const t = (normalized - 0.25) / 0.25;
                        r = 0; g = 255; b = Math.floor((1 - t) * 255);
                    } else if (normalized < 0.75) {
                        const t = (normalized - 0.5) / 0.25;
                        r = Math.floor(t * 255); g = 255; b = 0;
                    } else {
                        const t = (normalized - 0.75) / 0.25;
                        r = 255; g = Math.floor((1 - t) * 255); b = 0;
                    }

                    // Each grid cell covers a dx×dy block of canvas pixels (5×5 here)
                    const px = Math.floor(j * dx);
                    const py = Math.floor(i * dy);
                    const bw = Math.min(Math.ceil(dx) + 1, width  - px);
                    const bh = Math.min(Math.ceil(dy) + 1, height - py);

                    for (let by = 0; by < bh; by++) {
                        for (let bx = 0; bx < bw; bx++) {
                            const pidx = ((py + by) * width + (px + bx)) * 4;
                            pixels[pidx]     = r;
                            pixels[pidx + 1] = g;
                            pixels[pidx + 2] = b;
                            pixels[pidx + 3] = 255;
                        }
                    }
                }
            }
            ctx.putImageData(imageData, 0, 0); // One GPU upload instead of 134,400 fillRect calls

            if (params.showStreamlines) {
                particles.forEach(function (p) {
                    if (p.trail.length > 1) {
                        ctx.strokeStyle = 'rgba(200, 230, 255, 0.5)';
                        ctx.lineWidth = 2;
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        ctx.beginPath();
                        ctx.moveTo(p.trail[0].x, p.trail[0].y);
                        for (let i = 1; i < p.trail.length; i++) {
                            ctx.lineTo(p.trail[i].x, p.trail[i].y);
                        }
                        ctx.stroke();
                    }
                    ctx.fillStyle = 'rgba(220, 240, 255, 0.85)';
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                });
            }

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            for (let i = 0; i < gridHeight; i++) {
                for (let j = 0; j < gridWidth - 1; j++) {
                    const idx = i * gridWidth + j;
                    if (airfoilMask[idx] && (!airfoilMask[idx + 1] ||
                        (i > 0 && !airfoilMask[idx - gridWidth]) ||
                        (i < gridHeight - 1 && !airfoilMask[idx + gridWidth]) ||
                        !airfoilMask[idx - 1])) {
                        ctx.moveTo(j * dx, i * dy);
                        ctx.lineTo((j + 1) * dx, i * dy);
                    }
                }
            }
            ctx.stroke();

            if (params.showMath) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
                ctx.fillRect(30, 30, 1100, 560);
                ctx.strokeStyle = '#667eea';
                ctx.lineWidth = 3;
                ctx.strokeRect(30, 30, 1100, 560);

                ctx.fillStyle = '#667eea';
                ctx.font = 'bold 40px "Courier New"';
                ctx.fillText('GOVERNING EQUATION', 70, 90);

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 38px "Courier New"';
                ctx.fillText('\u2202T/\u2202t + u\u00b7\u2202T/\u2202x + v\u00b7\u2202T/\u2202y = \u03b1\u00b7\u2207\u00b2T', 70, 150);

                ctx.strokeStyle = '#667eea';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(70, 180);
                ctx.lineTo(1090, 180);
                ctx.stroke();

                ctx.fillStyle = '#fbbf24';
                ctx.font = 'bold 32px "Courier New"';
                ctx.fillText('FINITE DIFFERENCE DISCRETIZATION', 70, 230);

                ctx.fillStyle = '#ffffff';
                ctx.font = '28px "Courier New"';
                ctx.fillText('T[i,j]\u207f\u207a\u00b9 = T[i,j]\u207f + \u0394t \u00b7 {', 70, 280);

                ctx.fillStyle = '#a78bfa';
                ctx.fillText('  Diffusion:', 100, 320);
                ctx.fillStyle = '#e0e0e0';
                ctx.font = '26px "Courier New"';
                ctx.fillText('\u03b1\u00b7[(T[i,j+1] - 2T[i,j] + T[i,j-1])/\u0394x\u00b2', 120, 360);
                ctx.fillText('   + (T[i+1,j] - 2T[i,j] + T[i-1,j])/\u0394y\u00b2]', 120, 395);

                ctx.fillStyle = '#a78bfa';
                ctx.font = '28px "Courier New"';
                ctx.fillText('  Convection:', 100, 440);
                ctx.fillStyle = '#e0e0e0';
                ctx.font = '26px "Courier New"';
                ctx.fillText('- u\u00b7(\u2202T/\u2202x) - v\u00b7(\u2202T/\u2202y)', 120, 475);

                ctx.fillStyle = '#ffffff';
                ctx.font = '28px "Courier New"';
                ctx.fillText('}', 70, 515);

                ctx.fillStyle = '#10b981';
                ctx.font = 'bold 24px "Courier New"';
                ctx.fillText('\u03b1 = ' + params.alpha.toFixed(3) + ' m\u00b2/s  |  \u0394t = ' + params.dt.toFixed(4) + ' s  |  Grid: ' + gridWidth + ' \u00d7 ' + gridHeight, 70, 560);
            }

            calculateStats();
        }

        function calculateStats() {
            let totalFlux = 0;
            let count = 0;

            for (let i = 1; i < gridHeight - 1; i++) {
                for (let j = 1; j < gridWidth - 1; j++) {
                    const idx = i * gridWidth + j;
                    if (!airfoilMask[idx] && (airfoilMask[idx + gridWidth] || airfoilMask[idx - gridWidth] ||
                        airfoilMask[idx + 1] || airfoilMask[idx - 1])) {
                        const dT = params.surfaceTemp - T[idx];
                        totalFlux += k * dT / dx;
                        count++;
                    }
                }
            }

            const avgFlux = count > 0 ? totalFlux / count : 0;
            const heatFluxEl = document.getElementById('heatFlux');
            if (heatFluxEl) heatFluxEl.textContent = avgFlux.toExponential(2) + ' W/m\u00b2';

            const L = 1.0;
            const Re = rho * params.airspeed * L / mu;
            const reynoldsEl = document.getElementById('reynolds');
            if (reynoldsEl) reynoldsEl.textContent = Re.toExponential(2);

            const prandtlEl = document.getElementById('prandtl');
            if (prandtlEl) prandtlEl.textContent = Pr.toFixed(2);

            let Nu;
            if (Re < 5e5) {
                Nu = 0.664 * Math.pow(Re, 0.5) * Math.pow(Pr, 1 / 3);
            } else {
                Nu = 0.037 * Math.pow(Re, 0.8) * Math.pow(Pr, 1 / 3);
            }
            const nusseltEl = document.getElementById('nusselt');
            if (nusseltEl) nusseltEl.textContent = Nu.toFixed(1);
        }

        function animate() {
            if (!params.paused) {
                updateHeatTransfer();
                updateParticles();
            }
            render();
            self._animationId = requestAnimationFrame(animate);
        }

        // Event listeners
        var alphaSlider = document.getElementById('alphaSlider');
        if (alphaSlider) {
            alphaSlider.addEventListener('input', function (e) {
                params.alpha = parseFloat(e.target.value);
                var alphaValue = document.getElementById('alphaValue');
                if (alphaValue) alphaValue.textContent = params.alpha.toFixed(2);
            });
        }

        var airspeedSlider = document.getElementById('airspeedSlider');
        if (airspeedSlider) {
            airspeedSlider.addEventListener('input', function (e) {
                params.airspeed = parseFloat(e.target.value);
                var airspeedValue = document.getElementById('airspeedValue');
                if (airspeedValue) airspeedValue.textContent = params.airspeed;
                initializeSimulation();
            });
        }

        var tempSlider = document.getElementById('tempSlider');
        if (tempSlider) {
            tempSlider.addEventListener('input', function (e) {
                params.surfaceTemp = parseFloat(e.target.value);
                var tempValue = document.getElementById('tempValue');
                if (tempValue) tempValue.textContent = params.surfaceTemp;
                initializeSimulation();
            });
        }

        var aoaSlider = document.getElementById('aoaSlider');
        if (aoaSlider) {
            aoaSlider.addEventListener('input', function (e) {
                params.angleOfAttack = parseFloat(e.target.value);
                var aoaValue = document.getElementById('aoaValue');
                if (aoaValue) aoaValue.textContent = params.angleOfAttack;
                initializeSimulation();
            });
        }

        var pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', function (e) {
                params.paused = !params.paused;
                e.target.textContent = params.paused ? 'Resume' : 'Pause';
            });
        }

        var resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                initializeSimulation();
            });
        }

        var toggleMathBtn = document.getElementById('toggleMathBtn');
        if (toggleMathBtn) {
            toggleMathBtn.addEventListener('click', function (e) {
                params.showMath = !params.showMath;
                e.target.classList.toggle('active');
            });
        }

        var toggleStreamBtn = document.getElementById('toggleStreamBtn');
        if (toggleStreamBtn) {
            toggleStreamBtn.addEventListener('click', function (e) {
                params.showStreamlines = !params.showStreamlines;
                e.target.classList.toggle('active');
            });
        }

        initializeSimulation();
        animate();
    }
};
