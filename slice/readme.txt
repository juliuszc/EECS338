                        ***OVERVIEW***
Slice is a kango built internet extension which uses javascript
to monitor user activity. You will find all of the development files 
in slice/src/common. Everything else is part of the kango framework and 
should not be changed. The majority of the work is done in the main.js,
category.js, popup.js, and popup_utils.js. The popup itself is displayed as 
a html file called popup.html and the layout is dictated by slice.css.
The code is a little hacky at parts to deal with problems caused by the 
application being a chrome extension and not an actual internet page.

                        ***INSTALLATION***
In order to build make sure you are in the slice directory and use python
with the command

python kango.py build slice

Chrome extension will build to ~/slice/output/slice_0.1.crx, unless
the edition is changed in the manifest.json.

                        ***DEBUGGING TIPS***

In Chrome, in the Extensions view, load the extension with the
"Load unpacked extension ..." button, and specify the output/chrome directory.

See also http://stackoverflow.com/questions/3829150/google-chrome-extension-console-log-from-background-page/3830956#3830956

For info on:

    chrome.extension.getBackgroundPage().console.log('foo');
--

In Chrome, you can see logs for the background script by clicking the
"Inspect views: background.html" link in the Extensions view.

