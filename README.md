Pack-Journal backpacking trip journal site

##Deployment
Commit any changes desired to master and perform the following for a deploy to heroku:
```
//Check out a new branch 'release'
git checkout -b release

//Build for distribution
gulp build

//Add and commit distribution files.  Commit with version number
git add dist
git commit -m 'X.Y.Z'

//Push to Heroku.  Force push is required.
git push heroku release:master -f

//Verify deployment is successful
heroku open

//Tag the release and push to github
git tag -m 'X.Y.Z' -a X.Y.Z
git push --tags

//Checkout back to master and delete release branch
git checkout master
git branch -D release
```