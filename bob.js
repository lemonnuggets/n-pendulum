class Bob{
    constructor(index){
        this.a = random(-1 * HALF_PI, HALF_PI) 
        this.parentX = coords[coords.length - 1][0] 
        this.parentY = coords[coords.length - 1][1] 
        this.length = lengths[index]
        this.x = this.parentX + this.length * Math.sin(this.a) 
        this.y = this.parentY + this.length * Math.cos(this.a) 
        this.r = masses[index] 
        this.index = index + 1
        coords.push([this.x, this.y])
        this.beingSet = false
        this.a_v = 0
        this.a_a = 0
    }
    show(){
        if(this.beingSet) this.set()
        else if(mode == 1){
            if(Array.isArray(accelerations[this.index - 1])){
               this.a_a = accelerations[this.index - 1][0]
               this.a_v += this.a_a
               this.a += this.a_v
               if(this.a > TWO_PI){
                   let n = floor(this.a / TWO_PI)
                   this.a -= n * TWO_PI
               }
            }
        }
        this.parentX = coords[this.index - 1][0] 
        this.parentY = coords[this.index - 1][1] 
        this.x = this.parentX + this.length * Math.sin(this.a) 
        this.y = this.parentY + this.length * Math.cos(this.a) 
        coords[this.index] = [this.x, this.y]
        push()
        stroke(4)
        fill(0)
        line(this.parentX, this.parentY, this.x, this.y)
        ellipse(this.x, this.y, this.r)
        pop()
    }
    set(){
        let hinge= createVector(this.parentX, this.parentY)
        let reference_vector = p5.Vector.sub(createVector(this.parentX, height), hinge)
        let mouse_vector = p5.Vector.sub(createVector(mouseX, mouseY), hinge)
        let correctionFactor = 1
        if(mouseX < this.parentX){
            correctionFactor *= -1
        }
        this.a = correctionFactor * p5.Vector.angleBetween(reference_vector, mouse_vector)
        console.log(this.a)
    }
}