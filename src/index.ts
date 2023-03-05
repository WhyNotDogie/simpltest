import * as kleur from "kleur"
import * as process from "node:process"

let sendError:boolean = false
let dse:boolean = false

const tests:any = {}

class Test {
    output:any = null
    name:string = "Unnamed"
    passing:boolean = true
    finished:boolean = false

    /**
     * Fails the test if none of the objects in the array given match the output.
     * @param expectations An array of all the values the output could be.
     * @returns The test
     * @example <caption>Example usage:</caption>
     * const st = require("simpltest")
     * 
     * st.createTest(Greeter("Carl"), "Greeter")
     *     .shouldNotBe(["Hello Carl!", "Whats up, Carl?"])
     * 
     * function Greeter(name) {
     *     return [`Hello ${name}!`, `Whats up, ${name}?`][Math.floor(Math.random()*2)]
     * }
     * @since 1.0.0
     */
    shouldBe(expectations:any[]):Test {
        let isany = false
        for (let i = 0; i<expectations.length; i++) {
            isany = isany || (expectations[i] == this.output)
        }
        this.passing = (this.passing&&isany)
        return this
    }
    /**
     * Fails the test if any of the objects in the array given match the output.
     * @param expectations An array of all the values you don't want the output to be.
     * @returns The test
     * @example <caption>Example usage:</caption>
     * const st = require("simpltest")
     * 
     * st.createTest(Greeter("Carl"), "Greeter")
     *     .shouldNotBe(["I hate you Carl!", "You suck Carl!"])
     * 
     * function Greeter(name) {
     *     return [`Hello ${name}!`, `Whats up, ${name}?`][Math.floor(Math.random()*2)]
     * }
     * @since 1.0.0
     */
    shouldNotBe(expectations:any[]):Test {
        let isany = false
        for (let i = 0; i<expectations.length; i++) {
            isany = isany || (expectations[i] != this.output)
        }
        this.passing = (this.passing&&isany)
        return this
    }
    /**
     * Set the tests Name.
     * WARNING: MAY BECOME DEPRECATED!
     * Instead set the name directly when creating the test.
     * @param name The name to set the test's name to
     * @returns The test
     * @since 1.0.0
     */
    setName(name:string):Test {
        this.name = name
        return this
    }
    /**
     * Set the tests output.
     * WARNING: MAY BECOME DEPRECATED!
     * Instead set the output directly when creating the test.
     * @param output The output to set the test's output to
     * @returns The test
     * @since 1.0.0
     */
    setOutput(output:any):Test {
        this.output = output
        return this
    }
    /**
     * Finish the test and print the results to the console.
     * @returns The test
     * @since 1.0.0
     */
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
    /**
     * Runs the callback ONLY if the test is passing.
     * @param cb The callback
     * @returns The test
     * @since 1.0.0
     */
    ifPassed(cb:()=>void):Test {
        if (this.passing) {
            cb()
        }
        return this
    }
    /**
     * Runs the callback ONLY if the test is not passing.
     * @param cb The callback
     * @returns The test
     * @since 1.0.0
     */
    ifNotPassed(cb:()=>void):Test {
        if (!this.passing) {
            cb()
        }
        return this
    }
    /**
     * Abort throwing an error if not all tests pass
     * @returns The test
     * @since 1.1.0
     */
    abortError() {
        dse = true
        return this
    }
    /**
     * Create a new simpltest Test.
     * The same as running 
     * ```js
     *    createTest(output, name)
     * ```
     * @param output The data to test
     * @param name The name of the test
     * @returns The test
     * @example <caption>Example usage:</caption>
     * const st = require("simpltest")
     * 
     * const test = new st.Test(Greeter("Carl"), "Greeter")
     *     .shouldBe(["Hello Carl!", "Whats up, Carl?"])
     *
     * function Greeter(name) {
     *     return [`Hello ${name}!`, `Whats up, ${name}?`][Math.floor(Math.random()*2)]
     * }
     * @since 1.0.0
     */
    constructor(output:any, name:string) {
        if (tests[name]) {
            throw new Error(`Test ${name} already exists.`)
        }
        this.output = output
        this.name = name
        tests[name] = this
        process.on('beforeExit', ()=>{
            if (!this.finished) this.finish();
            if (sendError) {
                if (dse) {
                    console.log(kleur.red("Not all tests passed."))
                } else {
                    throw kleur.red("Not all tests passed.")
                }
            } else {
                console.log(kleur.green("All tests passed."))
            }
        })
        return this
    }
}

/**
 * Create a new simpltest Test.
 * The same as running 
 * ```js
 *     new Test(output, name)
 * ```
 * @param output The data to test
 * @param name The name of the test
 * @returns The test
 * @example <caption>Example usage:</caption>
 * const st = require("simpltest")
 * 
 * st.createTest(Greeter("Carl"), "Greeter")
 *     .shouldBe(["Hello Carl!", "Whats up, Carl?"])
 *
 * function Greeter(name) {
 *     return [`Hello ${name}!`, `Whats up, ${name}?`][Math.floor(Math.random()*2)]
 * }
 * @since 1.0.0
 */
function createTest(output:any, name:string) {
    return new Test(output, name)
}

export { createTest, Test }