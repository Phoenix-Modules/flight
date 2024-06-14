import copy from "rollup-plugin-copy";
import { defineConfig, Plugin } from "vite";
import * as fs from "fs";
import * as path from "path";
import * as fsPromises from "fs/promises";

function hasFileChanged(src, dest) {
    if (!fs.existsSync(dest)) {
        return true;
    }

    const srcStat = fs.statSync(src);
    const destStat = fs.statSync(dest);

    return srcStat.mtime > destStat.mtime;
}

function updateModuleManifestPlugin() {
    return {
        name: "update-module-manifest",
        async writeBundle() {
            const moduleVersion = process.env.MODULE_VERSION;
            const githubProject = process.env.GH_PROJECT;
            const githubTag = process.env.GH_TAG;
            const manifestContents = await fsPromises.readFile(
                "src/module.json",
                "utf-8"
            );
            
            if (moduleVersion) {
                manifestContents["version"] = moduleVersion;
            }
            const manifestJson = JSON.parse(manifestContents);

            if (githubProject) {
                const baseUrl = `https://github.com/${githubProject}/releases`;
                manifestJson["manifest"] = `${baseUrl}/latest/download/module.json`;
                if (githubTag) {
                    manifestJson[
                        "download"
                        ] = `${baseUrl}/download/${githubTag}/module.zip`;
                }
            }
            
            await fsPromises.writeFile(
                "dist/module.json",
                JSON.stringify(manifestJson, null, 4)
            );
        },
    };
}

export default defineConfig({
    build: {
        sourcemap: true,
        rollupOptions: {
            input: {
                module: "src/module.js",
            },
            output: {
                entryFileNames: "scripts/[name].js",
                format: "es",
                dir: "dist",
            },
        },
    },
    plugins: [
        copy({
            targets: [
                { src: "src/packs", dest: "dist" },
                { src: "src/styles", dest: "dist" },
                { src: "src/images", dest: "dist" },
            ],
            hook: "writeBundle",
            transform: (contents, filename) => {
                const destPath = path.join("dist", path.relative("src", filename));
                if (hasFileChanged(filename, destPath)) {
                    return contents;
                }
                return null; // Skip copying if the file has not changed
            }            
        }),
    ],
});

