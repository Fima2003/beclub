document.getElementById('schemasetc').addEventListener('change', function(){
    'use strict';
    let vis = document.getElementsByClassName('vis');
    let target = document.getElementById(this.value);
    if(vis != null){
        vis[0].classList.add('inv');
        vis[0].classList.remove('vis');
    }
    target.classList.add('vis');
    target.classList.remove('inv');
});