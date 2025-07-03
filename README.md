# Evade the Machines 

## Version of the game:
As this is a reused code, I have only cloned the latest version of the game running. Please see original code for more branches and games.

The branch to clone to reuse the code is the main branch, the gh-pages branch is only used for deployment.
The version of the novel used is the one called novel_en


## Original code:
Find more information on the original developper's GitHub: yamazi 
follow the link: https://github.com/yamizi/LLCEscapeGame


## How to reuse the code:
As this is a web app, there are several steps to follow to be able to reuse the code and have it deployed.

1) Download the full branch locally
2) On GitHub: build your repository with a main branch and a gh-pages branch & in the setting, make sure that GitHub pages is configured for your gh-pages branch
3) Download Node.js software at https://nodejs.org/en/download
4) Create a Firebase project
5) create a keys.json file (see section below)
7) Make sure you modify the project name and homepage inside the package.json file
8) rewrite all the absolute paths (easier if you do a search for ETM and then change the urls)
9) run 'npm install' then 'npm run build' and 'npm run deploy' in your command prompt while being in the client folder


## Create your keys.json file:
Go to the Google Cloud Console:
Navigate to IAM & Admin > Service Accounts.
Select your service account or create a new one.
Click "Keys" > "Add Key" > "Create new key".
Choose JSON, download the file -- this is the **base file** you will use

**Please find a template for the keys in client-scr-data- keys_template.json**
Follwowing the template, add the different fields:

To get your **Firebase** API settings:
Go to Firebase Console.
Select your project.
Click the gear icon ⚙️ > Project Settings.
Under Your Apps, find your web app config

To get a **Google Maps API key**:
Visit Google Cloud Console > APIs & Services > Credentials.
Click "Create credentials" > "API key".
Restrict the key under "API restrictions" (e.g., Maps JavaScript API).
Paste the key into the "MAP" field.


## Ressources:
Face detection from https://github.com/simplysuvi/face-emo
