import FileSystem from 'fs';

interface Data {
    name: string;
    description: string;
    version: string;
    author: string;

}

let packageJson = {
    name: "",
    description: "",
    version: "",
    author: "Cirrus-8691",
};

export const PackageJson = () : Data => {
    if(packageJson.name==="") {
        packageJson = JSON.parse( 
            FileSystem.readFileSync("./package.json", "utf8") );
    }
    return packageJson;
}


