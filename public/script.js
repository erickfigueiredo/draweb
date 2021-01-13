document.addEventListener('DOMContentLoaded', _=>{

    const socket = io.connect();

    const pen = {
        active: false,
        moving: false,
        pos: {
            x: 0,
            y: 0
        },
        posBefore: null
    }

    const screen = document.querySelector('#screen');
    const context = screen.getContext('2d'); // Objeto que permite o desenho na tela

    // Propriedades da tela
    screen.width = 700;
    screen.height = 500;

    context.lineWidth = 2; // Espessura da linha
    context.strokeStyle = 'purple'; // Cor da linha



    const drawLine = line =>{
        context.beginPath();
        context.moveTo(line.posBefore.x, line.posBefore.y);
        context.lineTo(line.pos.x, line.pos.y);
        context.stroke();
    }

    screen.onmousedown = e => {
        pen.active = true;
    }

    screen.onmouseup = e => {
        pen.active = false;
    }

    screen.onmousemove = e => {
        pen.pos.x = e.clientX; // Posição x do mouse
        pen.pos.y = e.clientY; //Posição y do mouse
        pen.moving = true;
    }

    socket.on('draw', (line) => {
        drawLine(line);
    });

    document.body.addEventListener('keyup', e => {
        if (e.keyCode === 32) {
            window.location.reload();
            socket.emit('clear');
        }
    });

    const cicle = _ => {
        if(pen.active && pen.moving && pen.posBefore) {

            socket.emit('draw', {pos: pen.pos, posBefore: pen.posBefore});
            
            /*
            drawLine({
                pos: pen.pos,
                posBefore: pen.posBefore
            });
            */
            
            pen.moving = false;
        }

        // Por padrão os objetos são passados como referência no JS
        // 
        pen.posBefore = {... pen.pos}; // Operador spread

        setTimeout(cicle, 10);
    }

    cicle();


});