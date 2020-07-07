const g = 1
let accelerations = []
let n = 2 
let masses = [] 
let lengths = []
let coords = []
let mode = 1
let bobs = []
let currentlySetting = -1
function setup() {
    createCanvas(windowWidth, windowHeight);    
    coords = [[width / 2, height / 2]]
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
function mousePressed() {
    if(mouseButton == CENTER) mode *= -1
}
function mouseReleased() {
    print(currentlySetting)
    if(currentlySetting != -1) bobs[currentlySetting].beingSet = false
    currentlySetting = -1    
}
function phi(q, i){
    if(q != i) return Math.cos(bobs[q].a - bobs[i].a)
    else return 1
}
function a(q, i){
    console.log(`a(${q}, ${i}) = `,lengths[q] * lengths[i] * phi(q, i))
    return lengths[q] * lengths[i] * phi(q, i)
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
            let term1 = g * lengths[q] * Math.sin(bobs[q].a)
            let sigma_mk = 0
            let second_sigma = 0
            for(let k = q; k < n; k++){
                sigma_mk += masses[k]
                for(let i = 0; i <= k; i++){
                    second_sigma += lengths[i] * bobs[i].a_v * bobs[q].a_v * Math.sin(bobs[q].a - bobs[i].a) * (bobs[i].a_v - bobs[q].a_v + 1)
                }
            }
            term1 *= sigma_mk
            let term2 = lengths[q] * sigma_mk * second_sigma
            results.push([term1 + term2])
            let row_q = []
            for(let k = q; k < n; k++){
                for(let i = 0; i <= k; i++){
                    if(row_q[i] == undefined){
                        row_q.push(a(q, i) * sigma_mk)
                    } else {
                        row_q[i] += a(q, i) * sigma_mk
                    }
                    console.log(row_q, a(q, i))
                }
            }
            matrix.push(row_q)
        }
        console.log('results = ', results)
        console.log('matrix = ', matrix)
        if(math.det(matrix)){
           let inverse_matrix = math.inv(matrix)
           accelerations = math.multiply(inverse_matrix, results)
           accelerations = math.multiply(-1, accelerations)
           console.log(accelerations)
        }
    }
    for(let i = 0; i < bobs.length; i++){
        bobs[i].show()
    }
}