import * as kleur from "kleur"
import * as process from "node:process"

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

        for (let i = 0; i < this.expectations.length; i++) {
            expstr += "\""+this.expectations[i]+"\""
        }

        expstr += "]"

        if (this.passing) {
            console.log(kleur.green(`${kleur.bold().blue(this.name)} passed. Expected: {${kleur.blue(expstr)}}, Got: {${kleur.yellow("\"["+this.output+"\"]")}}`))
        } else {
            console.log(kleur.red(`${kleur.bold().magenta(this.name)} failed. Expected: {${kleur.magenta(expstr)}}, Got: {${kleur.green("\"["+this.output+"\"]")}}`))
        }
        this.finished = true
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
        process.on('exit', ()=>{
            if (!this.finished) this.finish();
        })
    }
}

function createTest(output:any, name:string) {
    return new Test()
        .setName(name)
        .setOutput(output)
}

export { createTest, Test }