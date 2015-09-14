const cActionEdit 			= 0;
const cActionSave 			= 1;
const cActionClipboard 		= 2;
const cActionEMail 			= 3;
const cActionPaint 			= 4;
const cActionUpload 		= 5;
const cActionPrint 	 		= 7;
//noinspection JSUnusedGlobalSymbols
const cBASE64Content 		= 8;
const cActionSavePDF		= 10;
const cActionSendOneNote	= 11;
const cActionMultiPDF       = 12;
const cActionSilentAdd      = 13;
const cActionUpgrade		= 100;

const cModeVisible 	= 0;
const cModeEntire  	= 1;
const cModeSelected = 2;
const cModeBrowser 	= 3;
const cModeTabs     = 4;
const cModePC     = 5;
const cModeMobile     = 6;

const cLastActionPref 				= "lastAction";
const cLastModePref 				= "lastMode";
const cShortcutPref					= "hotkey";
const cShortcutPrefVisible			= "hotkeyVisible";
const cShortcutPrefSelection		= "hotkeySelection";
const cShortcutPrefEntire			= "hotkeyEntire";
const cShortcutPrefBrowser			= "hotkeyBrowser";
const cDebugPref					= "fsDebug";

const cShortcutPrefVisibleAction	= "hotkeyVisibleAction";
const cShortcutPrefSelectionAction	= "hotkeySelectionAction";
const cShortcutPrefEntireAction		= "hotkeyEntireAction";
const cShortcutPrefBrowserAction	= "hotkeyBrowserAction";

const cPluginProModePref			= "pluginProMode";
const cRegisteredPref				= "registeredMode";
const cFirstTimeRun 				= "firstTimeRunFlag";
const cCurrentVersion 				= "curVersion";
const cTemplatePref					= "filenameTemplate";
const cTemplateNumberPref			= "filenameNumber";
const cTemplateNumberPadCheckPref	= "filenameNumberPadCheck";
const cTemplateNumberPadValuePref	= "filenameNumberPadValue";
const cTemplateFilenameMaxLen		= "filenameMaxLen";
const cDefaultImageFormatPref		= "jpg";
const cQueuedBadgeURLPref			= "queuedBadgeURL";

const cDefaultShortcut 			= getOSFriendlyShortcut("Ctrl+Alt+Shift+Z");
const cDefaultShortcutVisible 	= getOSFriendlyShortcut("Ctrl+Alt+Shift+X");
const cDefaultShortcutSelection = getOSFriendlyShortcut("Ctrl+Alt+Shift+C");
const cDefaultShortcutEntire 	= getOSFriendlyShortcut("Ctrl+Alt+Shift+V");
const cDefaultShortcutBrowser 	= getOSFriendlyShortcut("Ctrl+Alt+Shift+B");

const cDefaultShortcutVisibleAction		= 0;
const cDefaultShortcutSelectionAction	= 0;
const cDefaultShortcutEntireAction		= 0;
const cDefaultShortcutBrowserAction		= 0;

const cDefaultTemplate			 = "FireShot Capture %n - %t - %u";


var isDebug = localStorage[cDebugPref] !== undefined;
var extensionId = chrome.i18n.getMessage('@@extension_id');
//isDebug = extensionId == "ljhbgpplnapkahgkchjfeednacjockbi";
logToConsole("Extension ID: " + extensionId);


function isNativeSupported()
{ return fsNativePlugin.ready; }

function getPlugin()
{
	return isNativeSupported() ? fsNativePlugin : getJSPlugin();
}

function pluginCommand(cmd, param1)
{
	try
	{
		var obj = param1 ? param1 : {},
			plugin = getPlugin();
		obj.JSONCommand = cmd;
		
		// logToConsole("plugin command: " + cmd + " : " + JSON.stringify(obj));
		
		//return getPlugin().launchFunction(cmd, obj);
		return isNativeSupported() ? plugin.launchJSON(obj) : plugin.launchFunction(cmd, obj);
	}
	catch (e) 
	{
		logError(e.message);
		return false;
	}
}

function openURL(url) 
{
	chrome.tabs.create({
		url: url
	});
}

function getOption(optionName, defaultValue)
{
	var val = localStorage[optionName];
	if (val == undefined) return defaultValue;
	else return val;
}

function logToConsole(data)
{
	// debugger;
	if (isDebug)
		console.log(data);
}

function logError(data)
{
	console.error("FireShot: " + data);
}

function getSBHeight(window)
{
	if (window.scrollbars.visible)
	{
		var spacer = window.document.createElement("div");
		spacer.setAttribute("style", "position: fixed; margin: 0px; padding: 0px; border: none; visibility: hidden;  top: 0px; left: 0px; width: 1px; height: 100%; z-index: -1;");
		window.document.body.appendChild(spacer);
		var sbHeight = window.innerHeight - spacer.offsetHeight;
		window.document.body.removeChild(spacer);
		return sbHeight > 0 && sbHeight < 40 ? sbHeight : 0;
	}
	else return 0;
}

function getExtension()
{
	return chrome.extension.getBackgroundPage();
}

function getShortcut(event) 
{
	var modifiers = [], key;		
	if (event.ctrlKey) modifiers.push("control");
	if (event.altKey) modifiers.push("alt");
	if (event.metaKey) modifiers.push("meta");
	if (event.shiftKey) modifiers.push("shift");
	modifiers = modifiers.join("+");
	
	if (modifiers == "" || event.which < 32) return "";

	var val = getOSFriendlyShortcut(modifiers.replace("alt", "Alt").replace("shift", "Shift").replace("control", "Ctrl").replace("meta", "Meta").replace("accel", "Ctrl")) + "+";
	
	if (event.which == 32) 
		key = "Space"; 
	else 
		key = String.fromCharCode(event.which).toUpperCase();
	
	val += key;
	
	return val;
}

function getOSFriendlyShortcut(string)
{
	if (isMac())
		return string.replace("Ctrl", "Cmd").replace("Meta", "Control");
	else 
		return string;
}

function isWindows()
{
	return navigator.appVersion.indexOf("Win") !=-1;
}

function isMac()
{
	return navigator.platform.match(/^mac/i) != null;
}

function isOpera()
{
	return navigator.vendor.match(/opera/i) != null;
}

function i18nPrepare()
{
	//noinspection JSCheckFunctionSignatures
    var itr = document.createNodeIterator(document.documentElement, NodeFilter.SHOW_ELEMENT,
	function(node) {
        return (node.getAttribute('data-i18n') === null ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT);
    }, false);
	
	var currentNode;  
	while (currentNode = itr.nextNode()) {
		var data = chrome.i18n.getMessage(currentNode.getAttribute('data-i18n'));
		if (data !== "") 
			currentNode.innerText = data;
		else 
			currentNode.innerText = "#" + currentNode.innerText; //currentNode.innerText;//currentNode.getAttribute('data-i18n');
	}
}


//noinspection JSUnusedLocalSymbols
function gaTrack(urchinCode, domain, url) {

  function rand(min, max) {
	  return min + Math.floor(Math.random() * (max - min));
  }

  var i=1000000000,
	  utmn=rand(i,9999999999), //random request number
	  cookie=rand(10000000,99999999), //random cookie number
	  random=rand(i,2147483647), //number under 2147483647
	  today=(new Date()).getTime(),
	  win = window.location,
	  img = new Image();

      img.src = 'http://www.google-analytics.com/__utm.gif?utmwv=1.3&utmn='
		  +utmn+'&utmsr=-&utmsc=-&utmul=-&utmje=0&utmfl=-&utmdt=-&utmhn='
		  +domain+'&utmr='+win+'&utmp='
		  +url+'&utmac='
		  +urchinCode+'&utmcc=__utma%3D'
		  +cookie+'.'+random+'.'+today+'.'+today+'.'
		  +today+'.2%3B%2B__utmb%3D'
		  +cookie+'%3B%2B__utmc%3D'
		  +cookie+'%3B%2B__utmz%3D'
		  +cookie+'.'+today
		  +'.2.2.utmccn%3D(referral)%7Cutmcsr%3D' + win.host + '%7Cutmcct%3D' + win.pathname + '%7Cutmcmd%3Dreferral%3B%2B__utmv%3D'
		  +cookie+'.-%3B';
}

function getFilenameLite()
{
	function padString(str, padString, length) 
	{
		str = str.toString();
		while (str.length < length)
			str = padString + str;
		return str;
	}
	
	var maxLen = getOption(cTemplateFilenameMaxLen, 100),  i = 0;

	do
	{
		var template = getOption(cTemplatePref, cDefaultTemplate),	
			d = new Date(),
			n = getOption(cTemplateNumberPref, 1);
			
		var url = getExtension().tabURL,
			title = getExtension().tabTitle;
			
		/*if (i == 1)
			title = title.substr(0, maxLen - (fullLength - title.length));		
		
		if (i == 2)*/
			//url = url.replace(/(.*)\?.*/gi, "$1");
			
		template = template.replace("%n", getOption(cTemplateNumberPadCheckPref, true) === "true" ? padString(n, 0, getOption(cTemplateNumberPadValuePref, 3)) : n);
		template = template.replace("%y", d.getFullYear());
		template = template.replace("%m", padString(d.getMonth() + 1, 0, 2));
		template = template.replace("%d", padString(d.getDate(), 0, 2));
		
		template = template.replace("%H", padString(d.getHours(), 0, 2));
		template = template.replace("%M", padString(d.getMinutes(), 0, 2));
		template = template.replace("%S", padString(d.getSeconds(), 0, 2));
			
		if (i == 1)
			url = url.substr(0, Math.max(14, maxLen - template.length + 1));
		else if (i == 2)
		{
			url = url.replace(/(.*)\?.*/gi, "$1");
			template = template.replace("%u", url);
			title = title.substr(0, Math.max(14, maxLen - template.length + 1)) + "_";
		}
		else if  (i == 3)
		{
		  url = url.substr(0, (maxLen - template.length) / 2 - 1);
		  template = template.replace("%u", url);
		  title = title.substr(0, (maxLen - template.length) - 1) + "_";
		}
		
		template = template.replace("%u", url);
		template = template.replace("%t", title);
		
		template = template.replace(/[:\/\\\*\?"]/g, "_");
		template = template.replace("<", "{");
		template = template.replace(">", "}");
		template = template.replace("|", "I");
		
	} while (++i < 4 && template.length > maxLen);
	
	//template = template.substr(0, maxLen - 4);
	if (template == "") template = "Untitled";
	
	localStorage[cTemplateNumberPref] = parseInt(n) + 1;
	
	
	
	return template;
}
/*
function tabSupportedForCapturing(tabId)
{
	try
	{
		chrome.tabs.executeScript(tabId, {code:"{}"}, function (res)
		{
			return chrome.runtime.lastError === undefined;
		});
		//logToconsole(chrome.runtime.lastError);
		return true;
	}
	catch (e)
	{
		return false;
	}
}*/

function showBadge(url)
{
	localStorage[cQueuedBadgeURLPref] = url;
	chrome.browserAction.setBadgeText({text: url && url != "undefined" ? "New" : ""});
	if (url)
		logToConsole("Setting badge for url: " + url);
}

function getLastAction() {return parseInt(getOption(cLastActionPref, cActionEdit));}

function getLastMode() {return parseInt(getOption(cLastModePref, cModeEntire));}

function setLastActionAndMode(capAction, capMode) {
    localStorage[cLastActionPref] = capAction;
    localStorage[cLastModePref] = capMode;
}

//noinspection JSUnusedGlobalSymbols
function isProMode() {
    return localStorage[cPluginProModePref] == "true";
}


/*
function waitForLoading(window, tabId, timeout, callback)
{

    function doneWaiting(tab)
    {
        chrome.tabs.executeScript({file: "scripts/fsNotificationOff.js", runAt: "document_start"});
        callback(tab);
    }

    try {
        if (window.tabs[tabId].status === "complete")
            callback(window.tabs[tabId]);
        else {

            chrome.tabs.executeScript({file: "scripts/fsNotificationOn.js", runAt: "document_start"});
            var cycle = new AsyncCycle(
                function (iterator) {
                    setTimeout(function () {
                        chrome.tabs.query({windowId: window.id}, function (tabs) {
                            try {
                                if (tabs && tabs[tabId]) {
                                    iterator.next(tabs[tabId]);
                                }
                                else doneWaiting();
                            }
                            catch (e) {
                                logError(e.message);
                                doneWaiting();
                            }
                        });
                    }, 1000);
                },

                function (tab) {
                    try {
                        if (tab.status === "complete" || --timeout <= 0) {
                            doneWaiting(tab);
                            return true;
                        }
                        return false;
                    }
                    catch (e) {
                        logError(e.message);
                        doneWaiting();
                        return true;
                    }
                }
            );

            cycle.next(window.tabs[tabId]);
        }
    }
    catch (e) {
        logError(e.message);
        callback();
    }
}

*/

(function(){
/*
 *扩展node的util类
 * @authors     wuhao
 * @date        2015-05-27 14:37:16
 * @version     1.0.0
 */
var util = window.util||{},
    ArrayPrototype = Array.prototype,
    ObjectPrototype = Object.prototype,
    FunctionPrototype = Function.prototype,
    ObjectHasOwnProperty = ObjectPrototype.hasOwnProperty,
    toString = ObjectPrototype.toString,
    ArraySlice = ArrayPrototype.slice,
    emptyFunction = function() {};

window.util=util;

function each(array, handle, scope) {
    if (!array || !handle) {
        return;
    }
    if (array.length >= 0) {
        for (var i = 0, size = array.length; i < size; i++) {
            if (scope == null) {
                scope = array[i];
            }
            if (handle.call(scope, i, array[i], size) === false) {
                return false;
            }
        }
    }
};

function iterator(array, handle, scope) {
    if (!array || !handle) {
        return;
    }
    scope = scope || null;
    for (var key in array) {
        if (scope == null) {
            scope = array[key];
        }
        if (ObjectHasOwnProperty.call(array, key) && handle.call(scope, key, array[key]) === false) {
            return false;
        }
    }
};

function mergerAndApply(isApply, isDeep, target, list) {
    each(list, function(index, copy) {
        iterator(copy, function(key, copyItem) {
            var targetItem = target[key];
            if (isApply && targetItem) {

            } else if (isDeep && copyItem && isObject(copyItem) && targetItem) {
                if (!isObject(targetItem)) {
                    targetItem = {};
                }
                target[key] = mergerAndApply(isApply, isDeep, targetItem, [copyItem]);
            } else {
                target[key] = copyItem;
            }
        });
    });
    return target;
};


function getArgs() {
    var args = arguments,
        target,
        isDeep = false,
        index;
    if (args[0] === true || args[0] === false) {
        isDeep = args[0];
        target = args[1] || {};
        index = 2;
    } else {
        target = args[0] || {};
        index = 1;
    }
    return {
        isDeep: isDeep,
        target: target,
        list: ArraySlice.call(args, index)
    };
};

function merger(isDeep, target, config1, configN) {
    var arg = getArgs.apply({}, arguments);
    return mergerAndApply(false, arg.isDeep, arg.target, arg.list);
};

function apply(isDeep, target, config1, configN) {
    var arg = getArgs.apply({}, arguments);
    return mergerAndApply(true, arg.isDeep, arg.target, arg.list);
};

function isEmpty(value) {
    return (value === null) || (value === undefined) || (value === '') || (isArray(value) && value.length === 0);
};


var isArray = ('isArray' in Array) ? Array.isArray : function(value) {
    return toString.call(value) === '[object Array]';
};

function isDate(value) {
    return toString.call(value) === '[object Date]';
};

function isObject(value) {
    return toString.call(value) === '[object Object]';
};

function isFunction(value) {
    return typeof value === 'function';
};

function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
};

function isString(value) {
    return typeof value === 'string';
};

function isBoolean(value) {
    return typeof value === 'boolean';
};

function isNumeric(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

function isElement(value) {
    return value ? value.nodeType === 1 : false;
};

function isTextNode(value) {
    return value ? value.nodeName === "#text" : false;
};
apply(util, {
    each: each,
    it: iterator,
    iterator: iterator,
    merger: merger,
    apply: apply,
    emptyFn: function() {},
    isArray: isArray,
    isEmpty: isEmpty,
    isDate: isDate
});

})();