chrome.runtime.onInstalled.addListener(function () {

    var PupupName = 'thank-you.html';
    var popupURL = chrome.runtime.getURL(PupupName);

    chrome.tabs.create({ url: popupURL });
});
