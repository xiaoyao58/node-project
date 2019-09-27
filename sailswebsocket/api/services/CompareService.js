module.exports = {
    compare: function(pro){
        return function(o1,o2){
            var v1 = o1[pro];
            var v2 = o2[pro];
            if(v1>v2){
                return 1;
            }else if(v1<v2){
                return -1;
            }else{
                return 0;
            }
        }
    }
}