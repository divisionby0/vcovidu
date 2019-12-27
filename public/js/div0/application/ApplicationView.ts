///<reference path="AppEvent.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
class ApplicationView{
    private j:any;

    public static LOGGING_IN:string = "LOGGING_IN";
    public static CHATTING:string = "CHATTING";

    private currentState:string;
    private userName:string;
    private nickName:string;
    private sessionName:string;

    constructor(j:any){
        this.j = j;
        this.currentState = ApplicationView.LOGGING_IN;
        this.onStateChanged();
        this.createListeners();
    }

    public cleanSessionView():void{
        this.removeAllUserData();
        this.cleanMainVideo();
        this.j('#main-video video').css("background", "");
    }

    public removeUserData(connectionId:string):void{
        var userNameRemoved = this.j("#data-" + connectionId);
        if (this.j(userNameRemoved).find('p.userName').html() === this.j('#main-video p.userName').html()) {
            this.cleanMainVideo(); // The participant focused in the main video has left
        }
        this.j("#data-" + connectionId).remove();
    }

    public joinComplete(sessionName:string):void{
        this.j('#session-title').text(sessionName);
        this.j('#join').hide();
        this.j('#session').show();
    }
    public initMainVideoThumbnail():void{
        this.j('#main-video video').css("background", "url('images/subscriber-msg.jpg') round");
    }

    public initMainVideo(videoElement:any, data:any):void {
        this.j('#main-video video').get(0).srcObject = videoElement.srcObject;
        this.j('#main-video p.nickName').html(data.nickName);
        this.j('#main-video p.userName').html(data.userName);
        this.j('#main-video video').prop('muted', true);

        this.j(videoElement).prop('muted', true); // Mute local video
    }

    public appendUserData(videoElement:any, data:any):void{
        var clientData;
        var serverData;
        var nodeId;
        console.log("appendUserData data=",data);

        if (data.nickName) { // Appending local video data
            clientData = data.nickName;
            serverData = data.userName;
            nodeId = 'main-videodata';
        } else {
            clientData = JSON.parse(data.data.split('%/%')[0]).clientData;
            serverData = JSON.parse(data.data.split('%/%')[1]).serverData;
            nodeId = data.connectionId;
        }
        var dataNode = document.createElement('div');
        dataNode.className = "data-node";
        dataNode.id = "data-" + nodeId;
        dataNode.innerHTML = "<p class='nickName'>" + clientData + "</p><p class='userName'>" + serverData + "</p>";
        videoElement.parentNode.insertBefore(dataNode, videoElement.nextSibling);
    }

    public onLogOut():void{
        this.currentState = ApplicationView.LOGGING_IN;
        this.onStateChanged();
    }

    public onLogIn(sessionName:string, user:string, nickName:string):void{
        this.userName = user;
        this.nickName = nickName;
        this.sessionName = sessionName;

        this.currentState = ApplicationView.CHATTING;
        this.onStateChanged();
    }

    private cleanMainVideo():void {
        this.j('#main-video video').get(0).srcObject = null;
        this.j('#main-video p').each(function () {
            this.j(this).html('');
        });
    }
    private removeAllUserData():void{
        this.j(".data-node").remove();
    }

    private onStateChanged():void {
        switch(this.currentState){
            case ApplicationView.CHATTING:
                this.hideLoggingInElement();

                this.j("#name-user").text(this.userName);
                this.j("#sessionName").val(this.sessionName);
                this.j("#nickName").val(this.nickName);
                this.createLogoutButtonListener();
                this.showChatElement();
                break;
            case ApplicationView.LOGGING_IN:
                this.showLoggingInElement();
                this.removeLogoutButtonListener();
                this.hideChatElement();
                break;
        }
    }

    private showLoggingInElement():void{
        this.j("#not-logged").show();
    }
    private hideLoggingInElement():void{
        this.j("#not-logged").hide();
    }

    private showChatElement():void{
        this.j("#logged").show();
    }
    private hideChatElement():void{
        this.j("#logged").hide();
    }

    private createListeners():void {

    }

    private createLogoutButtonListener():void{
        this.j("#logoutBtn").on("click",(event)=>this.onLogoutButtonClicked(event));
    }

    private removeLogoutButtonListener():void{
        this.j("#logoutBtn").off("click",(event)=>this.onLogoutButtonClicked(event));
    }


    private onLogoutButtonClicked(event):void {
        EventBus.dispatchEvent(AppEvent.LOGOUT_REQUEST, null);
    }
}
