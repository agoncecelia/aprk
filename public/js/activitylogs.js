var url = 'http://' + window.location.host;
if (sessionStorage.getItem('role') == 'superadmin') {
    var userActivityLogs = $('#userActivityLogs');
    var documentActivityLogs = $('#documentActivityLogs');
    var loginActivityLogs = $('#loginActivityLogs');
    var from, to, fromDoc, toDoc, fromSession, toSession;
    var initial = true;
    var initialDoc = true;
    var initialSession = true;
    var currentTab = 'user';

    $('#activitylogs').click(function () {
        initial = true;
        initialDoc = true;
        initialSession = true;
        populateLogTables();
    })
    if (window.location.hash == '#activitylogs-pane') {
        populateLogTables();
    }
    $('body .closeModal').click(function (e) {
        $('.modal').modal('hide');
    })
    $('.closeModal').css('cursor', 'pointer');


    $('body').on('click', '.affectedUser', function (e) {
        e.preventDefault()
        var userid = $(this).parent().parent().data('affecteduserid');
        var id = $(this).parent().parent().attr('id');
        getUserDetails(userid, id);
    })
    $('body').on('click', '.superadmin', function (e) {
        e.preventDefault()
        var id = $(this).parent().parent().data('userid')
        getUserDetails(id);
    })
    $('.modal').on('hide.bs.modal', function() {
        $('#RexpiringSection').hide();
        $('#RexpiringHr').hide()
    })
    $('.modal').on('show.bs.modal', function () {
        $('#SdocumentTitle').hide();
        $('#Smunicipality').hide();
        $('#Sorigin').hide();
        $('#Saddressed').hide();
        $('#SdateOfDocumentArrival').hide();
        $('#SdateOfDocumentIssued').hide();
        $('#SdocumentDate').hide();
        $('#Sthrough').hide();
        $('#Sreceiver').hide();
        $('#SphysicalLocation').hide();
        $('#Sdepartment').hide();
        $('#Sdivision').hide();
        $('#Scomment').hide();
        $('#RfirstName').hide();
        $('#RlastName').hide();
        $('#RlastName').hide();
        $('#Rmunicipality').hide();
        $('#Rdepartment').hide();
        $('#Rdivision').hide();
        $('#Rrole').hide();
        $('#Rgender').hide();
        $('#Rstatus').hide();
        

    })
    function searchUserLogs(from, to) {

        $('#userActivityLogs').DataTable().destroy();
        $("#userActivityLogs tbody").empty();

        userActivityLogs.DataTable({
            dom: `<'row'<'col-sm-4'l><"#date-range.col-sm-4"><'col-sm-4'f>>
                <'row'<'col-sm-12'tr>>
                <'row'<'col-sm-5'i><'col-sm-7'p>>`,
            "language": {
                "lengthMenu": "Të shfaqura _MENU_ aktivitete",
                "zeroRecords": "Aktiviteti nuk u gjet!",
                "info": "Duke shfaqur faqen _PAGE_ nga _PAGES_",
                "infoEmpty": "Nuk ka aktivitete!",
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
                displayDateRange();
            },
            ajax: {
                "url": url + '/logs/user/' + from + '/' + to,
                "type": 'GET',
            },
            createdRow: function (row, data, dataIndex) {
                $(row).attr('data-userid', data.userId);
                $(row).attr('data-affecteduserid', data.affectedUserId);
            },
            order: [[3, "desc"]],
            columns: [
                {
                    "data": "userEmail",
                    render: function (data, type, row) {
                        if (type == 'display') {
                            data = `<a href="" class="superadmin">${data}</a>`
                        }
                        return data;
                    }
                },
                {
                    "data": "action",
                    render: function (data) {
                        if (data == 'read') {
                            return 'Lexoi'
                        } else if (data == 'create') {
                            return 'Krijoi'
                        } else if (data == 'delete') {
                            return 'Fshiu'
                        } else {
                            return 'Ndryshoi'
                        }
                        return data;
                    }
                },
                {
                    "data": "affectedUserEmail",
                    render: function (data, type, row) {
                        if (type == 'display') {
                            data = `<a href="" class="affectedUser">${data}</a>`
                        }
                        return data;
                    }
                },
                {
                    "data": "createdAt",
                    render: function (data, type, row) {
                        if (type === 'display' || type === 'filter') {
                            var d = moment(data);
                            return d.format('DD/MM/YYYY HH:mm:ss');
                        }
                        return data;
                    }
                }
            ]
        })
    }
    function searchDocumentLogs(from, to) {

        $('#documentActivityLogs').DataTable().destroy();
        $("#documentActivityLogs tbody").empty();

        documentActivityLogs.DataTable({
            dom: `<'row'<'col-sm-4'l><"#date-range-doc.col-sm-4"><'col-sm-4'f>>
                <'row'<'col-sm-12'tr>>
                <'row'<'col-sm-5'i><'col-sm-7'p>>`,
            "language": {
                "lengthMenu": "Të shfaqura _MENU_ aktivitete",
                "zeroRecords": "Aktiviteti nuk u gjet!",
                "info": "Duke shfaqur faqen _PAGE_ nga _PAGES_",
                "infoEmpty": "Nuk ka aktivitete!",
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
                displayDateRangeDoc();
            },
            ajax: {
                "url": url + '/logs/document/' + from + '/' + to,
                "type": 'GET',
            },
            createdRow: function (row, data, dataIndex) {
                $(row).attr('data-userid', data.userId);
                $(row).attr('data-affecteddocumentid', data.affectedDocumentId);
            },
            order: [[3, "desc"]],
            columns: [
                {
                    "data": "userEmail",
                    render: function (data, type, row) {
                        if (type == 'display') {
                            data = `<a href="" class="superadmin">${data}</a>`
                        }
                        return data;
                    }
                },
                {
                    "data": "action",
                    render: function (data) {
                        if (data == 'read') {
                            return 'Lexoi'
                        } else if (data == 'create') {
                            return 'Krijoi'
                        } else if (data == 'delete') {
                            return 'Fshiu'
                        } else {
                            return 'Ndryshoi'
                        }
                        return data;
                    }
                },
                {
                    "data": "affectedDocumentTitle",
                    render: function (data, type, row) {

                        if (type == 'display') {
                            data = `<a href="" class="documentLink">${data}</a>`
                        }
                        return data;
                    }
                },
                {
                    "data": "createdAt",
                    render: function (data, type, row) {
                        if (type === 'display' || type === 'filter') {
                            var d = moment(data);
                            return d.format('DD/MM/YYYY HH:mm:ss');
                        }
                        return data;
                    }
                }
            ]
        })
    }
    function searchSessionLogs(from, to) {

        $('#loginActivityLogs').DataTable().destroy();
        $("#loginActivityLogs tbody").empty();

        loginActivityLogs.DataTable({
            dom: `<'row'<'col-sm-4'l><"#date-range-session.col-sm-4"><'col-sm-4'f>>
                <'row'<'col-sm-12'tr>>
                <'row'<'col-sm-5'i><'col-sm-7'p>>`,
            "language": {
                "lengthMenu": "Të shfaqura _MENU_ aktivitete",
                "zeroRecords": "Aktiviteti nuk u gjet!",
                "info": "Duke shfaqur faqen _PAGE_ nga _PAGES_",
                "infoEmpty": "Nuk ka aktivitete!",
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
                displayDateRangeSession();
            },
            ajax: {
                "url": url + '/logs/session/' + from + '/' + to,
                "type": 'GET',
            },
            createdRow: function (row, data, dataIndex) {
                $(row).attr('data-userid', data.userId);
            },
            order: [[2, "desc"]],
            columns: [
                {
                    "data": "userEmail",
                    render: function (data, type, row) {
                        if (type == 'display') {
                            data = `<a href="" class="superadmin">${data}</a>`
                        }
                        return data;
                    }
                },
                {
                    "data": "action",
                    render: function (data) {
                        if (data == 'login') {
                            return 'Është kyçur'
                        } else {
                            return 'Është çkyçur'
                        }
                        return data;
                    }
                },
                {
                    "data": "createdAt",
                    render: function (data, type, row) {
                        if (type === 'display' || type === 'filter') {
                            var d = moment(data);
                            return d.format('DD/MM/YYYY HH:mm:ss');
                        }
                        return data;
                    }
                }
            ]
        })
    }

    $('body').on('click', '.documentLink', function (e) {
        e.preventDefault();
        var affectedDocumentId = $(this).parent().parent().data('affecteddocumentid');
        var id = $(this).parent().parent().attr('id');
        $.ajax({
            type: 'GET',
            url: url + '/document/' + affectedDocumentId,
            success: function (response) {
                var document = response.data;
                $('#LdocumentNumber').text(document.documentNumber);
                $('#LdocumentTitle').text(document.documentTitle);
                $('#Lmunicipality').text(document.municipality);
                $('#Lorigin').text(document.origin);
                $('#Laddressed').text(document.addressed);
                $('#LdateOfDocumentArrival').text(moment(document.dateOfDocumentArrival).format('DD/MM/YYYY'));
                $('#LdateOfDocumentIssued').text(moment(document.dateOfDocumentIssued).format('DD/MM/YYYY'));
                $('#LdocumentDate').text(moment(document.documentDate).format('DD/MM/YYYY'));
                $('#Lthrough').text(document.through);
                $('#Lreceiver').text(document.receiver);
                $('#LphysicalLocation').text(document.physicalLocation);
                $('#Ldepartment').text(document.department);
                $('#Ldivision').text(document.division);
                $('#Lcomment').text(document.comment);
                $('#Ldownload').attr("href", url + '/uploads/' + document.documentFileName)
                $('#LfileNameSpan').text(document.documentFileName)
                $('#viewDocumentLogsModal').modal();
                $.ajax({
                    type: 'GET',
                    url: url + '/logs/log/document/' + id,
                    success: function (response) {
                        if (response.data.lastSnapshot !== undefined) {
                            var oldDocument = response.data.lastSnapshot;
                            if (oldDocument.documentTitle != document.documentTitle) {
                                $('#SdocumentTitle').text(oldDocument.documentTitle);
                                $('#SdocumentTitle').show();
                            }
                            if (oldDocument.municipality != document.municipality) {
                                $('#Smunicipality').text(oldDocument.municipality);
                                $('#Smunicipality').show();
                            }
                            if (oldDocument.origin != document.origin) {
                                $('#Sorigin').text(oldDocument.origin);
                                $('#Sorigin').show();
                            }
                            if (oldDocument.addressed != document.addressed) {
                                $('#Saddressed').text(oldDocument.addressed);
                                $('#Saddressed').show();
                            }
                            if (oldDocument.dateOfDocumentArrival != document.dateOfDocumentArrival) {
                                $('#SdateOfDocumentArrival').text(moment(oldDocument.dateOfDocumentArrival).format('DD/MM/YYYY'));
                                $('#SdateOfDocumentArrival').show();
                            }
                            if (oldDocument.dateOfDocumentIssued != document.dateOfDocumentIssued) {
                                $('#SdateOfDocumentIssued').text(moment(oldDocument.dateOfDocumentIssued).format('DD/MM/YYYY'));
                                $('#SdateOfDocumentIssued').show();
                            }
                            if (oldDocument.documentDate != document.documentDate) {
                                $('#SdocumentDate').text(moment(oldDocument.documentDate).format('DD/MM/YYYY'));
                                $('#SdocumentDate').show();
                            }
                            if (oldDocument.through != document.through) {
                                $('#Sthrough').text(oldDocument.through);
                                $('#Sthrough').show();
                            }
                            if (oldDocument.receiver != document.receiver) {
                                $('#Sreceiver').text(oldDocument.receiver);
                                $('#Sreceiver').show();
                            }
                            if (oldDocument.physicalLocation != document.physicalLocation) {
                                $('#SphysicalLocation').text(oldDocument.physicalLocation);
                                $('#SphysicalLocation').show();
                            }
                            if (oldDocument.department != document.department) {
                                $('#Sdepartment').text(oldDocument.department);
                                $('#Sdepartment').show();
                            }
                            if (oldDocument.division != document.division) {
                                $('#Sdivision').text(oldDocument.division);
                                $('#Sdivision').show();
                            }
                            if (oldDocument.comment != document.comment) {
                                $('#Scomment').text(oldDocument.comment);
                                $('#Scomment').show();
                            }
                        }
                    }
                })
            }
        })
    })

    function getUserDetails(id, activityId) {
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
                $('#UfirstName').text(user.firstName);
                $('#UlastName').text(user.lastName);
                $('#Uemail').text(user.email);
                $('#Rusername').text(user.username);
                $('#Umunicipality').text(user.municipality);
                $('#Udepartment').text(user.department);
                $('#Udivision').text(user.division);
                if(user.expires) {
                    $('#RexpiringSection').css('display', 'flex');
                    $('#RexpiringHr').css('display', 'flex');
                    $('#Rexpiring').text(moment(user.expires).format('DD/MM/YYYY'));
                }
                $('#Urole').text(role);
                $('#Ustatus').text(status);
                $('#Ugender').text(gender);
                $('#viewUserLogsModal').modal();

                $.ajax({
                    type: 'GET',
                    url: url + '/logs/log/user/' + activityId,
                    success: function (response) {
                        var userSnapshot = response.data.userSnapshot;
                        if (response.data.userSnapshot !== undefined) {
                            if (userSnapshot.firstName != user.firstName) {
                                $('#RfirstName').text(userSnapshot.firstName);
                                $('#RfirstName').show();
                            }
                            if (userSnapshot.lastName != user.lastName) {
                                $('#RlastName').text(userSnapshot.lastName);
                                $('#RlastName').show();
                            }
                            if (userSnapshot.lastName != user.lastName) {
                                $('#RlastName').text(userSnapshot.lastName);
                                $('#RlastName').show();
                            }
                            if (userSnapshot.municipality != user.municipality) {
                                $('#Rmunicipality').text(userSnapshot.municipality);
                                $('#Rmunicipality').show();
                            }
                            if (userSnapshot.department != user.department) {
                                $('#Rdepartment').text(userSnapshot.department);
                                $('#Rdepartment').show();
                            }
                            if (userSnapshot.division != user.division) {
                                $('#Rdivision').text(userSnapshot.division);
                                $('#Rdivision').show();
                            }
                            if (userSnapshot.role != user.role) {
                                if (userSnapshot.role == 'superadmin') role = 'Super Administrator';
                                else if (userSnapshot.role == 'admin') role = 'Administrator';
                                else role = 'Perdorues i thjeshte'
                                $('#Rrole').text(role);
                                $('#Rrole').show();
                            }
                            if (userSnapshot.gender != user.gender) {
                                if (userSnapshot.gender == 'm') gender = 'Mashkull';
                                else if (userSnapshot.gender == 'f') gender = 'Femer';
                                else gender = '---';
                                $('#Rgender').text(gender);
                                $('#Rgender').show();
                            }
                            if (userSnapshot.status != user.status) {
                                if (userSnapshot.status == 'active') status = 'Aktiv';
                                else status = "Jo aktiv";
                                $('#Rstatus').text(status);
                                $('#Rstatus').show();
                            }
                        }
                    }
                })
            }
        })
    }
    function displayDateRange() {
        if (initial == false) {
            $('#date-range').html(`
                <div>
                <label id="label-daterange" for="daterange">Zgjedh periudhen: </label>
                <input type="text" name="daterange" id="daterange" class="date-range"/>
                </div>`)
            $('#daterange').daterangepicker({
                "showDropdowns": true,
                "showWeekNumbers": true,
                "showISOWeekNumbers": true,
                ranges: {
                    'Sot': [moment(), moment()],
                    'Dje': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '7 Dite': [moment().subtract(6, 'days'), moment()],
                    '30 Dite': [moment().subtract(29, 'days'), moment()],
                    'Ky Muaj': [moment().startOf('month'), moment().endOf('month')],
                    'Muaji i kaluar': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                "locale": {
                    "format": "DD/MM/YYYY",
                    "separator": " - ",
                    "applyLabel": "Kerko",
                    "cancelLabel": "Anulo",
                    "fromLabel": "Nga",
                    "toLabel": "Deri",
                    "customRangeLabel": "Zgjedh periudhen",
                    "weekLabel": "J",
                    "daysOfWeek": [
                        "Di",
                        "He",
                        "Ma",
                        "Me",
                        "En",
                        "Pr",
                        "Sht"
                    ],
                    "monthNames": [
                        "Janar",
                        "Shkurt",
                        "Mars",
                        "Prill",
                        "Maj",
                        "Qershor",
                        "Korrik",
                        "Gusht",
                        "Shtator",
                        "Tetor",
                        "Nentor",
                        "Dhjetor"
                    ],
                    "firstDay": 1
                },
                startDate: from,
                endDate: to
            }, function (start, end, label) {
                from = new Date(start);
                to = new Date(end);
                searchUserLogs(from, to);
            });
        } else {
            $('#date-range').html(`
                <div>
                <label id="label-daterange" for="daterange">Zgjedh periudhen: </label>
                <input type="text" name="daterange" id="daterange" class="date-range"/>
                </div>`)
            $('#daterange').daterangepicker({
                "showDropdowns": true,
                "showWeekNumbers": true,
                "showISOWeekNumbers": true,
                ranges: {
                    'Sot': [moment(), moment()],
                    'Dje': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '7 Dite': [moment().subtract(6, 'days'), moment()],
                    '30 Dite': [moment().subtract(29, 'days'), moment()],
                    'Ky Muaj': [moment().startOf('month'), moment().endOf('month')],
                    'Muaji i kaluar': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                "locale": {
                    "format": "DD/MM/YYYY",
                    "separator": " - ",
                    "applyLabel": "Kerko",
                    "cancelLabel": "Anulo",
                    "fromLabel": "Nga",
                    "toLabel": "Deri",
                    "customRangeLabel": "Zgjedh periudhen",
                    "weekLabel": "J",
                    "daysOfWeek": [
                        "Di",
                        "He",
                        "Ma",
                        "Me",
                        "En",
                        "Pr",
                        "Sht"
                    ],
                    "monthNames": [
                        "Janar",
                        "Shkurt",
                        "Mars",
                        "Prill",
                        "Maj",
                        "Qershor",
                        "Korrik",
                        "Gusht",
                        "Shtator",
                        "Tetor",
                        "Nentor",
                        "Dhjetor"
                    ],
                },
                "firstDay": 1,
                startDate: moment().subtract(6, 'days'),
                endDate: moment()
            }, function (start, end, label) {
                from = new Date(start);
                to = new Date(end);
                searchUserLogs(from, to);
            });
        }
    }
    function displayDateRangeDoc() {
        if (initialDoc == false) {
            $('#date-range-doc').html(`
                <div>
                <label for="daterange">Zgjedh periudhen: </label>
                <input type="text" name="daterange" id="daterangedoc" class="date-range"/>
                </div>`)
            $('#daterangedoc').daterangepicker({
                "showDropdowns": true,
                "showWeekNumbers": true,
                "showISOWeekNumbers": true,
                ranges: {
                    'Sot': [moment(), moment()],
                    'Dje': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '7 Dite': [moment().subtract(6, 'days'), moment()],
                    '30 Dite': [moment().subtract(29, 'days'), moment()],
                    'Ky Muaj': [moment().startOf('month'), moment().endOf('month')],
                    'Muaji i kaluar': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                "locale": {
                    "format": "DD/MM/YYYY",
                    "separator": " - ",
                    "applyLabel": "Kerko",
                    "cancelLabel": "Anulo",
                    "fromLabel": "Nga",
                    "toLabel": "Deri",
                    "customRangeLabel": "Zgjedh periudhen",
                    "weekLabel": "J",
                    "daysOfWeek": [
                        "Di",
                        "He",
                        "Ma",
                        "Me",
                        "En",
                        "Pr",
                        "Sht"
                    ],
                    "monthNames": [
                        "Janar",
                        "Shkurt",
                        "Mars",
                        "Prill",
                        "Maj",
                        "Qershor",
                        "Korrik",
                        "Gusht",
                        "Shtator",
                        "Tetor",
                        "Nentor",
                        "Dhjetor"
                    ],
                    "firstDay": 1
                },
                startDate: from,
                endDate: to
            }, function (start, end, label) {
                from = new Date(start);
                to = new Date(end);
                searchDocumentLogs(from, to);
            });
        } else {
            $('#date-range-doc').html(`
                <div>
                <label id="label-daterange" for="daterange">Zgjedh periudhen: </label>
                <input type="text" name="daterange" id="daterangedoc" class="date-range"/>
                </div>`)
            $('#daterangedoc').daterangepicker({
                "showDropdowns": true,
                "showWeekNumbers": true,
                "showISOWeekNumbers": true,
                ranges: {
                    'Sot': [moment(), moment()],
                    'Dje': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '7 Dite': [moment().subtract(6, 'days'), moment()],
                    '30 Dite': [moment().subtract(29, 'days'), moment()],
                    'Ky Muaj': [moment().startOf('month'), moment().endOf('month')],
                    'Muaji i kaluar': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                "locale": {
                    "format": "DD/MM/YYYY",
                    "separator": " - ",
                    "applyLabel": "Kerko",
                    "cancelLabel": "Anulo",
                    "fromLabel": "Nga",
                    "toLabel": "Deri",
                    "customRangeLabel": "Zgjedh periudhen",
                    "weekLabel": "J",
                    "daysOfWeek": [
                        "Di",
                        "He",
                        "Ma",
                        "Me",
                        "En",
                        "Pr",
                        "Sht"
                    ],
                    "monthNames": [
                        "Janar",
                        "Shkurt",
                        "Mars",
                        "Prill",
                        "Maj",
                        "Qershor",
                        "Korrik",
                        "Gusht",
                        "Shtator",
                        "Tetor",
                        "Nentor",
                        "Dhjetor"
                    ],
                    "firstDay": 1
                },
                startDate: moment().subtract(6, 'days'),
                endDate: moment()
            }, function (start, end, label) {
                from = new Date(start);
                to = new Date(end);
                searchDocumentLogs(from, to);
            });
        }
    }
    function displayDateRangeSession() {
        if (initialSession == false) {
            $('#date-range-session').html(`
                <div>
                <label for="daterange">Zgjedh periudhen: </label>
                <input type="text" name="daterange" id="daterangesession" class="date-range"/>
                </div>`)
            $('#daterangesession').daterangepicker({
                "showDropdowns": true,
                "showWeekNumbers": true,
                "showISOWeekNumbers": true,
                ranges: {
                    'Sot': [moment(), moment()],
                    'Dje': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '7 Dite': [moment().subtract(6, 'days'), moment()],
                    '30 Dite': [moment().subtract(29, 'days'), moment()],
                    'Ky Muaj': [moment().startOf('month'), moment().endOf('month')],
                    'Muaji i kaluar': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                "locale": {
                    "format": "DD/MM/YYYY",
                    "separator": " - ",
                    "applyLabel": "Kerko",
                    "cancelLabel": "Anulo",
                    "fromLabel": "Nga",
                    "toLabel": "Deri",
                    "customRangeLabel": "Zgjedh periudhen",
                    "weekLabel": "J",
                    "daysOfWeek": [
                        "Di",
                        "He",
                        "Ma",
                        "Me",
                        "En",
                        "Pr",
                        "Sht"
                    ],
                    "monthNames": [
                        "Janar",
                        "Shkurt",
                        "Mars",
                        "Prill",
                        "Maj",
                        "Qershor",
                        "Korrik",
                        "Gusht",
                        "Shtator",
                        "Tetor",
                        "Nentor",
                        "Dhjetor"
                    ],
                    "firstDay": 1
                },
                startDate: from,
                endDate: to
            }, function (start, end, label) {
                from = new Date(start);
                to = new Date(end);
                searchSessionLogs(from, to);
            });
        } else {
            $('#date-range-session').html(`
                <div>
                <label id="label-daterange" for="daterange">Zgjedh periudhen: </label>
                <input type="text" name="daterange" id="daterangesession" class="date-range"/>
                </div>`)
            $('#daterangesession').daterangepicker({
                "showDropdowns": true,
                "showWeekNumbers": true,
                "showISOWeekNumbers": true,
                ranges: {
                    'Sot': [moment(), moment()],
                    'Dje': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                    '7 Dite': [moment().subtract(6, 'days'), moment()],
                    '30 Dite': [moment().subtract(29, 'days'), moment()],
                    'Ky Muaj': [moment().startOf('month'), moment().endOf('month')],
                    'Muaji i kaluar': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },
                "locale": {
                    "format": "DD/MM/YYYY",
                    "separator": " - ",
                    "applyLabel": "Kerko",
                    "cancelLabel": "Anulo",
                    "fromLabel": "Nga",
                    "toLabel": "Deri",
                    "customRangeLabel": "Zgjedh periudhen",
                    "weekLabel": "J",
                    "daysOfWeek": [
                        "Di",
                        "He",
                        "Ma",
                        "Me",
                        "En",
                        "Pr",
                        "Sht"
                    ],
                    "monthNames": [
                        "Janar",
                        "Shkurt",
                        "Mars",
                        "Prill",
                        "Maj",
                        "Qershor",
                        "Korrik",
                        "Gusht",
                        "Shtator",
                        "Tetor",
                        "Nentor",
                        "Dhjetor"
                    ],
                    "firstDay": 1
                },
                startDate: moment().subtract(6, 'days'),
                endDate: moment()
            }, function (start, end, label) {
                from = new Date(start);
                to = new Date(end);
                searchSessionLogs(from, to);
            });
        }
    }
    function populateLogTables() {
        $('#userActivityLogs').DataTable().destroy();
        $('#userActivityLogs tbody').empty();
        $('#documentActivityLogs').DataTable().destroy();
        $('#documentActivityLogs tbody').empty();
        $('#loginActivityLogs').DataTable().destroy();
        $('#loginActivityLogs tbody').empty();
        userActivityLogs.DataTable({
            dom: `<'row'<'col-sm-4'l><"#date-range.col-sm-4"><'col-sm-4'f>>
                <'row'<'col-sm-12'tr>>
                <'row'<'col-sm-5'i><'col-sm-7'p>>`,
            initComplete: function () {
                displayDateRange();
                initial = false;
            },
            "language": {
                "lengthMenu": "Të shfaqura _MENU_ aktivitete",
                "zeroRecords": "Aktiviteti nuk u gjet!",
                "info": "Duke shfaqur faqen _PAGE_ nga _PAGES_",
                "infoEmpty": "Nuk ka aktivitete!",
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
            ajax: {
                "url": url + '/logs/user/' + new Date(moment().subtract(6, 'days')) + '/' + new Date(moment()),
                "type": 'GET'
            },
            createdRow: function (row, data, dataIndex) {
                $(row).attr('data-userid', data.userId);
                $(row).attr('data-affecteduserid', data.affectedUserId);
            },
            order: [[3, "desc"]],
            rowId: '_id',
            columns: [
                {
                    "data": "userEmail",
                    render: function (data, type, row) {
                        if (type == 'display') {
                            data = `<a href="" class="superadmin">${data}</a>`
                        }
                        return data;
                    }
                },
                {
                    "data": "action",
                    render: function (data) {
                        if (data == 'read') {
                            return 'Lexoi'
                        } else if (data == 'create') {
                            return 'Krijoi'
                        } else if (data == 'delete') {
                            return 'Fshiu'
                        } else {
                            return 'Ndryshoi'
                        }
                        return data;
                    }
                },
                {
                    "data": "affectedUserEmail",
                    render: function (data, type, row) {
                        if (type == 'display') {
                            data = `<a href="" class="affectedUser">${data}</a>`
                        }
                        return data;
                    }
                },
                {
                    "data": "createdAt",
                    render: function (data, type, row) {
                        if (type === 'display' || type === 'filter') {
                            var d = moment(data);
                            return d.format('DD/MM/YYYY HH:mm:ss');
                        }
                        return data;
                    }
                }
            ]
        })

        documentActivityLogs.DataTable({
            dom: `<'row'<'col-sm-4'l><"#date-range-doc.col-sm-4"><'col-sm-4'f>>
                <'row'<'col-sm-12'tr>>
                <'row'<'col-sm-5'i><'col-sm-7'p>>`,
            "language": {
                "lengthMenu": "Të shfaqura _MENU_ aktivitete",
                "zeroRecords": "Aktiviteti nuk u gjet!",
                "info": "Duke shfaqur faqen _PAGE_ nga _PAGES_",
                "infoEmpty": "Nuk ka aktivitete!",
                "infoFiltered": "(filtruar nga _MAX_ total aktivitete)",
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
                displayDateRangeDoc();
                initialDoc = false;
            },
            ajax: {
                "url": url + '/logs/document/' + new Date(moment().subtract(6, 'days')) + '/' + new Date(moment()),
                "type": 'GET'
            },
            createdRow: function (row, data, dataIndex) {
                $(row).attr('data-userid', data.userId);
                $(row).attr('data-affecteddocumentid', data.affectedDocumentId);
            },
            order: [[3, "desc"]],
            rowId: '_id',
            columns: [
                {
                    "data": "userEmail",
                    render: function (data, type, row) {
                        if (type == 'display') {
                            data = `<a href="" class="superadmin">${data}</a>`
                        }
                        return data;
                    }
                },
                {
                    "data": "action",
                    render: function (data) {
                        if (data == 'read') {
                            return 'Lexoi'
                        } else if (data == 'create') {
                            return 'Krijoi'
                        } else if (data == 'delete') {
                            return 'Fshiu'
                        } else {
                            return 'Ndryshoi'
                        }
                        return data;
                    }
                },
                {
                    "data": "affectedDocumentTitle",
                    render: function (data, type, row) {

                        if (type == 'display') {
                            data = `<a href="" class="documentLink">${data}</a>`
                        }
                        return data;
                    }
                },
                {
                    "data": "createdAt",
                    render: function (data, type, row) {
                        if (type === 'display' || type === 'filter') {
                            var d = moment(data);
                            return d.format('DD/MM/YYYY HH:mm:ss');;
                        }
                        return data;
                    }
                }
            ]
        })
        loginActivityLogs.DataTable({
            dom: `<'row'<'col-sm-4'l><"#date-range-session.col-sm-4"><'col-sm-4'f>>
                <'row'<'col-sm-12'tr>>
                <'row'<'col-sm-5'i><'col-sm-7'p>>`,
            "language": {
                "lengthMenu": "Të shfaqura _MENU_ aktivitete",
                "zeroRecords": "Aktiviteti nuk u gjet!",
                "info": "Duke shfaqur faqen _PAGE_ nga _PAGES_",
                "infoEmpty": "Nuk ka aktivitete!",
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
                displayDateRangeSession();
                initialSession = false;
            },
            ajax: {
                "url": url + '/logs/session/' + new Date(moment().subtract(6, 'days')) + '/' + new Date(moment()),
                "type": 'GET'
            },
            createdRow: function (row, data, dataIndex) {
                $(row).attr('data-userid', data.userId);
            },
            order: [[2, "desc"]],
            columns: [
                {
                    "data": "userEmail",
                    render: function (data, type, row) {
                        if (type == 'display') {
                            data = `<a href="" class="superadmin">${data}</a>`
                        }
                        return data;
                    }
                },
                {
                    "data": "action",
                    render: function (data) {
                        if (data == 'login') {
                            return 'Është kyçur'
                        } else {
                            return 'Është çkyçur'
                        }
                        return data;
                    }
                },
                {
                    "data": "createdAt",
                    render: function (data, type, row) {
                        if (type === 'display' || type === 'filter') {
                            var d = moment(data);
                            return d.format('DD/MM/YYYY HH:mm:ss');
                        }
                        return data;
                    }
                }
            ]
        })
    }
}