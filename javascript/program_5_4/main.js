let steps = [];
let function_points = [];

let x_min_query = Number(document.getElementById("x_min").value);
let x_min = Math.floor(x_min_query - 1);

let x_max_query = Number(document.getElementById("x_max").value);
let x_max = Math.ceil(x_max_query + 1);


let tolerance = Number(document.getElementById("tolerance").value);
let maximum_iterations = Number(document.getElementById("maximum_iterations").value);

let diff = x_max - x_min;
let unit = 500 / diff;

let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
ctx.translate(250, 250);

let interval = null;


const func1 = x => Math.pow(x, 2) - 4;
const func2 = x => -Math.pow(x, 2) + 4 * x + 5;
const func3 = x => Math.pow(x, 3) - 3 * Math.pow(x, 2) - 9 * x - 10;
const func4 = x => Math.pow(x, 2) - 2 * x + 3;
const func5 = x => 2 * Math.pow(x, 3) - 10 * Math.pow(x, 2) + 11 * x - 5;
const func6 = x => Math.exp(-x) - x;
const func7 = x => x - Math.exp(1 / x);

const init = _ => {

    steps = [];
    function_points = [];

    x_min_query = Number(document.getElementById("x_min").value);
    x_min = Math.floor(x_min_query - 1);

    x_max_query = Number(document.getElementById("x_max").value);
    x_max = Math.ceil(x_max_query + 1);


    tolerance = Number(document.getElementById("tolerance").value);
    maximum_iterations = Number(document.getElementById("maximum_iterations").value);

    diff = x_max - x_min;
    unit = 500 / diff;

};

const redrawAxis = () => {
    ctx.beginPath();
    ctx.moveTo(-250, 0);
    ctx.lineTo(250, 0);
    ctx.moveTo(0, -250);
    ctx.lineTo(0, 250);
    ctx.closePath();
    ctx.stroke();

    for (let i = -14; i < 15; i++) {
        ctx.fillRect(-3, i * 16.6, 6, 1);
        if (i === 0) continue;
        ctx.fillText((i * -1), 10, i * 16.6);
    }

    for (let i = x_min; i < x_max + 1; i++) {
        ctx.fillRect(i * unit, -3, 1, 6);
        if (i === 0) continue;
        ctx.fillText(i, i * unit, 15);
    }
};

const drawFunctionLine = () => {
    for (let i = 0; i < function_points.length - 1; i++) {
        ctx.moveTo(function_points[i][0] * unit, function_points[i][1] * -16.6);
        ctx.lineTo(function_points[i + 1][0] * unit, function_points[i + 1][1] * -16.6);
        ctx.lineWidth = 0.1;
        ctx.stroke();
    }
};

const drawSteps = async _ => {

    let counter = 0;

    interval = setInterval(() => {

        redrawAll();

        ctx.moveTo(steps[counter].p1[0] * unit, steps[counter].p1[1] * -16.6);
        ctx.lineTo(steps[counter].p2[0] * unit, steps[counter].p2[1] * -16.6);

        ctx.lineWidth = 1;
        ctx.stroke();

        counter++;

        if (counter >= steps.length) clearInterval(interval);

    }, 200);
};


const redrawAll = _ => {
    ctx = c.getContext("2d");
    ctx.clearRect(-250, -250, c.width, c.height);
    redrawAxis();
    drawFunctionLine();
};

const setFunctionLine = func => {
    for (let i = x_min * 100; i < x_max * 100; i++) {
        function_points.push([i / 100, func(i / 100)]);
    }

};

const secantMethod = func => {
    let x_min_local = x_min_query;
    let x_max_local = x_max_query;

    let func_of_x_min_local = func(x_min_local);
    let func_of_x_max_local = func(x_max_local);

    if (func_of_x_min_local * func_of_x_max_local >= 0) {
        alert("Secant method fails.");
        return null
    }

    steps = [{
        p1: [x_min_local, func_of_x_min_local],
        p2: [x_max_local, func_of_x_max_local]
    }];


    for (let iteration = 0; iteration < maximum_iterations; iteration++) {
        let p = x_min_local - func(x_min_local) * (x_max_local - x_min_local) / (func(x_max_local) - func(x_min_local));
        let func_p = func(p);

        if (func(p) === 0 || Math.abs(func(p)) < tolerance) {
            // alert("Found exact solution.");
            break;
        } else if (func(x_min_local) * func_p < 0) {
            x_max_local = p;
            steps.push({
                p1: [x_min_local, func(x_min_local)],
                p2: [x_max_local, func(x_max_local)]
            });
        } else if (func(x_max_local) * func_p < 0) {
            x_min_local = p;
            steps.push({
                p1: [x_min_local, func(x_min_local)],
                p2: [x_max_local, func(x_max_local)]
            });
        } else {
            alert("Secant method fails.");
            break;
        }
    }
    console.log(steps)
};

const fetchData = (func) => {
    init();
    ctx.clearRect(-250, -250, c.width, c.height);

    clearInterval(interval);

    const fn = eval("func" + func);
    setFunctionLine(fn);
    redrawAxis();
    drawFunctionLine();

    secantMethod(fn);
    drawSteps()
};

fetchData(1);

