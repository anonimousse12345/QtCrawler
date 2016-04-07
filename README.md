# QtCrawler
Script to automatically visit female profiles on interpals

## Release information

Beta version for testing. Currently only tested in Chrome. 

## Usage

1. Download tampermonkey and install as userscript.
2. Login to interpals
3. go to "Online"
4. set your filters
5. scroll down and click on "View all on one page"
6. click on "view all profiles"

## known issues

As of the 06. April. 2016, interpals seem to have started to throttle high amounts of requests. I have been told by several users, that the script stops working after a little less than 500 profiles at the moment. Everything coming after those profiles won't be called anymore and results in a server error "500".

Version 0.2.2 implements a quick-fix, which will register a profile as visited only if no error occurs. So, you can manually restart the script everytime it stops working. 

I'm working to find a solution
