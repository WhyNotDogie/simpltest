import * as kleur from "kleur"
import * as process from "node:process"

let sendError:boolean = false

class Test {
    output:any = null
    name:string = "Unnamed"
    passing:boolean = true
    finished:boolean = false
    shouldBe(expectations:any[]):Test {
        for (let i = 1; i<expectations.length; i++) {
            this.passing = !(!this.passing||expectations!=this.output)
        }
        return this
    }
    shouldNotBe(expectations:any[]):Test {
        for (let i = 1; i<expectations.length; i++) {
            this.passing = !(!this.passing||expectations==this.output)
        }
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
        if (this.passing) {
            console.log(kleur.green(`${kleur.bold().blue(this.name)} passed. Got: {${kleur.yellow("\"["+this.output+"\"]")}}`))
        } else {
            console.log(kleur.red(`${kleur.bold().magenta(this.name)} failed. Got: {${kleur.green("\"["+this.output+"\"]")}}`))
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
    constructor(output:any, name:string)
    {   
        this.output = output
        this.name = name
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
    return new Test(output, name)
}

export { createTest, Test }