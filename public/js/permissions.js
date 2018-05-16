if(sessionStorage.getItem('role') == 'user') {
    $('#users').hide();
    $('#activitylogs').hide();
    $('#addDocument').hide();
    $('#departments').hide();
}
if(sessionStorage.getItem('role') == 'admin') {
    $('#users').hide();
    $('#activitylogs').hide();
    $('#departments').hide();
}



