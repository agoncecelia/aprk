module.exports.checkPermission = function(user, roles) {
    for(var i = 0; i < roles.length; i++) {
        if(user.role == roles[i]) {
            return true;
            break;
        } 
    }
    return false;
}