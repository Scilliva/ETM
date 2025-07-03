# Evade the Machines 

## Version of the game:
As this is a reused code, I have only cloned the latest version of the game running. Please see original code for more branches and games.

The branch to clone to reuse the code is the main branch, the gh-pages branch is only used for deployment.
The version of the novel used is the one called novel_en

## How to reuse the code:
As this is a web app, there are several steps to follow to be able to reuse the code and have it deployed.

1) Download the full branch locally
2) On GutHub: build your repository with a main branch and a gh-pages branch & in the setting, make sure that GitHub pages is configured for your gh-pages branch
3) Download Node.js software at https://nodejs.org/en/download
4) Create a Firebase project and retrieve its keys that you add into a keys.json file in client - src - data folder
5) make sure you modify the project name and homepage inside the package.json file
6) rewrite all the absolute paths (easier if you do a search for ETM and then change the urls)
7) run 'npm install' then 'npm run build' and 'npm run deploy' in your command prompt while being in the client folder

## Original code:
Find more information on the original developper's GitHub: yamazi 
follow the link: https://github.com/yamizi/LLCEscapeGame

Adv data: fakeAge-attack-level-gender.jpg


## Ressources:
Face detection from https://github.com/simplysuvi/face-emo
