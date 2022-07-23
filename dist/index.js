"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const fs_1 = require("fs");
const inputName = (0, core_1.getInput)("name");
const token = (0, core_1.getInput)("token");
write2file();
greet(inputName, getRepoUrl(github_1.context));
commit(github_1.context);
function greet(name, repoUrl) {
    console.log(`'Hello ${name}. You are running in ${repoUrl}'`);
}
function getRepoUrl({ repo, serverUrl }) {
    return `${serverUrl}/${repo.owner}/${repo.repo}`;
}
// const targetPath = "./output/test.txt";
// const targetDir = "./output";
function main() { }
function write2file() {
    const targetPath = "./output/test.txt";
    const targetDir = "./output";
    console.log("====== write2file() called. ======");
    (0, fs_1.mkdirSync)(targetDir);
    (0, fs_1.writeFileSync)(targetPath, "test-commit");
    const files = (0, fs_1.readdirSync)(targetDir);
    files.forEach((file) => {
        console.log(file);
    });
    // writeFileSync("./output/test.txt", "test-commit", function (err) {
    //   console.log("====== write2file() finished. ======");
    //   console.log("====== write2file() callback start. ======");
    //   if (err) {
    //     throw err;
    //   }
    //   readdir(targetDir, (err, files) => {
    //     files.forEach((file) => {
    //       console.log(file);
    //     });
    //   });
    //   console.log("====== write2file() callback finished. ======");
    // });
}
async function commit(context) {
    const targetPath = "output/test.txt";
    // const targetDir = "./output";
    console.log("====== commit() called. ======");
    if (token) {
        console.log("token exists.");
        const octokit = (0, github_1.getOctokit)(token);
        // Get current base branch
        const mainBranchRef = await octokit.rest.git.getRef({
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: `heads/main`,
        });
        console.log("====== mainBranchRef ======");
        console.log(mainBranchRef);
        const currentCommit = await octokit.rest.git.getCommit({
            owner: context.repo.owner,
            repo: context.repo.repo,
            commit_sha: mainBranchRef.data.object.sha,
        });
        console.log("====== currentCommit ======");
        console.log(currentCommit);
        const files = (0, fs_1.readdirSync)("./output/");
        files.forEach((file) => {
            console.log(file);
        });
        console.log("====== start createTree() ======");
        const newTree = await octokit.rest.git.createTree({
            owner: context.repo.owner,
            repo: context.repo.repo,
            base_tree: currentCommit.data.tree.sha,
            tree: [
                {
                    type: "blob",
                    path: targetPath,
                    mode: "100644",
                    content: "test content",
                },
            ],
        });
        console.log("====== newTree ======");
        console.log(newTree);
        const newCommit = await octokit.rest.git.createCommit({
            owner: context.repo.owner,
            repo: context.repo.repo,
            message: "Commit message",
            tree: newTree.data.sha,
            author: {
                name: "github-action-js-example[bot]",
                email: "github-action-js-example[bot]@users.noreply.github.com",
            },
            parents: [currentCommit.data.sha],
        });
        console.log("====== commit() end. ======");
        await octokit.rest.git.updateRef({
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: `heads/main`,
            sha: newCommit.data.sha,
        });
    }
}
