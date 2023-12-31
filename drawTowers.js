function sleep(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


let stacks = [[-1,1,2,3],[-1,-1,-1,-1],[-1,-1,-1,-1]];
let max = 3;
let selected = -1;
let acting = false;
const visual = document.getElementById("stacks");
const FrameSpeed = 10;


async function makeHTML(){
    document.getElementById("main").innerHTML="";
    for(let i=0; i<stacks.length; i++){
        var canvas = document.createElement("canvas");
        canvas.width = 250;
        canvas.height = 20+(stacks[0].length+1) * 40;
        var ctx = canvas.getContext("2d");

        for(let j=0; j<stacks[0].length; j++){
            const block = stacks[i][j];
            if(block>0){
                ctx.fillRect((100-30*(block/max)),25+30*j,30+(60*(block/max)),20);
            }
        }
        ctx.fillRect(5,25+30*stacks[0].length,220,5);
        canvas.addEventListener("click", (event) => {controlClick(i)})
        document.getElementById("main").appendChild(canvas);
    }

}

document.addEventListener("click", (event) => {
    makeHTML();
});


async function controlClick(s){
    if(acting == true){
        return;
    }
    acting = true;
    if (selected ==-1){
        pickup(s);
        acting = false;
        return;
    }
    if (selected == s){
        place(s,s);
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
        place(selected, s);
        acting = false;
        return;
    }

    acting = false;
    place(selected, selected)
}

async function pickup(s){
    var n=1
    while(n>=1 && n<stacks[0].length){
        if(stacks[s][n]<0){
            n++;
        }else{
            stacks[s][n-1]=stacks[s][n];
            stacks[s][n]=-1;
            n--;
            makeHTML();
            await sleep(FrameSpeed);
        }
    }
    if(n==0){
        selected = s;
    }
}

async function place(s1, s2){
    if(s1==s2){
        var n=1
        while(n<stacks[0].length && stacks[s1][n]<0){
            await sleep(FrameSpeed);
            stacks[s1][n]=stacks[s1][n-1];
            stacks[s1][n-1]=-1
            n++;
            makeHTML();
        }
    }else if(Math.abs(s1-s2)==2){
        await sleep(2*FrameSpeed);
        stacks[1][0]=stacks[s1][0];
        stacks[s1][0]=-1
        makeHTML();
        await sleep(2*FrameSpeed);
        stacks[s2][0]=stacks[1][0];
        stacks[1][0]=-1
        makeHTML();
        place(s2,s2);
    }else{
        await sleep(2*FrameSpeed);
        stacks[s2][0]=stacks[s1][0];
        stacks[s1][0]=-1
        makeHTML();
        place(s2,s2);
    }
    selected = -1;
}