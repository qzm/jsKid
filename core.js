function main(){
	setInterval(run,1000/30);
}
function run(){
	var tz=document.getElementById('timeZone');
	time=new Date();
	tz.innerHTML=time.toLocaleDateString()+'<br/>'+time.toLocaleTimeString();
}

