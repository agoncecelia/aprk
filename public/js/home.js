$(document).ready(function () {
    var url = 'http://' + window.location.host;

    $('#forgot-password').css('cursor', 'pointer');
    $('#forgot-password').click(function () {
        (async () => {
            const { value: email } = await swal({
                title: 'Keni harruar fjalëkalimin?',
                input: 'email',
                inputPlaceholder: 'Shkruani email adresën',
            })

            if (email) {
                $.ajax({
                    type: "POST",
                    url: url + "/user/forgot",
                    data: { email: email },
                    success: function (data) {
                        swal(data.message);
                    },
                    error: function() {
                        swal({
                            type:'error',
                            text: 'Problem me serverin'
                        })
                    }
                })
            }
        })();
    })
})
