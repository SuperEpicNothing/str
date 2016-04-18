var audio = {}
audio.currentTrack = undefined;
audio.setTrack = function(s){
	audio.reset();
	audio.currentTrack = new Audio('music/'+s);
	audio.update();
}
audio.update = function(){
	if(!audio.currentTrack)
		return;
	audio.currentTrack.loop=true;
	audio.currentTrack.volume = option.volume / 100;
	audio.currentTrack.muted = option.mute;

}
audio.play =function(b){
	if(!audio.currentTrack)
		return;
	if(b)
		audio.currentTrack.play();
	else
		audio.currentTrack.pause();
}

audio.reset= function()
{
	if(!audio.currentTrack)
		return;
	audio.currentTrack.currentTime=0;
	audio.currentTrack.pause();
}