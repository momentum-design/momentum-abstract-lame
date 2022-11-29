const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

class Mp3Convert {

    regFileFilter = /\.wav$/i;
    regArgs = /^([^\=]+)\=([^\=]+)$/;
    files;

    constructor() {
        this.options = Object.assign({
            input: './input',
            output:'./output'
        }, this.getProcessArgs());
        this.options.input = path.join(__dirname, this.options.input);
        this.options.output = path.join(__dirname, this.options.output);
    }

    getFiles(list, root='') {
        list.forEach((p)=>{
            const filePath = path.join(root, p);
            if(fs.existsSync(filePath)) {
                const stat = fs.lstatSync(filePath);
                if(stat.isDirectory()) {
                    this.getFiles(fs.readdirSync(filePath), filePath);
                } else if(stat.isFile() && this.regFileFilter.test(filePath)) {
                    this.files[path.relative(__dirname, filePath)]=path.relative(__dirname, this.getOutput(filePath));
                }
            }
        });
    }

    getOutput(filePath) {
        let p = path.relative(this.options.input, filePath);
        let folders = path.dirname(p).split(path.sep);
        folders.push(path.basename(p));
        folders = folders.map((name)=>{
            return name.replace(/\s|\_/g, '-').replace(/(?<!^|-)([A-Z])/g, "-$1").toLowerCase().replace(this.regFileFilter, '.mp3');
        });
        p = folders.join(path.sep);
        let output = path.join(this.options.output, p);
        let outBase = path.dirname(output);
        if (!fs.existsSync(outBase)){
            fs.mkdirSync(outBase, {recursive: true});
        }
        return output;
    }

    getProcessArgs = ()=> {
        const args = process.argv.slice(2);
        const ret = {};
        args.forEach((str)=>{
            const result = str.match(this.regArgs);
            if(result && typeof result.length === 'number' && result.length===3) {
                ret[result[1]] = result[2];
            }
        });
        return ret;
    }

    exec = (input, output)=> {
        return new Promise((resolve, reject)=>{
            console.log(`=======lame -b320 ${input}  ${output}`);
            exec(`lame -b128 ${input} ${output}`, (err, stdout, stderr) => {
                resolve(1);
            });
        });
    }

    convert() {
        return new Promise((resolve)=>{
            this.files= {};
            this.getFiles(fs.readdirSync(this.options.input), this.options.input);
            let keys = Object.keys(this.files);
            let todo= keys.length;
            let callback = ()=>{
                todo--;
                if(todo<=0) {
                    resolve(1);
                }
            };
            keys.forEach((k)=>{
                this.exec(k, this.files[k])
                .finally(()=>{
                    callback();
                });
            });
        });

    }

}

async function run() {
    await new Mp3Convert().convert();
}
run();