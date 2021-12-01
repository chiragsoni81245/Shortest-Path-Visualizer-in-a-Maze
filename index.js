main_div = document.getElementById("main")

class Node{
    constructor(data){
        this.data = data
        this.next = null
    }
}

class Queue {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    isEmpty() {
        return this.size === 0;
    }
    display(){
        let temp = this.head;
        let result = []
        while(temp){
            result.push(temp.data);
            temp = temp.next;
        }
        return result
    }
    enqueue(data){
        let newNode = new Node(data);
        if(this.size==0){
            this.head = newNode;
            this.tail = newNode;
        }else{
            this.tail.next = new Node(data);
            this.tail = this.tail.next;
        }
        this.size += 1;
    }
    dequeue(){
        if(!this.isEmpty()){
            let temp = this.head;
            if(this.size==1){
                this.head = null;
                this.tail = null;
            }else{
                this.head = this.head.next;
            }
            this.size -= 1;
            return temp.data;
        }
    }
}

function randomColorHexGenerator(){
    let colorCode = Math.floor(Math.random()*16777215).toString(16);
    return `#${colorCode}`
}

function sleep(delay){
    console.log(`waiting for ${delay}`);
    return new Promise((resolve) => setTimeout(resolve, delay))
}

class Grid{
    constructor(container, sizeX, sizeY){
        this.container = container;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.blocks = []
        this.colorPalette = []
        this.colorPaletteGenerator()
        container.classList.remove("d-none");
        // container.style["border"] = "5px solid black";
        container.innerHTML = "";
        let block_size = {
            width: Math.floor(this.container.clientWidth/sizeX),
            height: Math.floor(this.container.clientHeight/sizeY)
        }

        for(let i=0; i<sizeX*sizeY; i++){
            let block = `<div style="width: ${block_size.width}px;height: ${block_size.height}px; background-color: white;"></div>`;
            let tempElement = document.createElement("template");
            tempElement.innerHTML = block.trim();
            block = tempElement.content.firstChild;
            container.append(block);
            this.blocks.push(block);
        }
    }

    colorPaletteGenerator(){
        let usedColors = new Set;
        while(this.colorPalette.length<=this.sizeX*this.sizeY){
            let color = randomColorHexGenerator();
            if(!usedColors.has(color) && color!="#ffffff"){
                this.colorPalette.push(color);
            }
        }
    }

    generateMaze(percentage){
        let noOfMazeBlocks = Math.floor((this.blocks.length*percentage)/100)
        let blockIndexs = []
        for(let i=0; i<this.blocks.length; i++){
            blockIndexs.push(i);
        }

        for(let i=0; i<noOfMazeBlocks; i++){
            let randomIndex = Math.floor((Math.random() * (blockIndexs.length-1)) + 0);
            this.blocks[blockIndexs[randomIndex]].style["backgroundColor"] = "black";
            blockIndexs.splice(randomIndex, 1)
        }
    }

    cordinateToBlock(x,y){
        return (Math.max((y-1),0)*this.sizeX+x)-1;
    }

    blockToCordinate(blockNo){
        blockNo += 1;
        let y = Math.ceil(blockNo/this.sizeX);
        let x = blockNo-((y-1)*this.sizeX);
        return {x: x, y: y} 
    }

    findChilds(currentCordinates){
        let childs = []
        if(this.sizeX!=1){
            if(currentCordinates.x>1 && currentCordinates.x<this.sizeX){
                childs.push({x: currentCordinates.x+1, y: currentCordinates.y})
                childs.push({x: currentCordinates.x-1, y: currentCordinates.y})
            }else{
                childs.push({x: currentCordinates.x==1 ? currentCordinates.x+1 : currentCordinates.x-1, y: currentCordinates.y})
            }
        }

        if(this.sizeY!=1){
            if(currentCordinates.y>1 && currentCordinates.y<this.sizeY){
                childs.push({x: currentCordinates.x, y: currentCordinates.y+1})
                childs.push({x: currentCordinates.x, y: currentCordinates.y-1})
            }else{
                childs.push({x: currentCordinates.x, y: currentCordinates.y==1 ? currentCordinates.y+1 : currentCordinates.y-1})
            }
        }

        return childs;
    }

    async ItrativeBFS(){
        var operations = [];
        let visited = new Array(this.blocks.length).fill(0);
        let currentColorIndex = 0;
        for(let i=0; i<this.blocks.length; i++){
            if(visited[i]==1){continue}
            currentColorIndex += 1
            let queue = new Queue;
            queue.enqueue(i);
            while(queue.size){
                let current = queue.dequeue();
                let currentCordinates = this.blockToCordinate(current);
                if(visited[current]==1){continue};
                visited[current] = 1;
                if(this.blocks[current].style["background-color"]=="black"){continue}
                
                operations.push({element: this.blocks[current], 
                    color: this.colorPalette[currentColorIndex]
                })

                let childs = this.findChilds(currentCordinates);
                childs.forEach(child=>{
                    let blockNo = this.cordinateToBlock(child.x, child.y)
                    if(!visited[blockNo]){
                        queue.enqueue(blockNo);
                    }
                })
            }
        }
        console.log("Completed Pre Processing!")
        // console.log(operations.length)
        operations.forEach((obj,index)=>{
            setTimeout(function(obj){
                obj.element.style["background-color"] = obj.color;
            }, (index+1)*50, obj);
        })
    }
}



// Controller Events Handlers
function findNextDivisors(current, n){
    if(current==n){return n};
    if(current<=Math.floor(Math.sqrt(n))){
        for(var i=current+1; i<=Math.floor(Math.sqrt(n)); i++){
            if(n%i==0){
                return i;
            }
        }
    }
    let paired_divisors = [];
    for(var i=1; i<=Math.floor(Math.sqrt(n)); i++){
        if(n%i==0){
            paired_divisors.push(Math.floor(n/i));
        }
    }
    for(var i=paired_divisors.length-1; i>=0; i--){
        if(paired_divisors[i]>current){
            return paired_divisors[i];
        }
    }
    
}
function findPreviousDivisors(current, n){
    for(var i=current-1; i>=1; i--){
        if(n%i==0){
            return i;
        }
    }
}

$(document).on('click', ".plus", function(){
    let container = document.getElementById("main");
    let element = $(this).parent().parent().find("input")[0];
    if(element.id=="sizeX"){
        element.value = findNextDivisors(Number(element.value), container.clientWidth) || 1;
    }else{
        element.value = findNextDivisors(Number(element.value), container.clientHeight) || 1;
    }
})
$(document).on('click', ".minus", function(){
    let container = document.getElementById("main");
    let element = $(this).parent().parent().find("input")[0];
    if(element.id=="sizeX"){
        element.value = findPreviousDivisors(Number(element.value), container.clientWidth) || 1;
    }else{
        element.value = findPreviousDivisors(Number(element.value), container.clientHeight) || 1;
    }
})
$(document).on("click", "#generate_maze", function(){
    $("#bfs").addClass("d-none")
    let sizeX = Number(document.getElementById("sizeX").value);
    let sizeY = Number(document.getElementById("sizeY").value);
    let blocking_percentage_element = document.getElementById("blocking_percentage");
    let blocking_percentage = document.getElementById("blocking_percentage").value;
    if(!(blocking_percentage>=0 && blocking_percentage<=100)){
        blocking_percentage_element.value = 0;
    }
    window.grid = new Grid(document.getElementById("main"), sizeX, sizeY)
    window.grid.generateMaze(blocking_percentage);
    console.log("Maze Generated!");
    $("#bfs").removeClass("d-none")
})
$(document).on("click", "#bfs", function(){
    window.grid.ItrativeBFS();
})
// End



