var ver = "0.1.7";
console.log(ver);
var currentUrl = window.location.href;


var url = new URL(currentUrl);
var userName = url.searchParams.get("name");
var userRole = url.searchParams.get("role");
var sessionToConnect = url.searchParams.get("sessionToConnect");
console.log("userName="+userName+"  userRole="+userRole+" sessionToConnect="+sessionToConnect);

var application = new Application($,userName, userRole, sessionToConnect);

function createOpenVidu(){
	console.log("createOpenVidu()");
	var OV = new OpenVidu();
	return OV;
}
