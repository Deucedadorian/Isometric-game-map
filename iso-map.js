const runGame = (width, height) => {
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Initialize grids:
    let tile = [];
    let hover = [];
    let cols = width;
    let rows = height;

    // Isometric variables and helper functions:
    let IsoW = 40; // cell width
    let IsoH = 20; // cell height
    let IsoX = canvas.width / 2;
    let IsoY = 20;
    function IsoToScreenX(localX, localY) {
        return IsoX + (localX - localY) * IsoW;
    }
    function IsoToScreenY(localX, localY) {
        return IsoY + (localX + localY) * IsoH;
    }
    function ScreenToIsoX(globalX, globalY) {
        return ((globalX - IsoX) / IsoW + (globalY - IsoY) / IsoH) / 2;
    }
    function ScreenToIsoY(globalX, globalY) {
        return ((globalY - IsoY) / IsoH - (globalX - IsoX) / IsoW) / 2;
    }
    // Draws an isometric tile at the given coordinates
    function DrawIsoTile(x, y, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - IsoW, y + IsoH);
        ctx.lineTo(x, y + IsoH * 2);
        ctx.lineTo(x + IsoW, y + IsoH);
        ctx.closePath();
        ctx.fill();
    }

    function drawHighlight(x, y) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = "2";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - IsoW, y + IsoH);
        ctx.lineTo(x, y + IsoH * 2);
        ctx.lineTo(x + IsoW, y + IsoH);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();
    }

    // Draw event:
    let frame = 0;
    setInterval(function() {
        frame += 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
            let rx = IsoToScreenX(x, y);
            let ry = IsoToScreenY(x, y);
            // draw tile (if any):
            if (tile[y] !== undefined && tile[y][x] !== undefined) {
                DrawIsoTile(rx, ry, "red");
            } else if (y === rows - 1 || y === 0 || x === cols - 1 || x === 0) {
                DrawIsoTile(rx, ry, "green");
            } else 
                DrawIsoTile(rx, ry, "gray");
        }
        for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
            console.log(hover)
            let rx = IsoToScreenX(x, y);
            let ry = IsoToScreenY(x, y);
            if (hover[y] !== undefined && hover[y][x] !== undefined) {
                drawHighlight(rx, ry);
            }
        }
    }, 50);

    // Click event:
    canvas.addEventListener("mousedown", function(e) {
        tile = [];
        e.preventDefault();
        // get mouse coordinates from the event:
        let mx = e.offsetX, my = e.offsetY;
        // find local coordinates from them:
        let ix = Math.floor(ScreenToIsoX(mx, my));
        let iy = Math.floor(ScreenToIsoY(mx, my));
        // if those are within the grid, change the clicked tile:
        if (ix >= 0 && iy >= 0 && ix < cols && iy < rows) {
            tile[iy] = (tile[iy] === undefined) ? [] : tile[iy];
            tile[iy][ix] = 1;
        }
    });
    canvas.addEventListener('mousemove', (e) => {
        console.log(e.clientX);
        hover = [];
        let mx = e.offsetX, my = e.offsetY;
        // find local coordinates from them:
        let ix = Math.floor(ScreenToIsoX(mx, my));
        let iy = Math.floor(ScreenToIsoY(mx, my));
        // if those are within the grid, change the clicked tile:
        if (ix >= 0 && iy >= 0 && ix < cols && iy < rows) {
            hover[iy] = (hover[iy] === undefined) ? [] : hover[iy];
            hover[iy][ix] = 1;
        }
    });
};
runGame(10, 10);