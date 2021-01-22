/**
    https://gist.github.com/mortenson/044f30bea778f4e98e4e14c661aa7d9a

    This script takes a sub-directory of your repository, renames relative links
    in HTML files to point to a Github Pages subdirectory, and publishes to your
    gh-pages branch.

    Use:
        1. Download this script into the root of your project.
        2. Run npm install --save-dev fs-extra rebase gh-pages
        3. Rename "your-project" to the name of your Github project
        4. If you have more than one HTML file, add it to the "files"
        5. If your sub-directory is not "www", change "builddir"
        6. Run node ghpages.js

    You should now see that a gh-pages branch has been created/updated, and
    pushed to your remote!
*/
const ghpages = require('gh-pages');
const rebase = require('rebase');
const fs = require('fs-extra');

let reponame = 'ionic-pwa';
let builddir = 'www';

fs.removeSync(reponame);
fs.copySync(builddir, reponame);

// List all HTML files you use here.
let files = ['index.html'];
files.forEach((filename) => {
    let path = reponame + '/' + filename;
    let file = fs.readFileSync(path, 'utf8');
    let replacements = {
        '^\/(?!\/)': '/' + reponame + '/',
        '^(?!\/|http|https)': '/' + reponame + '/',
    };
    let rebased = rebase(file, {
        url: replacements,
        a: replacements,
        img: replacements,
        link: replacements,
        script: replacements
    });
    fs.writeFileSync(path, rebased);
});

ghpages.publish(reponame, function (err) {
    if (err) {
        console.log(err);
    }
});