function sleep(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


let stacks = [[-1,1,2,3,4,5],[-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1]];
let max = 5;
let selected = -1;
let acting = false;
let sleepTime = 100;
const visual = document.getElementById("stacks");
var FrameSpeed;

// draws all of the towers
async function makeHTML(){
    document.getElementById("main").innerHTML="";
    for(let i=0; i<stacks.length; i++){
        var canvas = document.createElement("canvas");
        canvas.id = "stack "+i;
        canvas.width = 250;
        canvas.height = 20+(stacks[0].length+1) * 40;
        var ctx = canvas.getContext("2d");

        for(let j=0; j<stacks[0].length; j++){
            const block = stacks[i][j];
            if(block>0){
                ctx.fillRect((110-60*(block/max)),25+30*j,10+(120*(block/max)),20);
            }
        }
        ctx.fillRect(5,25+30*stacks[0].length,220,5);
        canvas.addEventListener("click", (event) => {controlClick(i)})
        document.getElementById("main").appendChild(canvas);
    }
    var button = document.createElement("button");
    button.type = "button";
    button.innerText = "simulate";
    button.addEventListener("click", (event) => {simulate()})
    document.getElementById("main").appendChild(button);


}

// re-draws the nth tower out of 3.
function redrawTower(n){
    var canvas = document.getElementById("stack "+(n));
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("drawing towers");
    for(let j=0; j<stacks[0].length; j++){
        const block = stacks[n][j];
        if(block>0){
            ctx.fillRect((110-60*(block/max)),25+30*j,10+(120*(block/max)),20);
        }
    }

    ctx.fillRect(5,25+30*stacks[0].length,220,5);
}

async function setup() {
    max = parseInt(document.getElementById("num").value);
    stacks = [];
    stacks[0]=[];
    stacks[1]=[];
    stacks[2]=[];

    stacks[0][0]=-1;
    stacks[1][0]=-1;
    stacks[2][0]=-1;

    for(var i=1; i<=max;i++){
        stacks[0][i] = i
        stacks[1][i] = -1
        stacks[2][i] = -1
    }
    makeHTML();
    FrameSpeed = 50/max;
}


async function controlClick(s){
    if(acting == true){
        return;
    }
    acting = true;
    if (selected ==-1){
        await pickup(s);
        acting = false;
        return;
    }
    if (selected == s){
        await place(s,s);
        acting = false;
        return;
    }

    let top = -1;
    for (let i=0; i<stacks[0].length; i++){
        if(stacks[s][i]>0){
            top = stacks[s][i];
            break;
        }
    }

    if(top==-1 || top>stacks[selected][0]){
        await place(selected, s);
        acting = false;
        return;
    }

    await place(selected, selected);
    acting = false;
}

async function pickup(s){
    var n=1
    while(n>=1 && n<stacks[0].length){
        if(stacks[s][n]<0){
            n++;
        }else{
            stacks[s][0]=stacks[s][n];
            stacks[s][n]=-1;
            console.log("picking up "+s+","+n);
            redrawTower(s);
            break;
            //await sleep(FrameSpeed);
        }
    }
    if(n!=stacks[0].length){
        selected = s;
    }
}

async function place(s1, s2){
    var n=1
    while(n<stacks[0].length && stacks[s2][n]<0){
        //await sleep(FrameSpeed);
        n++;
        makeHTML();
    }
    stacks[s2][n-1]=stacks[s1][0];
    stacks[s1][0]=-1
    await redrawTower(s1);
    await redrawTower(s2);

    selected = -1;
}


async function simulate(){
    
    stacks[0][0]=-1;
    stacks[1][0]=-1;
    stacks[2][0]=-1;

    for(var i=1; i<=max;i++){
        stacks[0][i] = i
        stacks[1][i] = -1
        stacks[2][i] = -1
    }
    makeHTML();
    acting = true;
    await solveTower(max,(x)=>x);
    acting = false;
    sleepTime = 100;
    FrameSpeed = 50/(stacks[0]-1);
}

async function solveTower(n,f){
    if(n==1){
        await sleep (sleepTime)
        await pickup(f(0));
        await sleep (sleepTime);
        await place(f(0),f(2));
        await sleep (sleepTime);
    }else{
        await solveTower(n-1,(x)=>f(swap1(x)));
        sleepTime/=1.5;
        FrameSpeed/=1.5;
        await sleep (sleepTime);
        await pickup(f(0));
        await sleep (sleepTime);
        await place(f(0),f(2));
        await sleep (sleepTime);
        await solveTower(n-1,(x)=>f(swap2(x)));

        sleepTime/=1.1;
        FrameSpeed/=1.1;
        //await sleep (sleepTime);
    }
}

function swap1(a){
    if(a == 0){
        return 0;
    }if(a == 1){
        return 2;
    }if(a == 2){
        return 1;
    }
}

function swap2(a){
    if(a == 0){
        return 1;
    }if(a == 1){
        return 0;
    }if(a == 2){
        return 2;
    }
}