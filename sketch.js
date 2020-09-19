const g = 0.8
let accelerations = []
let n = 2 
let masses = [] 
let lengths = []
let coords = []
let mode = 1
let bobs = []
let currentlySetting = -1
let trail = []
function setup() {
    createCanvas(windowWidth, windowHeight);    
    coords = [[width / 2, height / 2]]
    initializeSystem()
}
function initializeSystem(){
    masses = []
    lengths = []
    bobs = []
    for(let i = 0; i < n; i++){
        masses.push(10)
        lengths.push(50)
        bobs.push(new Bob(i))
    }
}
function indexOfBobAt(x, y){
    for(let i = 0; i < bobs.length; i++){
        let distance = dist(bobs[i].x, bobs[i].y, mouseX, mouseY)
        if(distance < bobs[i].r) return i
    }
    return -1
}
function switchMode(){
    mode *= -1
    bobs.forEach(bob => {
        bob.a_v = 0            
    });
}
function mousePressed() {
    if(mouseButton == CENTER) switchMode()
}
function keyPressed(){
    if(key == 's' || key == 'S') switchMode()
    else if(mode == -1 && key > '0' && key <= '9'){
        n = Number(key)
        initializeSystem()
    }
}
function mouseReleased() {
    if(currentlySetting != -1) bobs[currentlySetting].beingSet = false
    currentlySetting = -1    
}
function phi(i, q){
    if(q != i) return Math.cos(bobs[i].a - bobs[q].a)
    else return 1
}
function draw() {
    background(255)
    if(mouseIsPressed && mode == -1 && currentlySetting == -1){
        currentlySetting = indexOfBobAt(mouseX, mouseY)
        if(currentlySetting != -1){
            bobs[currentlySetting].beingSet = true
        }
    }
    if(mode == 1){
        let results = []    
        let matrix = []
        for(let q = 0; q < n; q++){
            let term1 = 0
            let term2 = 0
            let term3 = 0
            for(let k = q; k < n; k++){
                term1 = g * lengths[q] * Math.sin(bobs[q].a) * masses[k]
                for(let i = 0; i <= k; i++){
                    term2 += masses[k] * lengths[i] * lengths[q] * bobs[i].a_v *  bobs[q].a_v * Math.sin(bobs[q].a - bobs[i].a)
                    term3 += masses[k] * lengths[i] * lengths[q] * bobs[i].a_v *  bobs[q].a_v * Math.sin(bobs[i].a - bobs[q].a) * (bobs[q].a_v - bobs[i].a_v)
                }
            }
            results.push([term1 + term2 + term3])
            let row_q = []
            for(let k = q; k < n; k++){
                for(let i = 0; i <= k; i++){
                    if(row_q[i] == undefined){
                        row_q.push(masses[k] * lengths[i] * lengths[q] * phi(i, q))
                    } else {
                        row_q[i] += masses[k] * lengths[i] * lengths[q] * phi(i, q)
                    }
                }
            }
            matrix.push(row_q)
        }
        if(math.det(matrix)){
           let inverse_matrix = math.inv(matrix)
           accelerations = math.multiply(inverse_matrix, results)
           accelerations = math.multiply(-1, accelerations)
        }
    }
    for(let i = 0; i < bobs.length; i++){
        bobs[i].show()
    }
    trail.push([bobs[bobs.length - 1].x, bobs[bobs.length - 1].y])
    if(trail.length > 500) trail.shift()
    beginShape()
    noFill()
    trail.forEach(coord => {
       vertex(coord[0], coord[1]) 
    });
    endShape()
}
