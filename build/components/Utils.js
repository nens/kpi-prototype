/**
 * @jsx React.DOM
 */

Utils = {};


Utils.quantize = function(d) {
	var d = Math.floor(Number(d));
	if(d === 0) {
		return 'grey';
	} else
	if(d >= 1 && d <= 2) {
		return '#d73027';	
	} else 
	if(d >= 2 && d <= 3) {
		return '#f46d43';
	} else 
	if(d >= 3 && d <= 4) {
		return '#fdae61';
	} else 
	if(d >= 4 && d <= 5) {
		return '#fee08b';
	} else
	if(d >= 5 && d <= 6) {
		return '#ffffbf';
	} else
	if(d >= 6 && d <= 7) {
		return '#d9ef8b';
	} else
	if(d >= 7 && d <= 8) {
		return '#a6d96a';
	} else
	if(d >= 8 && d <= 9) {
		return '#66bd63';
	} else {
		return '#1a9850';
	}
};


Utils.truncate = function (fullStr, strLen, separator) {
    if (fullStr.length <= strLen) return fullStr;
    
    separator = separator || '...';
    
    var sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow/2),
        backChars = Math.floor(charsToShow/2);
    
    return fullStr.substr(0, frontChars) + 
           separator + 
           fullStr.substr(fullStr.length - backChars);
};


module.exports = Utils;