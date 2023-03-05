import * as kleur from "kleur"
import * as process from "node:process"

let sendError:boolean = false

class Test {
    output:any = null
    name:string = "Unnamed"
    passing:boolean = true
    finished:boolean = false
    expectations:string[] = []
    shouldBe(expectation:any):Test {
        this.passing = !(!this.passing||expectation!=this.output)
        this.expectations.push("["+expectation+"]")
        return this
    }
    shouldNotBe(expectation:any):Test {
        this.passing = !(!this.passing||expectation==this.output)
        this.expectations.push("!["+expectation+"]")
        return this
    }
    setName(name:string):Test {
        this.name = name
        return this
    }
    setOutput(output:any):Test {
        this.output = output
        return this
    }
    finish():Test {
        let expstr = "["

        expstr += "\""+this.expectations[0]+"\""
        for (let i = 1; i < this.expectations.length; i++) {
            expstr += ", and \""+this.expectations[i]+"\""
        }

        expstr += "]"

        if (this.passing) {
            console.log(kleur.green(`${kleur.bold().blue(this.name)} passed. Expected: {${kleur.blue(expstr)}}, Got: {${kleur.yellow("\"["+this.output+"\"]")}}`))
        } else {
            console.log(kleur.red(`${kleur.bold().magenta(this.name)} failed. Expected: {${kleur.magenta(expstr)}}, Got: {${kleur.green("\"["+this.output+"\"]")}}`))
        }
        this.finished = true
        if (!this.passing) {
            sendError = true
        }
        return this
    }
    ifPassed(cb:()=>void):Test|void {
        if (this.passing) {
            cb()
        } else {
            return this
        }
    }
    ifNotPassed(cb:()=>void):Test|void {
        if (!this.passing) {
            cb()
        } else {
            return this
        }
    }
    constructor(){
        process.on('beforeExit', ()=>{
            if (!this.finished) this.finish();
            if (sendError) {
                throw "Not all tests passed."
            } else {
                console.log("All tests passed.")
            }
        })
    }
}

function createTest(output:any, name:string) {
    return new Test()
        .setName(name)
        .setOutput(output)
}

export { createTest, Test }