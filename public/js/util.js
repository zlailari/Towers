safeParseJSON = function(s) {
    try {
        return JSON.parse(s);
    }catch(e){
        return false;
    }
};
