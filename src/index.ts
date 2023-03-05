import * as kleur from "kleur"
import * as process from "node:process"

let sendError:boolean = false

class Test {
    output:any = null
    name:string = "Unnamed"
    passing:boolean = true
    finished:boolean = false
    shouldBe(expectations:any[]):Test {
        let isany = false
        for (let i = 0; i<expectations.length; i++) {
            isany = isany || (expectations[i] == this.output)
        }
        this.passing = (this.passing&&isany)
        return this
    }
    shouldNotBe(expectations:any[]):Test {
        let isany = false
        for (let i = 0; i<expectations.length; i++) {
            isany = isany || (expectations[i] != this.output)
        }
        this.passing = (this.passing&&isany)
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
            console.log(kleur.green(`${kleur.bold().blue(this.name)} passed.`))
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
                throw kleur.red("Not all tests passed.")
            } else {
                console.log(kleur.green("All tests passed."))
            }
        })
    }
}

function createTest(output:any, name:string) {
    return new Test(output, name)
}

export { createTest, Test }