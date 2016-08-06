var readyList = [];
readyList.clear = function(){
    for(var i = 0; i <= (views.length-1); i++){
        this[i] = false;
    }
}

/**
 * Returns true when all elements in list are loaded (true).
 * If an element has the value "fail" it will count as loaded.
 * Returns false when one or more elements are still loading.
 */
readyList.isDone = function(){
    var i = 0;
    var isDone = true;
    while(i <= (this.length-1) && isDone == true){
        if(this[i] === "fail"){
            isDone = true;
        }
        else{
            isDone = this[i];
        }
        i++;
    }
    return isDone;
}

readyList.count = function(){
    var count = 0;
    for(var i=0; i<= (this.length-1); i++){
        if(this[i]){
            count++;
        }
    }
    return count;
}

readyList.fails = function(){
    var fails = 0;
    for(var i=0; i<= (this.length-1); i++){
        if(this[i] == "fail"){
            fails++;
        }
    }
    return fails;
}
