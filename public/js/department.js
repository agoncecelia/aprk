
var departments;
$('#departments').click(function(e) {
    e.preventDefault();
    $('#departmentsContent').html('')
    populateDepartments();
})

if(window.location.hash == '#departments-pane') {
    populateDepartments();
}

function populateDepartments() {
    $.ajax({
        type: 'GET',
        url: url + '/department',
        success: function (response) {
            departments = response.data
            $('#departmentsContent').append('<div style="padding-top: 10px;" id="departmentsAccordion"></div>');
            for (var i = 0; i < departments.length; i++) {
                $('#departmentsAccordion').append(
                    `<div class="card">
                <div class="card-header" data-toggle="collapse" data-target="#${departments[i]._id}" id="${i}"> 
                            <div>    
                            <h6 class="mb-0">
                                ${departments[i].name}
                                <span style="float: right;">
                                <i data-id="${departments[i]._id}" data-toggle="tooltip" data-placement="top" title="NDRYSHO" class="fa fa-fw fa-edit editDepartment"></i>
                                <i data-id="${departments[i]._id}" data-toggle="tooltip" data-placement="top" title="FSHIJ" class="fa fa-fw fa-trash deleteDepartment"></i>
                                <i data-id="${departments[i]._id}" data-toggle="tooltip" data-placement="top" title="SHTO DIVIZION" class="fa fa-fw fa-plus addDivision"></i>
                                <span>
                                </h6>
                                </div>
                                </div>
                                
                                <div id="${departments[i]._id}" class="collapse" aria-labelledby="${i}" data-parent="#departmentsAccordion">
                                <div class="card-body">
                                <ul class="list-group list-group-flush">
                                </div>
                                </div>`
                )
                for (var j = 0; j < departments[i].divisions.length; j++) {
                    $('#' + departments[i]._id + ' .card-body ul').append(`
                                <li id="${departments[i].divisions[j]._id}"class="list-group-item">${departments[i].divisions[j].name}
                                <span style="float: right;">
                                <i data-id="${departments[i].divisions[j]._id}" 
                                data-departmentid="${departments[i]._id}"
                                data-toggle="tooltip" data-placement="top" title="NDRYSHO" class="fa fa-fw fa-edit editDivision"></i>
                                <i data-id="${departments[i].divisions[j]._id}"
                                data-departmentid="${departments[i]._id}" 
                                data-toggle="tooltip" data-placement="top" title="FSHIJ" class="fa fa-fw fa-trash deleteDivision"></i>
                                </span>
                                </li>`)
                }
            }
        }
    })
}
$('#createDepartment').click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    if ($('#createDepartmentForm')[0].checkValidity() == true) {
        var data = {
            name: $('#departmentName').val()
        }
        $.ajax({
            type: 'POST',
            url: url + '/department',
            data: data,
            success: function (response) {
                if (response.confirmation == 'fail') {
                    swal({
                        type: 'error',
                        text: 'Emri i departamentit duhet të unik'
                    })
                } else {
                    $('#departmentsAccordion').append(
                        `<div class="card">
                            <div class="card-header" data-toggle="collapse" data-target="#${response.data._id}" id="${Math.floor((Math.random() * 100) + 1)}">
                                <div>    
                                    <h6 class="mb-0">
                                        ${response.data.name}
                                        <span  style="float: right;">
                                            <i data-id="${response.data._id}" data-toggle="tooltip" data-placement="top" title="NDRYSHO" class="fa fa-fw fa-edit editDepartment"></i>
                                            <i data-id="${response.data._id}" data-toggle="tooltip" data-placement="top" title="FSHIJ" class="fa fa-fw fa-trash deleteDepartment"></i>
                                            <i data-id="${response.data._id}" data-toggle="tooltip" data-placement="top" title="SHTO DIVIZION" class="fa fa-fw fa-plus addDivision"></i>
                                        </span>
                                    </h6>
                                </div>
                            </div>
                        
                            <div id="${response.data._id}" class="collapse" data-parent="#departmentsAccordion">
                            <div class="card-body">
                            <ul class="list-group list-group-flush">
                            </div>
                        </div>`
                    )
                    $('#departmentName').val('');
                }
                $('#createDepartmentForm').removeClass('was-validated');
            },
            error: function () {
                swal({
                    type: 'error',
                    text: 'Problem me serverin'
                })
            }
        })
    }
    $('#createDepartmentForm').addClass('was-validated');
})

$(document).on('click', '.deleteDepartment', function (e) {
    var id = $(this).data('id');
    var departmentTitle = $(this).parent().parent().text();
    swal({
        title: 'A jeni të sigurte?',
        text: "Ju keni zgjedhur të fshini departamentin: " + departmentTitle,
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
                url: url + '/department/' + id,
                type: 'DELETE',
                success: function (response) {
                    $('.tooltip').hide();
                    $('#' + id).parent().remove();
                },
                error: function () {
                    swal({
                        type: 'error',
                        text: 'Problem me serverin'
                    })
                }
            })
        }
    })
})

$(document).on('click', '.editDepartment', function (e) {
    var id = $(this).data('id');
    swal({
        title: 'Shkruani emrin e departamentit',
        input: 'text',
        inputValue: $(this).parent().parent().text().trim(),
        showCancelButton: true,
        cancelButtonText: 'Anulo',
        confirmButtonText: 'Ndrysho',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        showLoaderOnConfirm: true,
        reverseButtons: true,
        preConfirm: (text) => {
            return new Promise((resolve) => {
                if (text === '') {
                    swal.showValidationError('Emri i departamentit nuk mund të jetë i zbrazët')
                    resolve()
                }
                var data = {
                    name: text
                }
                $.ajax({
                    type: "PUT",
                    url: url + "/department/" + id,
                    data: data,
                    success: function (response) {
                        resolve(response)
                        $($('[data-target="#' + id + '"]').children().children()[0]).html(text + `<span  style="float: right;">
                        <i data-id="${response.data._id}" data-toggle="tooltip" data-placement="top" title="NDRYSHO" class="fa fa-fw fa-edit editDepartment"></i>
                        <i data-id="${response.data._id}" data-toggle="tooltip" data-placement="top" title="FSHIJ" class="fa fa-fw fa-trash deleteDepartment"></i>
                        <i data-id="${response.data._id}" data-toggle="tooltip" data-placement="top" title="SHTO DIVIZION" class="fa fa-fw fa-plus addDivision"></i>
                    </span>`)
                    },
                    error: function () {
                        resolve('Problem me serverin')
                    }
                })
            })
        },
        allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
        if (result.value) {
            swal({
                type: 'success',
                title: 'Departamenti u ndryshua me sukses',
            })
        }
    })
})

$(document).on('click', '.addDivision', function (e) {
    var id = $(this).data('id');
    swal({
        title: 'Shkruani emrin e divizionit',
        input: 'text',
        showCancelButton: true,
        cancelButtonText: 'Anulo',
        confirmButtonText: 'Shto',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        showLoaderOnConfirm: true,
        reverseButtons: true,
        preConfirm: (text) => {
            return new Promise((resolve) => {
                if (text === '') {
                    swal.showValidationError('Emri i divizionit nuk mund të jetë i zbrazët')
                    resolve()
                }
                var data = {
                    name: text
                }
                $.ajax({
                    url: url + '/department/' + id + '/division',
                    type: 'POST',
                    data: data,
                    success: function (response) {
                        resolve(response)
                        $('#' + id + ' .card-body ul').append(`
                        <li id="${response.data.divisions[response.data.divisions.length - 1]._id}" class="list-group-item">
                            ${response.data.divisions[response.data.divisions.length - 1].name}
                            <span style="float: right;">
                            <i data-id="${response.data.divisions[response.data.divisions.length - 1]._id}" 
                            data-departmentid="${response.data._id}"
                            data-toggle="tooltip" data-placement="top" title="NDRYSHO" class="fa fa-fw fa-edit editDivision"></i>
                            <i data-id="${response.data.divisions[response.data.divisions.length - 1]._id}" 
                            data-departmentid="${response.data._id}"
                            data-toggle="tooltip" data-placement="top" title="FSHIJ" class="fa fa-fw fa-trash deleteDivision"></i>
                            </span>
                        </li>`)
                    }
                })
            })
        },
        allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
        if (result.value) {
            swal({
                type: 'success',
                title: 'Divizioni u shtua me sukses',
            })
        }
    })
})

$(document).on('click', '.deleteDivision', function (e) {
    var id = $(this).data('id');
    var departmentid = $(this).data('departmentid');
    var divisionTitle = $(this).parent().parent().text();
    swal({
        title: 'A jeni të sigurte?',
        text: "Ju keni zgjedhur të fshini divizionin: " + divisionTitle,
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
                url: url + '/department/' + departmentid + '/division/' + id,
                type: 'DELETE',
                success: function (response) {
                    $('.tooltip').hide();
                    $('#' + id).remove();
                },
                error: function (err) {
                    swal({
                        type: 'error',
                        text: 'Problem me serverin'
                    })
                }
            })
        }
    })

})

$(document).on('click', '.editDivision', function (e) {
    var id = $(this).data('id');
    var departmentid = $(this).data('departmentid');
    swal({
        title: 'Shkruani emrin e divizionit',
        input: 'text',
        inputValue: $(this).parent().parent().text().trim(),
        showCancelButton: true,
        cancelButtonText: 'Anulo',
        confirmButtonText: 'Ndrysho',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        showLoaderOnConfirm: true,
        reverseButtons: true,
        preConfirm: (text) => {
            return new Promise((resolve) => {
                if (text === '') {
                    swal.showValidationError('Emri i divizionit nuk mund të jetë i zbrazët')
                    resolve()
                }
                var data = {
                    name: text
                }
                $.ajax({
                    type: "PUT",
                    url: url + "/department/" + departmentid + '/division/' + id,
                    data: data,
                    success: function (response) {
                        resolve(response)
                        $('#' + id).html(text + `
                        <span style="float: right;">
                        <i data-id="${id}" 
                        data-departmentid="${response.data._id}"
                        data-toggle="tooltip" data-placement="top" title="NDRYSHO" class="fa fa-fw fa-edit editDivision"></i>
                        <i data-id="${id}" 
                        data-departmentid="${response.data._id}"
                        data-toggle="tooltip" data-placement="top" title="FSHIJ" class="fa fa-fw fa-trash deleteDivision"></i>
                        </span>`)
                    },
                    error: function () {
                        resolve('Problem me serverin')
                    }
                })
            })
        },
        allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
        if (result.value) {
            swal({
                type: 'success',
                title: 'Divizioni u ndryshua me sukses',
            })
        }
    })
})