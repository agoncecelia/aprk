jQuery.fn.DataTable.ext.type.search.string = function (data) {
    return !data ?
        '' :
        typeof data === 'string' ?
            data
                .replace(/έ/g, 'ε')
                .replace(/[ύϋΰ]/g, 'υ')
                .replace(/ό/g, 'ο')
                .replace(/ώ/g, 'ω')
                .replace(/ά/g, 'α')
                .replace(/[ίϊΐ]/g, 'ι')
                .replace(/ή/g, 'η')
                .replace(/\n/g, ' ')
                .replace(/á/g, 'a')
                .replace(/é/g, 'e')
                .replace(/í/g, 'i')
                .replace(/ó/g, 'o')
                .replace(/ú/g, 'u')
                .replace(/ê/g, 'e')
                .replace(/î/g, 'i')
                .replace(/ô/g, 'o')
                .replace(/è/g, 'e')
                .replace(/ï/g, 'i')
                .replace(/ü/g, 'u')
                .replace(/ã/g, 'a')
                .replace(/õ/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/ì/g, 'i')
                .replace(/Ç/g, 'c')
                .replace(/Ë/g, 'e')
                .replace(/ë/g, 'e') :
            data;
};
var municipalities = [
    'Deçan', 'Dragash', 'Ferizaj', 'Fushë Kosovë', 'Gjakovë', 'Gjilan', 'Gllogoc', 'Graçanicë', 'Hani i Elezit', 'Istog', 'Junik', 'Kamenicë', 'Kaçanik', 'Klinë', 'Kllokot', 'Leposaviq', 'Lipjan', 'Malishevë', 'Mamushë', 'Mitrovicë', 'Novobërdë', 'Obiliq', 'Partesh', 'Pejë', 'Podujevë', 'Prishtinë', 'Prizren', 'Rahovec', 'Ranillugë', 'Shtime', 'Shtërpcë', 'Skënderaj', 'Suhareka', 'Viti', 'Vushtrri', 'Zubin Potok', 'Zveçan'
]


var url = 'http://' + window.location.host;
$('#users').click(function () {
    listUsers();
})
if (window.location.hash == '#users-pane') {
    listUsers();
}
var departments = {}

var usersTable;


$('#usersTable tfoot th').each(function () {
    var title = $(this).text().trim();
    if (title != 'Veprimet') {
        $(this).html('<input class="search-box" type="text" placeholder="' + title + '" />')
    } else {
        $(this).html('<button type="button" class="btn btn-secondary clear-fields">Pastro</button>');
    }
})
$(document).on('click', '.clear-fields', function (e) {
    $('#usersTable tfoot th input').each(function () {
        $(this).val('');
    })
    usersTable.columns().every(function () {
        this.search('').draw();
    })
})

$('#usersTable_filter input').keyup(function () {
    usersTable.search(
        jQuery.fn.DataTable.ext.type.search.string(this.value)
    ).draw();
});


municipalities.map(val => {
    $('body #municipalitySignup').append($("<option></option>")
        .attr("value", val)
        .text(val));
});

$(document).on('click', '#addUser', function (e) {
    var departments
    $.ajax({
        type: 'GET',
        url: url + '/department',
        success: function (response) {
            departments = response.data
            for (var i = 0; i < departments.length; i++) {
                $('body #departmentSignup').append($("<option></option>").attr("value", departments[i].name).text(departments[i].name));
            }
        }
    })
    $('#divisionSelection').hide();
    $('body #departmentSignup').change(function () {
        $('#divisionSelection').show();
        departments.forEach(department => {
            if ($('#departmentSignup').val() == department.name) {
                $('body #divisionSignup').html("");
                $('body #divisionSignup').append($("<option></option>")
                    .attr("value", "")
                    .text("Zgjedhni divizionin"));
                department.divisions.forEach(division => {
                    // Clear the previous selection content
                    $('body #divisionSignup').append($("<option></option>")
                        .attr("value", division.name)
                        .text(division.name));
                });
            }
        });
    });
})
$("#firstNameSignup, #lastNameSignup").on('keyup', function () {
    $("#username").val($("#firstNameSignup").val().toLowerCase() + '.' + $('#lastNameSignup').val().toLowerCase());
})
$('body #createUser').click(function (e) {
    e.preventDefault();
    var inputs = $('#createUserForm');
    if (inputs[0].checkValidity() === true) {
        var data = {
            firstName: $('#firstNameSignup').val(),
            lastName: $('#lastNameSignup').val(),
            username: $("#username").val(),
            email: $('#emailSignup').val(),
            password: $('#passwordSignup').val(),
            municipality: $('#municipalitySignup').val(),
            department: $('#departmentSignup').val(),
            expires: $('#expiring').val(),
            division: $('#divisionSignup').val(),
            gender: $("input[name='gender']:checked").val(),
            role: $("input[name='role']:checked").val()
        }
        $.ajax({
            type: 'POST',
            url: url + '/user/register',
            data: data,
            success: function (response) {
                if (response.confirmation == 'success') {
                    var obj = {
                        firstName: response.data.firstName,
                        lastName: response.data.lastName,
                        email: response.data.email,
                        municipality: response.data.municipality,
                        department: response.data.department,
                        division: response.data.division,
                        gender: response.data.gender,
                        status: response.data.status,
                        role: response.data.role
                    }
                    usersTable.row.add(obj).node().id = response.data._id;
                    usersTable.draw(false);
                    swal(
                        'Sukses!',
                        'Përdoruesi u krijua me sukses.',
                        'success'
                    )
                    $('body #createUserModal').modal('hide');
                } else {
                    swal(
                        'Gabim!',
                        'Emaili i përdoruesit duhet të jetë unik',
                        'error'
                    )
                }
                inputs.removeClass('was-validated');
            },
            error: function () {
                swal({
                    type: 'error',
                    text: 'Problem me serverin'
                })
            }
        })
    }
    inputs.addClass('was-validated');
})

$('.modal').on('hide.bs.modal', function () {
    $(this).find('form').trigger('reset');
    $(this).find('form').removeClass('was-validated');
    $('#divisionSelection').hide();
    $('#expiringSection').hide();
    $('#expiringHr').hide();
    $('#departmentSignup').empty();
    $('body #departmentUpdate').empty();
    $('#expiringUpdate').val('')
    $('body #departmentUpdate').append($("<option></option>")
        .attr("value", "")
        .text("Zgjedhni departamentin"));
    $('#departmentSignup').append($("<option></option>")
        .attr("value", "")
        .text("Zgjedhni departamentin"));
});

$(document).on('click', '.viewUser', function (e) {
    var id = $(this).parent().parent().attr('id');
    $.ajax({
        type: 'GET',
        url: url + '/user/' + id,
        success: function (response) {
            var user = response.user;
            var role, status, gender;
            if (user.role == 'superadmin') role = 'Super Administrator';
            else if (user.role == 'admin') role = 'Administrator';
            else role = 'Perdorues i thjeshte'
            if (user.status == 'active') status = 'Aktiv';
            else status = "Jo aktiv";
            if (user.gender == 'm') gender = 'Mashkull';
            else if (user.gender == 'f') gender = 'Femer';
            else gender = '---';
            $('#NfirstName').text(user.firstName);
            $('#NlastName').text(user.lastName);
            $('#Nusername').text(user.username);
            $('#Nemail').text(user.email);
            $('#Nmunicipality').text(user.municipality);
            $('#Ndepartment').text(user.department);
            $('#Ndivision').text(user.division);
            if(user.expires) {
                $('#expiringSection').show();
                $('#expiringHr').show();
                $('#Nexpiring').text(moment(user.expires).format('DD/MM/YYYY'));
            }
            $('#Nrole').text(role);
            $('#Nstatus').text(status);
            $('#Ngender').text(gender);
            $('#viewUserModal').modal();
        }
    })

})

$(document).on('click', '.deleteUser', function (e) {
    var userId = $(this).parent().parent().attr('id');
    var userEmail = $(this).parent().parent().data('email');
    swal({
        title: 'A jeni të sigurte?',
        text: "Ju keni zgjedhur të fshini përdoruesin me email: " + userEmail,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        cancelButtonText: 'Anulo',
        confirmButtonText: 'Fshije!',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: 'DELETE',
                url: url + '/user/' + userId,
                success: function (response) {
                    swal(
                        'Sukses!',
                        'Përdoruesi është fshirë me sukses.',
                        'success'
                    )
                },
                error: function () {
                    swal({
                        type: 'error',
                        text: 'Problem me serverin'
                    })
                }
            })
            usersTable.row($(this).closest('tr')).remove().draw();
        }
    })
})
municipalities.map(val => {
    $('body #municipalityUpdate').append($("<option></option>")
        .attr("value", val)
        .text(val));
});

var userId
$(document).on('click', '.editUser', function (e) {
    var departments;
    e.preventDefault();
    e.stopPropagation();
    userId = $(this).parent().parent().attr('id');

    $.ajax({
        type: 'GET',
        url: url + '/user/' + userId,
        success: function (response) {
            var user = response.user;
            $.ajax({
                type: 'GET',
                url: url + '/department',
                success: function (response) {
                    departments = response.data
                    for (var i = 0; i < departments.length; i++) {
                        $('body #departmentUpdate').append($("<option></option>").attr("value", departments[i].name).text(departments[i].name));
                    }
                    departments.forEach(department => {
                        if (department.name == user.department) {
                            department.divisions.forEach(division => {
                                $('body #divisionUpdate').append($("<option></option>")
                                    .attr("value", division.name)
                                    .text(division.name));
                            })
                        }
                    })
                    $('#updateUserModal').modal()
                    $('#firstNameUpdate').attr("value", user.firstName);
                    $('#lastNameUpdate').attr("value", user.lastName);
                    $('#emailUpdate').attr("value", user.email);
                    $('#usernameUpdate').attr("value", user.username);
                    if(user.expires) {
                        $("#expiringHr").show();
                        $('#expiringUpdate').attr("value", new Date(user.expires).toISOString().substring(0, 10));
                    }
                    document.querySelector(`#municipalityUpdate option[value="${user.municipality}"`).selected = true
                    document.querySelector(`#departmentUpdate option[value="${user.department}"`).selected = true;
                    document.querySelector(`#divisionUpdate option[value="${user.division}"`).selected = true;
                    document.querySelector(`input[name=roleUpdate][value='${user.role}']`).checked = true;
                    document.querySelector(`input[name=genderUpdate][value='${user.gender}']`).checked = true;
                    document.querySelector(`input[name=statusUpdate][value='${user.status}']`).checked = true;
                }
            })

            $('body #departmentUpdate').change(function () {
                departments.forEach(department => {
                    if ($('#departmentUpdate').val() == department.name) {
                        $('body #divisionUpdate').html("");
                        $('body #divisionUpdate').append($("<option></option>")
                            .attr("value", "")
                            .text("Zgjedhni divizionin"));
                        department.divisions.forEach(division => {
                            // Clear the previous selection content
                            $('body #divisionUpdate').append($("<option></option>")
                                .attr("value", division.name)
                                .text(division.name));
                        });
                    }
                });
            });
        },
        error: function () {
            swal({
                type: 'error',
                text: 'Problem me serverin'
            })
        }
    })
})
$('#updateUser').click(function (e) {
    var updateUserForm = $('#updateUserForm');
    if (updateUserForm[0].checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
        updateUserForm.addClass('was-validated')
    } else {
        var data = {
            id: userId,
            firstName: $('#firstNameUpdate').val(),
            lastName: $('#lastNameUpdate').val(),
            municipality: $('#municipalityUpdate').val(),
            department: $('#departmentUpdate').val(),
            division: $('#divisionUpdate').val(),
            expires: $('#expiringUpdate').val(),
            role: $("input[name='roleUpdate']:checked").val(),
            gender: $("input[name='genderUpdate']:checked").val(),
            status: $("input[name='statusUpdate']:checked").val()
        }
        $.ajax({
            type: 'PUT',
            url: url + '/user/update',
            data: data,
            success: function (response) {
                var obj = {
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    municipality: response.data.municipality,
                    department: response.data.department,
                    division: response.data.division,
                    gender: response.data.gender,
                    role: response.data.role,
                    status: response.data.status
                }
                usersTable.row("#" + response.data._id).data(obj).draw(false);
                swal(
                    'Sukses!',
                    'Ndryshimet u ruajtën me sukses.',
                    'success'
                )
                updateUserForm.removeClass('was-validated');
                $('#updateUserModal').modal('hide');
            },
            error: function () {
                swal({
                    type: 'error',
                    text: 'Problem me serverin'
                })
            }
        })
    }
    return false;
})
function listUsers() {
    $('#usersTable').DataTable().destroy();
    $('#usersTable tbody').empty();
    usersTable = $('#usersTable').DataTable({
        paging: false,
        dom: 'frt',
        "language": {
            "lengthMenu": "Të shfaqur _MENU_ përdorues",
            "zeroRecords": "Përdoruesi nuk u gjet!",
            "info": "Duke shfaqur faqen _PAGE_ nga _PAGES_",
            "infoEmpty": "Nuk ka përdorues!",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "sProcessing": "Duke procesuar...",
            "sSearch": "Kërkoni:",
            "oPaginate": {
                "sFirst": "E para",
                "sLast": "E Fundit",
                "sNext": "Përpara",
                "sPrevious": "Prapa"
            }
        },
        initComplete: function () {
            $("#" + sessionStorage.getItem('id')).find("td:last").html('<i data-toggle="tooltip" data-placement="top" title="SHIKO" class="fa fa-fw fa-eye viewUser"></i>')
            $('[data-placement="top"]').tooltip({
                template: '<div class="tooltip" role="tooltip" style="pointer-events: none;"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
                trigger: 'hover'
            })
            $('[data-placement="top"]').tooltip({
            })
        },
        ajax: {
            "url": url + '/user',
            "type": 'GET',
        },
        createdRow: function (row, data, dataIndex) {
            $(row).attr('data-email', data.email)
        },
        rowId: '_id',
        responsive: true,
        columnDefs: [
            {
                "targets": 9,
                "data": null,
                "className": 'all',
                "defaultContent":
                    `<i data-toggle="tooltip" data-placement="top" title="NDRYSHO" class="fa fa-fw fa-edit editUser"></i>
                        <i data-toggle="tooltip" data-placement="top" title="SHIKO" class="fa fa-fw fa-eye viewUser"></i>
                        <i data-toggle="tooltip" data-placement="top" title="FSHIJ" class="fa fa-fw fa-trash deleteUser"></i>`
            }
        ],
        columns: [
            { "data": "firstName" },
            { "data": "lastName" },
            { "data": "email" },
            { "data": "municipality" },
            { "data": "department" },
            { "data": "division" },
            {
                "data": "gender",
                render: function (data) {
                    if (data == 'm') {
                        return 'Mashkull'
                    } else if (data == 'f') {
                        return 'Femer'
                    } else {
                        return '---'
                    }
                }
            },
            {
                "data": "role",
                render: function (data) {
                    if (data == 'superadmin') {
                        return 'Super Administrator';
                    }
                    else if (data == 'admin') {
                        return 'Administrator';
                    }
                    else {
                        return 'Perdorues i thjeshte'
                    }
                    return data;
                }
            },
            {
                "data": "status",
                render: function (data) {
                    if (data == 'active') {
                        return "Aktiv";
                    } else {
                        return "Jo aktiv";
                    }
                    return data;
                }
            }
        ]
    })
    
    $('#usersTable').DataTable().columns().every(function () {
        var that = this;
        $('input', this.footer()).on('keyup change', function () {
            if (that.search() !== this.value) {
                that.search(this.value)
                    .draw();
            }
        });
    });
}