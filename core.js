var cache;
function main(){
    setInterval(run, 1000 / 30);
}
function run(){
    time = new Date();
    if (cache!= time.getSeconds()) {
        var tz = document.getElementById('timeZone');
        tz.innerHTML = time.toLocaleDateString() + '<br/>' + time.toLocaleTimeString();
		cache=time.getSeconds();
    }
}
