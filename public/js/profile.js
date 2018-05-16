var url = 'http://' + window.location.host;
//Get profile information
$('#passwordPanel').hide();
$('.changePassword').click(function () {
    if ($('#passwordPanel').is(':visible')) {
        $('#forgotPasswordArrow').removeClass('fa fw fa-arrow-up').addClass('fa fw fa-arrow-down');
    } else {
        $('#forgotPasswordArrow').removeClass("fa fw fa-arrow-down").addClass("fa fw fa-arrow-up");
    }
    $('#passwordPanel').slideToggle('slow', function() {
        $('html,body').animate({
            scrollTop: $("#passwordPanel").offset().top
        },'slow');
    })
})
var firstName, lastName, admin, superadmin, user;

populateProfile();
$('#myprofile').click(function(e) {
    populateProfile();
})

if(window.location.hash == '#myprofile-pane') {
    populateProfile();
}
function populateProfile() {
        $.ajax({
            type: 'GET',
            url: url + '/user/profile/',
            async: false,
            success: function (data) {
                sessionStorage.setItem('role', data.role);
                sessionStorage.setItem('id', data._id);
                firstName = data.firstName;
                lastName = data.lastName;
                name = firstName + ' ' + lastName;
                $('#profileName').text(name);
                $('#email').attr("value", data.email);
                $('#firstName').attr("value", data.firstName);
                $('#lastName').attr("value", data.lastName);
                $('#municipality').attr("value", data.municipality);
                $('#department').attr("value", data.department);
                $('#division').attr("value", data.division);
                $('#role').attr("value", data.role);
    
                if (data.role == 'superadmin') {
                    superadmin = 'Super Administrator';
                    $('#role').attr("value", superadmin);
                    $('#profileRole').text('Ju jeni të kyçur si ' + superadmin);
                }
                else if (data.role == 'admin') {
                    admin = 'Administrator';
                    $('#role').attr("value", admin);
                    $('#profileRole').text('Ju jeni të kyçur si ' + admin);
                }
                else {
                    user = 'Përdorues i thjeshtë';
                    $('#role').attr("value", user);
                    $('#profileRole').text('Ju jeni të kyçur si ' + user);
                }
    
                if (data.gender == 'm') {
                    $('#male').attr('checked', 'checked');
                }
                if (data.gender == 'f') {
                    $('#female').attr('checked', 'checked');
                }
            }
        })
}


//Update profile information
$('body').on('click', '#updateProfile', function (e) {
    var inputs = $('#updateProfileForm');
    if (inputs[0].checkValidity() === true) {
        e.preventDefault();
        e.stopPropagation();
        var data = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            gender: $("input[name='gender']:checked").val()
        }
        $.ajax({
            type: 'PUT',
            url: url + '/user/details',
            data: data,
            success: function (data) {
                if (data.confirmation == 'success') {
                    swal({
                        type: 'success',
                        text: data.message
                    })
                } else {
                    swal({
                        type: 'error',
                        text: data.message
                    })
                }
                inputs.removeClass('was-validated');
            }
        })
    }
    inputs.addClass('was-validated');
})

$('body').on('click', '#changePassword', function (e) {
    e.preventDefault();

    var inputs = $('#updatePassword');

    if (inputs[0].checkValidity() === true) {
        if ($('#newPassword').val() == $('#confirm').val()) {
            var data = {
                oldPassword: $('#oldPassword').val(),
                newPassword: $('#newPassword').val()
            }
            $.ajax({
                type: 'PUT',
                url: url + '/user/password',
                data: data,
                success: function (data) {
                    if (data.confirmation == 'success') {
                        swal({
                            type: 'success',
                            text: data.message
                        })
                    } else {
                        swal({
                            type: 'error',
                            text: data.message
                        })
                    }
                    inputs.removeClass('was-validated');
                    $('#updatePassword')[0].reset();

                },
                error: function() {
                    swal({
                        type:'error',
                        text: 'Problem me serverin'
                    })
                    $('#updatePassword')[0].reset();
                    inputs.removeClass('was-validated');
                }
            })
        } else {
            swal({
                type: 'error',
                text: 'Fjalëkalimi i ri nuk është konfirmuar mirë.'
            })
            inputs.removeClass('was-validated');
            $('#updatePassword')[0].reset();
        }
    }
    inputs.addClass('was-validated');
})
