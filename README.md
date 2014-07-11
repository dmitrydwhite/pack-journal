[![Build status][travis-image]][travis-url] [![Code Climate][codeclimate-image]] [codeclimate-url] [![Dependencies][david-image]][david-url]

#Pack Journal
Pack-Journal backpacking trip journal site

##Requirements
* MongoDB
* Node

##Installation
1. Clone repository
2. `npm install`
3. `bower install`
4. Set development and test MongoDB connection strings as desired via environment config files in `server/config/env/`

##Testing
Test suite is run with `gulp test`.  Optionally, only server side or client side tests can be run with `gulp test:server` and `gulp test:app`.

##Develoment server
Development server is started with `gulp serve`

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

[codeclimate-image]: https://codeclimate.com/github/dmitrydwhite/pack-journal.png
[codeclimate-url]: https://codeclimate.com/github/dmitrydwhite/pack-journal
[david-image]: https://david-dm.org/dmitrydwhite/pack-journal.png
[david-url]: https://david-dm.org/dmitrydwhite/pack-journal
[travis-url]: http://travis-ci.org/dmitrydwhite/pack-journal
[travis-image]: https://secure.travis-ci.org/dmitrydwhite/pack-journal.png?branch=master