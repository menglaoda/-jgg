
(function (window) {
    
    window.manifest=function (arr) {
        return new Queue(arr);
    }
    
    
    function Queue (arr) {
        this.arr=arr;
        this.result={};
        this.index=0;
    }
    
    
    Queue.prototype.load=function () {
    	if(this.index>=this.arr.length){
    		if(typeof this.complete=='function'){
    			this.complete();
    		}
    		return;
    	}
    	var that = this;
        var img = new Image();
        img.src=this.arr[this.index].url;
        this.result[this.arr[this.index].id]=img;
        img.onload=function () {
            that.index++;
            that.load();
        }
    }
    
    
    
})(window);




