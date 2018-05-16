var url = 'http://' + window.location.host;

$('body').find('#divisionSelectionDoc').hide();


var municipalities = [
    'Deçan', 'Dragash', 'Ferizaj', 'Fushë Kosovë', 'Gjakovë', 'Gjilan', 'Gllogoc', 'Graçanicë', 'Hani i Elezit', 'Istog', 'Junik', 'Kamenicë', 'Kaçanik', 'Klinë', 'Kllokot', 'Leposaviq', 'Lipjan', 'Malishevë', 'Mamushë', 'Mitrovicë', 'Novobërdë', 'Obiliq', 'Partesh', 'Pejë', 'Podujevë', 'Prishtinë', 'Prizren', 'Rahovec', 'Ranillugë', 'Shtime', 'Shtërpcë', 'Skënderaj', 'Suhareka', 'Viti', 'Vushtrri', 'Zubin Potok', 'Zveçan'
]
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
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
});

$('body').on('click', '#sidenavToggler', function (e) {
    $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
})
$('.modal').on('hide.bs.modal', function () {
    $(this).find('form').trigger('reset');
    $(this).find('form').removeClass('was-validated');
    $('#departmentAns').empty();
    $('#departmentAns').append($("<option></option>")
        .attr("value", "")
        .text("Zgjedhni departamentin"));
    $('#departmentDoc').empty();
    $('#departmentDoc').append($("<option></option>")
        .attr("value", "")
        .text("Zgjedhni departamentin"));
    $('body #UdepartmentDoc').empty();
    $('#UAdepartmentDoc').empty();
    $('body #UdepartmentDoc').append($("<option></option>")
        .attr("value", "")
        .text("Zgjedhni departamentin"));
    $('#accordion').remove();
    $('#accordionList').remove();
    $('#editingUserDetails').remove();
    $('#AeditingUserDetails').remove();
    $('#editingUserHr').remove();
    $('#AeditingUserDetails').remove();
    $('#AeditingUserHr').remove();
    $('#Vuser').text('');
    $('body #divisionSelectionDoc').hide();
    $('#divisionSelection').empty();
    $('#divisionSelection').hide();

})

var starting, ending;
var initialLoad = true;
var documentsTable = $('#documentsTable');


$('#documents').click(function() {
    initialLoad=true;
    populateDocuments();
})

if (window.location.hash == '#documents-pane') {
    populateDocuments();
}
function populateDocuments() {
    $('#documentsTable').DataTable().destroy();
    $('#documentsTable tbody').empty();
    if (sessionStorage.getItem('role') == 'user') {
        documentsTable.DataTable({
            dom: `<'row'<'col-sm-4'l><"#documents-date-range.col-sm-4"><'col-sm-4'f>>
                    <'row'<'col-sm-12'tr>>
                    <'row'<'col-sm-5'i><'col-sm-7'p>>`,
            "language": {
                "lengthMenu": "Të shfaqura _MENU_ dokumente",
                "zeroRecords": "Dokumenti nuk u gjet!",
                "info": "Duke shfaqur faqen _PAGE_ nga _PAGES_",
                "infoEmpty": "Nuk ka dokumente!",
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
                $('[data-placement="top"]').tooltip({
                    template: '<div class="tooltip" role="tooltip" style="pointer-events: none;"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
                    trigger: 'hover'
                })
                $('[data-placement="top"]').tooltip({
                })
                displayDateRanges();
                initialLoad = false;
                $('#documentsTable tr').each(function (index, element) {
                    if ($(element).data('documentnumber') != undefined) {
                        if ($(element).data('documentnumber').toString().indexOf('/') !== -1) {
                            $(element).find('td:last').html(`
                                <i data-toggle="tooltip" data-placement="top" title="NDRYSHO" class="fa fa-fw fa-edit editAnswer"></i>
                                <i data-toggle="tooltip" data-placement="top" title="SHIKO" class="fa fa-fw fa-eye viewAnswer"></i>
                                <i data-toggle="tooltip" data-placement="top" title="FSHIJ" class="fa fa-fw fa-trash deleteAnswer"></i>
                            `)
                        }
                    }
                })
            },
            ajax: {
                "url": url + '/document/' + new Date(moment().subtract(12, 'month').startOf('month')) + '/' + new Date(moment()),
                "type": 'GET'
            },
            createdRow: function (row, data, dataIndex) {
                $(row).attr('data-documentNumber', data.documentNumber)
                if (data.answers && data.answers.length > 0) {
                    for (var i = 0; i < data.answers.length; i++) {
                        var obj = {
                            documentNumber: data.answers[i].answerNumber,
                            documentTitle: data.answers[i].answerTitle,
                            municipality: data.answers[i].municipality,
                            origin: data.answers[i].origin,
                            addressed: data.answers[i].addressed,
                            physicalLocation: data.answers[i].physicalLocation,
                            department: data.answers[i].department,
                            through: data.answers[i].through,
                            receiver: data.answers[i].receiver,
                            division: data.answers[i].division,
                            documentDate: data.answers[i].answerDate,
                            createdAt: data.answers[i].createdAt,
                            comment: data.answers[i].comment
                        }
                        documentsTable.DataTable().row.add(obj).node().id = data.answers[i]._id;
                        documentsTable.DataTable().draw(false);
                    }
                }
            },
            rowId: '_id',
            responsive: true,
            columnDefs: [
                {
                    "targets": 13,
                    "data": null,
                    "className": 'all',
                    "defaultContent": `<i class="fa fa-fw fa-eye viewDocument"></i>`
                }
            ],
            order: [[9, "desc"]],
            columns: [
                { "data": "documentNumber" },
                { "data": "documentTitle" },
                { "data": "municipality" },
                { "data": "origin" },
                { "data": "addressed" },
                { "data": "physicalLocation" },
                { "data": "through" },
                { "data": "receiver" },
                {
                    "data": "documentDate",
                    render: function (data, type, row) {
                        if (type === 'display' || type === 'filter') {
                            var d = moment(data);
                            return d.format('DD/MM/YYYY');
                        }
                        return data;
                    }
                },
                {
                    "data": "createdAt",
                    render: function (data, type, row) {
                        if (type === 'display' || type === 'filter') {
                            var d = moment(data);
                            return d.format('DD/MM/YYYY');
                        }
                        return data;
                    }
                },
                { "data": "department" },
                { "data": "division" },
                {
                    "data": "comment",
                    render: function (d, type, row) {
                        if (!d) {
                            return '';
                        } else if (type === 'display' && d.length > 40) {
                            return '' + d.substr(0, 40) + '...';
                        } else {
                            return d;
                        }
                    }
                }
            ]
        })
    }
    else {
        documentsTable.DataTable({
            dom: `  <'row'<'col-sm-4'l><"#documents-date-range.col-sm-4"><'col-sm-4'f>>
                    <'row'<'col-sm-12'tr>>
                    <'row'<'col-sm-5'i><'col-sm-7'p>>`,
            "language": {
                "lengthMenu": "Të shfaqura _MENU_ dokumente",
                "zeroRecords": "Dokumenti nuk u gjet!",
                "info": "Duke shfaqur faqen _PAGE_ nga _PAGES_",
                "infoEmpty": "Nuk ka dokumente!",
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
                "url": url + '/document/' + new Date(moment().subtract(12, 'month').startOf('month')) + '/' + new Date(moment()),
                "type": 'GET'
            },
            createdRow: function (row, data, dataIndex) {
                $(row).attr('data-documentNumber', data.documentNumber)
                if (data.documentNumber.indexOf('/') != -1) {
                    $(row).attr('docnr', data.documentNumber.slice(0, data.documentNumber.indexOf('/')))
                }
                if (data.answers && data.answers.length > 0) {
                    for (var i = 0; i < data.answers.length; i++) {
                        var obj = {
                            documentNumber: data.answers[i].answerNumber,
                            documentTitle: data.answers[i].answerTitle,
                            municipality: data.answers[i].municipality,
                            origin: data.answers[i].origin,
                            addressed: data.answers[i].addressed,
                            physicalLocation: data.answers[i].physicalLocation,
                            department: data.answers[i].department,
                            through: data.answers[i].through,
                            receiver: data.answers[i].receiver,
                            division: data.answers[i].division,
                            documentDate: data.answers[i].answerDate,
                            createdAt: data.answers[i].createdAt,
                            comment: data.answers[i].comment
                        }
                        documentsTable.DataTable().row.add(obj).node().id = data.answers[i]._id;
                        documentsTable.DataTable().draw(false);
                    }
                }
            },
            initComplete: function () {
                $('[data-placement="top"]').tooltip({
                    template: '<div class="tooltip" role="tooltip" style="pointer-events: none;"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
                    trigger: 'hover'
                })
                $('[data-placement="top"]').tooltip({
                })
                displayDateRanges();
                initialLoad = false;
                $('#documentsTable tr').each(function (index, element) {
                    if ($(element).data('documentnumber') != undefined) {
                        if ($(element).data('documentnumber').toString().indexOf('/') !== -1) {
                            $(element).find('td:last').html(`
                                <i data-toggle="tooltip" data-placement="top" title="NDRYSHO" class="fa fa-fw fa-edit editAnswer"></i>
                                <i data-toggle="tooltip" data-placement="top" title="SHIKO" class="fa fa-fw fa-eye viewAnswer"></i>
                                <i data-toggle="tooltip" data-placement="top" title="FSHIJ" class="fa fa-fw fa-trash deleteAnswer"></i>
                            `)
                        }
                    }
                })
            },
            rowId: '_id',
            responsive: true,
            columnDefs: [
                {
                    "targets": 13,
                    "className": 'all',
                    "data": null,
                    "defaultContent":
                        `<i data-toggle="tooltip" data-placement="top" title="NDRYSHO" class="fa fa-fw fa-edit editDocument"></i>
                        <i data-toggle="tooltip" data-placement="top" title="SHIKO" class="fa fa-fw fa-eye viewDocument"></i>
                        <i data-toggle="tooltip" data-placement="top" title="FSHIJ" class="fa fa-fw fa-trash deleteDocument"></i>
                        <i data-toggle="tooltip" data-placement="top" title="DËRGO" class="fa fa-fw fa-at sendEmail"></i>
                        <i data-toggle="tooltip" data-placement="top" title="SHTO PËRGJIGJE" class="fa fa-fw fa-plus addAnswer"></i>`
                }
            ],
            order: [[9, "desc"]],
            columns: [
                { "data": "documentNumber" },
                { "data": "documentTitle" },
                { "data": "municipality" },
                { "data": "origin" },
                { "data": "addressed" },
                { "data": "physicalLocation" },
                { "data": "through" },
                { "data": "receiver" },
                {
                    "data": "documentDate",
                    render: function (data, type, row) {
                        if (type === 'display' || type === 'filter') {
                            var d = moment(data);
                            return d.format('DD/MM/YYYY');
                        }
                        return data;
                    }
                },
                {
                    "data": "createdAt",
                    render: function (data, type, row) {
                        if (type === 'display' || type === 'filter') {
                            var d = moment(data);
                            return d.format('DD/MM/YYYY');
                        }
                        return data;
                    }
                },
                { "data": "department" },
                { "data": "division" },
                {
                    "data": "comment",
                    render: function (d, type, row) {
                        if (!d) {
                            return '';
                        } else if (type === 'display' && d.length > 40) {
                            return '' + d.substr(0, 40) + '...';
                        } else {
                            return d;
                        }
                    }
                }
            ]
        })
    }
    $('#documentsTable').DataTable().columns().every(function () {
        var that = this;
        $('input', this.footer()).on('keyup change', function () {
            if (that.search() !== this.value) {
                that.search(this.value)
                    .draw();
            }
        });
    });
}


function displayDateRanges() {
    if (initialLoad == false) {
        $('#documents-date-range').html(`
            <div>
            <label id="label-daterange" for="docdaterange">Zgjedh periudhen: </label>
            <input type="text" name="daterange" id="docdaterange" class="date-range"/>
            </div>`)
        $('#docdaterange').daterangepicker({
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
            startDate: starting,
            endDate: ending
        }, function (start, end, label) {
            starting = new Date(start);
            ending = new Date(end);
            showDocuments(starting, ending);
        });
    } else {
        $('#documents-date-range').html(`
            <div>
            <label id="label-daterange" for="docdaterange">Zgjedh periudhen: </label>
            <input type="text" name="daterange" id="docdaterange" class="date-range"/>
            </div>`)
        $('#docdaterange').daterangepicker({
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
                "firstDay": 1,
            },
            startDate: moment().subtract(12, 'month'),
            endDate: moment()
        }, function (start, end, label) {
            starting = new Date(start);
            ending = new Date(end);
            showDocuments(starting, ending);
        });
    }
}

function showDocuments(starting, ending) {
    documentsTable.DataTable().destroy();
    $('#documentsTable tbody').empty();
    if (sessionStorage.getItem('role') == 'user') {
        documentsTable.DataTable({
            dom: `<'row'<'col-sm-4'l><"#documents-date-range.col-sm-4"><'col-sm-4'f>>
                    <'row'<'col-sm-12'tr>>
                    <'row'<'col-sm-5'i><'col-sm-7'p>>`,
            "language": {
                "lengthMenu": "Të shfaqura _MENU_ dokumente",
                "zeroRecords": "Dokumenti nuk u gjet!",
                "info": "Duke shfaqur faqen _PAGE_ nga _PAGES_",
                "infoEmpty": "Nuk ka dokumente!",
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
                $('[data-toggle="tooltip"]').tooltip({
                    template: '<div class="tooltip" role="tooltip" style="pointer-events: none;"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
                    trigger: 'hover'
                })
                $('[data-toggle="tooltip"]').tooltip({
                })
                displayDateRanges();
                initialLoad = false;
                $('#documentsTable tr').each(function (index, element) {
                    if ($(element).data('documentnumber') != undefined) {
                        if ($(element).data('documentnumber').toString().indexOf('/') !== -1) {
                            $(element).find('td:last').html(`
                            <i data-toggle="tooltip" data-placement="top" title="NDRYSHO" class="fa fa-fw fa-edit editAnswer"></i>
                            <i data-toggle="tooltip" data-placement="top" title="SHIKO" class="fa fa-fw fa-eye viewAnswer"></i>
                            <i data-toggle="tooltip" data-placement="top" title="FSHIJ" class="fa fa-fw fa-trash deleteAnswer"></i>
                            `)
                        }
                    }
                })
            },
            ajax: {
                "url": url + '/document/' + starting + '/' + ending,
                "type": 'GET'
            },
            createdRow: function (row, data, dataIndex) {
                $(row).attr('data-documentNumber', data.documentNumber)
                if (data.answers && data.answers.length > 0) {
                    for (var i = 0; i < data.answers.length; i++) {
                        var obj = {
                            documentNumber: data.answers[i].answerNumber,
                            documentTitle: data.answers[i].answerTitle,
                            municipality: data.answers[i].municipality,
                            origin: data.answers[i].origin,
                            addressed: data.answers[i].addressed,
                            physicalLocation: data.answers[i].physicalLocation,
                            department: data.answers[i].department,
                            through: data.answers[i].through,
                            receiver: data.answers[i].receiver,
                            division: data.answers[i].division,
                            documentDate: data.answers[i].answerDate,
                            createdAt: data.answers[i].createdAt,
                            comment: data.answers[i].comment
                        }
                        documentsTable.DataTable().row.add(obj).node().id = data.answers[i]._id;
                        documentsTable.DataTable().draw(false);
                    }
                }
            },
            rowId: '_id',
            responsive: true,
            columnDefs: [
                {
                    "targets": 13,
                    "className": 'all',
                    "data": null,
                    "defaultContent": `<i class="fa fa-fw fa-eye view"></i>`
                }
            ],
            order: [[9, "desc"]],
            columns: [
                { "data": "documentNumber" },
                { "data": "documentTitle" },
                { "data": "municipality" },
                { "data": "origin" },
                { "data": "addressed" },
                { "data": "physicalLocation" },
                { "data": "through" },
                { "data": "receiver" },
                {
                    "data": "documentDate",
                    render: function (data, type, row) {
                        if (type === 'display' || type === 'filter') {
                            var d = moment(data);
                            return d.format('DD/MM/YYYY');
                        }
                        return data;
                    }
                },
                {
                    "data": "createdAt",
                    render: function (data, type, row) {
                        if (type === 'display' || type === 'filter') {
                            var d = moment(data);
                            return d.format('DD/MM/YYYY');
                        }
                        return data;
                    }
                },
                { "data": "department" },
                { "data": "division" },
                {
                    "data": "comment",
                    render: function (d, type, row) {
                        if (!d) {
                            return '';
                        } else if (type === 'display' && d.length > 40) {
                            return '' + d.substr(0, 40) + '...';
                        } else {
                            return d;
                        }
                    }
                }
            ]
        })
    }
    else {
        documentsTable.DataTable({
            dom: `<'row'<'col-sm-4'l><"#documents-date-range.col-sm-4"><'col-sm-4'f>>
                    <'row'<'col-sm-12'tr>>
                    <'row'<'col-sm-5'i><'col-sm-7'p>>`,
            "language": {
                "lengthMenu": "Të shfaqura _MENU_ dokumente",
                "zeroRecords": "Dokumenti nuk u gjet!",
                "info": "Duke shfaqur faqen _PAGE_ nga _PAGES_",
                "infoEmpty": "Nuk ka dokumente!",
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
                "url": url + '/document/' + starting + '/' + ending,
                "type": 'GET'
            },
            createdRow: function (row, data, dataIndex) {
                $(row).attr('data-documentNumber', data.documentNumber)
                if (data.answers && data.answers.length > 0) {
                    for (var i = 0; i < data.answers.length; i++) {
                        var obj = {
                            documentNumber: data.answers[i].answerNumber,
                            documentTitle: data.answers[i].answerTitle,
                            municipality: data.answers[i].municipality,
                            origin: data.answers[i].origin,
                            addressed: data.answers[i].addressed,
                            physicalLocation: data.answers[i].physicalLocation,
                            department: data.answers[i].department,
                            through: data.answers[i].through,
                            receiver: data.answers[i].receiver,
                            division: data.answers[i].division,
                            documentDate: data.answers[i].answerDate,
                            createdAt: data.answers[i].createdAt,
                            comment: data.answers[i].comment
                        }
                        documentsTable.DataTable().row.add(obj).node().id = data.answers[i]._id;
                        documentsTable.DataTable().draw(false);
                    }
                }
            },
            initComplete: function () {
                $('[data-toggle="tooltip"]').tooltip({
                    template: '<div class="tooltip" role="tooltip" style="pointer-events: none;"><div class="arrow"></div><div class="tooltip-inner"></div></div>',
                    trigger: 'hover'
                })
                $('[data-toggle="tooltip"]').tooltip({
                })
                displayDateRanges();
                initialLoad = false;
                $('#documentsTable tr').each(function (index, element) {
                    if ($(element).data('documentnumber') != undefined) {
                        if ($(element).data('documentnumber').toString().indexOf('/') !== -1) {
                            $(element).find('td:last').html(`
                            <i data-toggle="tooltip" data-placement="top" title="NDRYSHO" class="fa fa-fw fa-edit editAnswer"></i>
                            <i data-toggle="tooltip" data-placement="top" title="SHIKO" class="fa fa-fw fa-eye viewAnswer"></i>
                            <i data-toggle="tooltip" data-placement="top" title="FSHIJ" class="fa fa-fw fa-trash deleteAnswer"></i>
                            `)
                        }
                    }
                })
            },
            rowId: '_id',
            responsive: true,
            columnDefs: [
                {
                    "targets": 13,
                    "className": 'all',
                    "data": null,
                    "defaultContent":
                        `<i data-toggle="tooltip" data-placement="top" title="NDRYSHO" class="fa fa-fw fa-edit editDocument"></i>
                    <i data-toggle="tooltip" data-placement="top" title="SHIKO" class="fa fa-fw fa-eye viewDocument"></i>
                    <i data-toggle="tooltip" data-placement="top" title="FSHIJ" class="fa fa-fw fa-trash deleteDocument"></i>
                    <i data-toggle="tooltip" data-placement="top" title="DËRGO" class="fa fa-fw fa-at sendEmail"></i>
                    <i data-toggle="tooltip" data-placement="top" title="SHTO PËRGJIGJE" class="fa fa-fw fa-plus addAnswer"></i>`
                }
            ],
            order: [[9, "desc"]],
            columns: [
                { "data": "documentNumber" },
                { "data": "documentTitle" },
                { "data": "municipality" },
                { "data": "origin" },
                { "data": "addressed" },
                { "data": "physicalLocation" },
                { "data": "through" },
                { "data": "receiver" },
                {
                    "data": "documentDate",
                    render: function (data, type, row) {
                        if (type === 'display' || type === 'filter') {
                            var d = moment(data);
                            return d.format('DD/MM/YYYY');
                        }
                        return data;
                    }
                },
                {
                    "data": "createdAt",
                    render: function (data, type, row) {
                        if (type === 'display' || type === 'filter') {
                            var d = moment(data);
                            return d.format('DD/MM/YYYY');
                        }
                        return data;
                    }
                },
                { "data": "department" },
                { "data": "division" },
                {
                    "data": "comment",
                    render: function (d, type, row) {
                        if (!d) {
                            return '';
                        } else if (type === 'display' && d.length > 40) {
                            return '' + d.substr(0, 40) + '...';
                        } else {
                            return d;
                        }
                    }
                }
            ]
        })
    }
    documentsTable.DataTable().columns().every(function () {
        var that = this;
        $('input', this.footer()).on('keyup change', function () {
            if (that.search() !== this.value) {
                that.search(this.value)
                    .draw();
            }
        });
    });
}

$('#documentsTable_filter input').keyup(function () {
    documentsTable.search(
        jQuery.fn.DataTable.ext.type.search.string(this.value)
    ).draw();
});
$('#documentsTable tfoot th').each(function () {
    var title = $(this).text().trim();
    if (title != 'Veprimet') {
        $(this).html('<input class="search-box" type="text" placeholder="' + title + '" />')
    } else {
        $(this).html('<button type="button" class="btn btn-secondary clear-fields-doc">Pastro</button>');
    }
})

$(document).on('click', '.clear-fields-doc', function (e) {
    $('#documentsTable tfoot th input').each(function () {
        $(this).val('');
    })
    documentsTable.DataTable().columns().every(function () {
        this.search('').draw();
    })
})

$('#documentsTable').DataTable().columns().every(function () {
    var that = this;
    $('input', this.footer()).on('keyup change', function () {
        if (that.search() !== this.value) {
            that.search(this.value)
                .draw();
        }
    });
});

$('body .closeModal').click(function (e) {
    $('.modal').modal('hide');
})

$('body #divisionSelectionDoc').hide();
municipalities.map(val => {
    $('#municipalityDoc').append($("<option></option>")
        .attr("value", val)
        .text(val));
});

$(document).on('click', '#addDocument', function() {
    var departments;
    $.ajax({
        type: 'GET',
        url: url + '/document/' + document_id,
        success: function (response) {
            var document = response.data;
            $.ajax({
                type: 'GET',
                url: url + '/department',
                success: function (response) {
                    departments = response.data
                    for (var i = 0; i < departments.length; i++) {
                        $('body #departmentDoc').append($("<option></option>").attr("value", departments[i].name).text(departments[i].name));
                    }

                }
            })
            
        }
    })
    $('#departmentDoc').change(function () {
        $('body').find('#divisionSelectionDoc').show();
        departments.forEach(function (department) {
            if ($('#departmentDoc').val() == department.name) {
                $('#divisionDoc').html("");
                $('#divisionDoc').append($("<option></option>")
                    .attr("value", "")
                    .text("Zgjedhni divizionin"));
                department.divisions.forEach(function (division) {
                    $('#divisionDoc').append($("<option></option>")
                        .attr("value", division.name)
                        .text(division.name));
                })
            }
        })
    });
})

var createDocumentForm = $('#createDocumentForm');
var postData;

$('body').on('submit', '#createDocumentForm', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (createDocumentForm[0].checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
    }
    else {
        if (moment($('#documentDate').val(), 'YYYY-MM-DD', true).isValid()
            && moment($('#dateOfDocumentArrival').val(), 'YYYY-MM-DD', true).isValid()
            && moment($('#dateOfTheDocumentIssued').val(), 'YYYY-MM-DD', true).isValid()) {

            postData = new FormData(createDocumentForm[0])
            var data = {
                documentTitle: $('#documentTitle').val(),
                origin: $('#origin').val(),
                addressed: $('#addressed').val(),
                department: $('#departmentDoc').val()
            };
            $.ajax({
                url: url + '/document/check',
                type: 'POST',
                data: data,
                success: function (response) {
                    if (response.data.length > 0) {
                        $('#createDocumentModal').modal('hide');
                        $('#similarDocumentsModal .modal-body').append(`<div id="accordionList"></div>`)
                        for (var i = 0; i < response.data.length; i++) {
                            $('#accordionList').append(
                                `<div class="card">
                            <div data-toggle="collapse" data-target="#${response.data[i]._id}" class="card-header" id="${i}">
                                <h6 class="mb-0">
                                ${response.data[i].documentNumber}  -  ${response.data[i].documentTitle}
                                </h6>
                            </div>
                        
                            <div id="${response.data[i]._id}" class="collapse" aria-labelledby="${i}" data-parent="#accordionList">
                                <div class="card-body">
                                <div class="container">
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="VdocumentNumber">Numri i lëndës</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${response.data[i].documentNumber}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="Vmunicipality">Komuna</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${response.data[i].municipality}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="Vorigin">Prejardhja</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${response.data[i].origin}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="Vaddressed">Adresuar</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${response.data[i].addressed}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="VdocumentDate">Data e dokumentit</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${moment(response.data[i].documentDate).format('DD/MM/YYYY')}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="VdateOfDocumentArrival">Data e ardhjes së dokumentit</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${moment(response.data[i].dateOfDocumentArrival).format('DD/MM/YYYY')}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="Vthrough">Përmes</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${response.data[i].through}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="Vreceiver">Marrësi</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${response.data[i].receiver}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="VdateOfDocumentIssued">Data e daljes së dokumentit</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${moment(response.data[i].dateOfDocumentIssued).format('DD/MM/YYYY')}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="VphysicalLocation">Lokacioni fizik</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${response.data[i].physicalLocation}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="Vdepartment">Departamenti</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${response.data[i].department}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="Vdivision">Divizioni</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${response.data[i].division}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="Vcomment">Vërejtje</label>
                                    </div>
                                    <div class="col-md-6">
                                        <p>${response.data[i].comment}</p>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="file">Dokumenti i skenuar</label>
                                    </div>
                                    <div class="col-md-6">
                                        <a href="${url + '/uploads/' + response.data[i].documentFileName}">
                                            <i class="fa fa-download"></i>
                                            <span>${response.data[i].documentFileName}</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                                </div>
                            </div>
                        </div>
                            `
                            )
                        }
                        $('#similarDocumentsModal').modal();
                    } else {
                        submitDocument();
                    }
                }
            })
        } else {
            swal({
                type: 'error',
                text: 'Datat nuk janë valide'
            })
        }
    }

    createDocumentForm.addClass('was-validated');
    return false;
});

function submitDocument() {
    $.ajax({
        url: url + '/document',
        type: 'POST',
        data: postData,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response.confirmation == 'fail') {
                swal({
                    type: 'error',
                    text: response.message
                })
            } else {
                var obj = {
                    documentNumber: response.data.documentNumber,
                    documentTitle: response.data.documentTitle,
                    municipality: response.data.municipality,
                    origin: response.data.origin,
                    addressed: response.data.addressed,
                    physicalLocation: response.data.physicalLocation,
                    department: response.data.department,
                    through: response.data.through,
                    receiver: response.data.receiver,
                    division: response.data.division,
                    documentDate: response.data.documentDate,
                    createdAt: response.data.createdAt,
                    comment: response.data.comment
                }
                documentsTable.DataTable().row.add(obj).node().id = response.data._id;
                documentsTable.DataTable().draw(false);
                createDocumentForm.removeClass('was-validated');
                swal({
                    type: 'success',
                    text: 'Dokumenti është krijuar'
                })
                $('#createDocumentModal').modal('hide');
            }
        },
        error: function () {
            swal({
                type: 'error',
                text: 'Problem me serverin'
            })
        }
    })
}

$(document).on('click', '#saveDocument', function (e) {
    submitDocument();
    $('#similarDocumentsModal').modal('hide')
})
var docId;
$(document).on('click', '.addAnswer', function (e) {
    e.preventDefault();
    e.stopPropagation();
    docId = $(this).parent().parent().attr('id');
    $('body #divisionSelectionAns').hide();
    municipalities.map(val => {
        $('#municipalityAns').append($("<option></option>")
            .attr("value", val)
            .text(val));
    });
    $.ajax({
        type: 'GET',
        url: url + '/document/' + document_id,
        success: function (response) {
            var document = response.data;
            $.ajax({
                type: 'GET',
                url: url + '/department',
                success: function (response) {
                    departments = response.data
                    for (var i = 0; i < departments.length; i++) {
                        $('body #departmentAns').append($("<option></option>").attr("value", departments[i].name).text(departments[i].name));
                    }

                }
            })
            
        }
    })
    $('body').find('#divisionSelectionAns').hide();
    $('#departmentAns').change(function () {
        $('body').find('#divisionSelectionAns').show();
        departments.forEach(department => {
            if ($('#departmentAns').val() == department.name) {
                $('#divisionAns').html("");
                $('#divisionAns').append($("<option></option>")
                    .attr("value", "")
                    .text("Zgjedhni divizionin"));
                department.divisions.forEach(division => {
                    // Clear the previous selection content
                    $('#divisionAns').append($("<option></option>")
                        .attr("value", division.name)
                        .text(division.name));
                });
            }
        });
    });
    $('#addAnswerModal').modal();
})
$(document).on('click', '#submitAnswer', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var addAnswerForm = $('#addAnswerForm');
    if (moment($('#documentDateAns').val(), 'YYYY-MM-DD', true).isValid()
        && moment($('#dateOfDocumentArrivalAns').val(), 'YYYY-MM-DD', true).isValid()
        && moment($('#dateOfTheAnswerIssued').val(), 'YYYY-MM-DD', true).isValid()) {

        var formData = new FormData();
        formData.append('answerTitle', $('#answerTitle').val())
        formData.append('municipality', $('#municipalityAns').val())
        formData.append('origin', $('#originAns').val())
        formData.append('addressed', $('#addressedAns').val())
        formData.append('answerDate', $('#documentDateAns').val())
        formData.append('dateOfAnswerArrival', $('#dateOfDocumentArrivalAns').val())
        formData.append('dateOfAnswerIssued', $('#dateOfTheAnswerIssued').val())
        formData.append('through', $('#throughAns').val())
        formData.append('receiver', $('#receiverAns').val())
        formData.append('physicalLocation', $('#physicalLocationAns').val())
        formData.append('department', $('#departmentAns').val())
        formData.append('division', $('#divisionAns').val())
        formData.append('comment', $('#commentAns').val())
        formData.append('docId', docId);
        formData.append('file', $('#ansFile')[0].files[0])

        if (addAnswerForm[0].checkValidity() === true) {

            $.ajax({
                type: 'POST',
                url: url + '/document/answer/' + docId,
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    var obj = {
                        _id : response.data._id,
                        documentNumber: response.data.answerNumber,
                        documentTitle: response.data.answerTitle,
                        municipality: response.data.municipality,
                        origin: response.data.origin,
                        addressed: response.data.addressed,
                        physicalLocation: response.data.physicalLocation,
                        department: response.data.department,
                        through: response.data.through,
                        receiver: response.data.receiver,
                        division: response.data.division,
                        documentDate: response.data.answerDate,
                        createdAt: response.data.createdAt,
                        comment: response.data.comment
                    }
                    documentsTable.DataTable().row.add(obj).draw(false).node().id = response.data._id;
                    $('#' + response.data._id).find('td:last').html(`
                            <i data-toggle="tooltip" data-placement="top" title="NDRYSHO" class="fa fa-fw fa-edit editAnswer"></i>
                            <i data-toggle="tooltip" data-placement="top" title="SHIKO" class="fa fa-fw fa-eye viewAnswer"></i>
                            <i data-toggle="tooltip" data-placement="top" title="FSHIJ" class="fa fa-fw fa-trash deleteAnswer"></i>
                        `)
                    swal(
                        'Sukses!',
                        'Përgjigja u shtua me sukses.',
                        'success'
                    )
                    $('#addAnswerModal').modal('hide');
                },
                error: function () {
                    swal({
                        type: 'error',
                        text: 'Problem me serverin'
                    })
                }
            })
        }
    } else {
        swal({
            type: 'error',
            text: 'Datat nuk janë valide'
        })
    }
    addAnswerForm.addClass('was-validated')
})

$(document).on('click', '.sendEmail', function (e) {
    var documentId = $(this).parent().parent().attr('id');
    swal({
        title: 'Shkruani email adresën e marrësit',
        input: 'email',
        showCancelButton: true,
        cancelButtonText: 'Anulo',
        confirmButtonText: 'Dërgo',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        showLoaderOnConfirm: true,
        reverseButtons: true,
        preConfirm: (email) => {
            return new Promise((resolve) => {
                var data = {
                    doc_id: documentId,
                    email: email
                }
                $.ajax({

                    type: "POST",
                    url: url + "/document/send",
                    data: data,
                    success: function (data) {
                        resolve(data)
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
                title: 'Emaili eshte derguar me sukses',
            })
        }
    })
});

//AJAX call for getting a single document and displaying the modal
$(document).on('click', '.viewDocument', function (e) {
    var documentId = $(this).parent().parent().attr('id');
    $.ajax({
        type: 'GET',
        url: url + '/document/' + documentId,
        success: function (response) {
            var document = response.data;
            var user, editingUser;
            if (document.user) {
                user = document.user.firstName + ' ' + document.user.lastName + ' (' + moment(document.user.createdAt).format('DD/MM/YYYY HH:mm') + ')'
            } else {
                user = '----'
            }
            if (document.editingUser != undefined) {
                editingUser = document.editingUser.firstName + ' ' + document.editingUser.lastName + ' (' + moment(document.editingUser.createdAt).format('DD/MM/YYYY HH:mm') + ') '
                $('#editingUserDiv').append(
                    `
                    <div class="row" id="editingUserDetails">
                        <div class="col-md-6">
                            <label class="documentLabel" for="VeditingUser">Dokumenti është ndryshuar nga:</label>
                        </div>
                            <div class="col-md-6">
                                <label>${editingUser}</label>
                        </div>
                    </div>
                    <hr id="editingUserHr">
                    `
                )
            }
            $('#VdocumentNumber').text(document.documentNumber);
            $('#VdocumentTitle').text(document.documentTitle);
            $('#Vmunicipality').text(document.municipality);
            $('#Vorigin').text(document.origin);
            $('#Vaddressed').text(document.addressed);
            $('#VdateOfDocumentArrival').text(new Date(document.dateOfDocumentArrival).toLocaleDateString());
            $('#VdateOfDocumentIssued').text(new Date(document.dateOfDocumentIssued).toLocaleDateString());
            $('#VdocumentDate').text(new Date(document.documentDate).toLocaleDateString());
            $('#Vthrough').text(document.through);
            $('#Vreceiver').text(document.receiver);
            $('#VphysicalLocation').text(document.physicalLocation);
            $('#Vdepartment').text(document.department);
            $('#Vdivision').text(document.division);
            $('#Vuser').text(user);
            $('#VeditingUser').text(editingUser);
            $('#Vcomment').text(document.comment);
            $('#Vdownload').attr("href", url + '/uploads/' + document.municipality + '/' + document.documentFileName)
            $('#fileNameSpan').text(document.documentFileName)
            if (response.data.answers.length > 0) {
                $('#viewDocumentModal .container').append('<div style="padding-top: 10px;" id="accordion"><hr><h5 class="modal-title">Përgjigjet:</h5></div>')
                for (var i = 0; i < response.data.answers.length; i++) {
                    $('#viewDocumentModal .container #accordion').append(
                        `<div class="card">
                            <div data-toggle="collapse" data-target="#${response.data.answers[i]._id}" class="card-header" id="${i}">
                                <h6 class="mb-0">
                                ${response.data.answers[i].answerNumber}  -  ${response.data.answers[i].answerTitle}
                                </h6>
                            </div>
                        
                            <div id="${response.data.answers[i]._id}" class="collapse" aria-labelledby="${i}" data-parent="#accordion">
                                <div class="card-body">
                                <div class="container">
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="VdocumentNumber">Numri i lëndës</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${response.data.answers[i].answerNumber}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="Vmunicipality">Komuna</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${response.data.answers[i].municipality}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="Vorigin">Prejardhja</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${response.data.answers[i].origin}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="Vaddressed">Adresuar</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${response.data.answers[i].addressed}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="VdocumentDate">Data e përgjigjes</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${moment(response.data.answers[i].answerDate).format('DD/MM/YYYY')}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="VdateOfDocumentArrival">Data e ardhjes së përgjigjes</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${moment(response.data.answers[i].dateOfAnswerArrival).format('DD/MM/YYYY')}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="Vthrough">Përmes</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${response.data.answers[i].through}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="Vreceiver">Marrësi</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${response.data.answers[i].receiver}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="VdateOfDocumentIssued">Data e daljes së përgjigjes</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${moment(response.data.answers[i].dateOfAnswerIssued).format('DD/MM/YYYY')}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="VphysicalLocation">Lokacioni fizik</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${response.data.answers[i].physicalLocation}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="Vdepartment">Departamenti</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${response.data.answers[i].department}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="Vdivision">Divizioni</label>
                                    </div>
                                    <div class="col-md-6">
                                        <label>${response.data.answers[i].division}</label>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="Vcomment">Vërejtje</label>
                                    </div>
                                    <div class="col-md-6">
                                        <p>${response.data.answers[i].comment}</p>
                                    </div>
                                </div>
                                <hr>
                                <div class="row">
                                    <div class="col-md-6">
                                        <label class="documentLabel" for="file">Dokumenti i skenuar</label>
                                    </div>
                                    <div class="col-md-6">
                                        <a href="${url + '/uploads/' + response.data.answers[i].answerFileName}">
                                            <i class="fa fa-download"></i>
                                            <span>${response.data.answers[i].answerFileName}</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                                </div>
                            </div>
                        </div>`
                    )
                }
            }
            $('#viewDocumentModal').modal();
        },
        error: function () {
            swal({
                type: 'error',
                text: 'Problem me serverin'
            })
        }
    })
})

$(document).on('click', '.deleteDocument', function (e) {
    var documentId = $(this).parent().parent().attr('id');
    var documentNumber = $(this).parent().parent().data('documentnumber');
    swal({
        title: 'A jeni të sigurte?',
        text: "Ju keni zgjedhur të fshini dokumentin me numër: " + documentNumber,
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
                url: url + '/document/' + documentId,
                success: function (response) {
                    swal(
                        'Sukses!',
                        'Dokumenti është fshirë me sukses.',
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
            documentsTable.DataTable().row($(this).closest('tr')).remove().draw();
        }
    })
})

$('body #UdepartmentDoc').change(function () {
    departments.forEach(department => {
        if ($('#UdepartmentDoc').val() == department.name) {
            $('body #UdivisionDoc').html("");
            $('body #UdivisionDoc').append($("<option></option>")
                .attr("value", "")
                .text("Zgjedhni divizionin"));
            department.divisions.forEach(division => {
                // Clear the previous selection content
                $('body #UdivisionDoc').append($("<option></option>")
                    .attr("value", division.name)
                    .text(division.name));
            });
        }
    });
});
var document_id;
$(document).on('click', '.editDocument', function (e) {
    var departments;
    document_id = $(this).parent().parent().attr('id');
    municipalities.map(val => {
        $('body #UmunicipalityDoc').append($("<option></option>")
            .attr("value", val)
            .text(val));
    });

    $.ajax({
        type: 'GET',
        url: url + '/document/' + document_id,
        success: function (response) {
            var doc = response.data;
            $.ajax({
                type: 'GET',
                url: url + '/department',
                success: function (response) {
                    departments = response.data
                    for (var i = 0; i < departments.length; i++) {
                        $('body #UdepartmentDoc').append($("<option></option>").attr("value", departments[i].name).text(departments[i].name));
                    }
                    departments.forEach(department => {
                        if (department.name == doc.department) {
                            department.divisions.forEach(division => {
                                $('body #UdivisionDoc').append($("<option></option>")
                                    .attr("value", division.name)
                                    .text(division.name));
                            })
                        }
                    })
                    $('#updateDocumentModal').modal()
                    $('#UdocumentNumber').attr("value", doc.documentNumber);
                    $('#UdocumentTitle').attr("value", doc.documentTitle);
                    $('#UmunicipalityDoc').attr("value", doc.municipality);
                    $('#Uorigin').attr("value", doc.origin);
                    $('#Uaddressed').attr("value", doc.addressed);
                    $('#UdocumentDate').val(new Date(doc.documentDate).toISOString().substring(0, 10));
                    $('#UdateOfDocumentArrival').attr("value", new Date(doc.dateOfDocumentArrival).toISOString().substring(0, 10));
                    $('#Uthrough').attr("value", doc.through);
                    $('#Ureceiver').attr("value", doc.receiver);
                    $('#UdateOfTheDocumentIssued').attr("value", new Date(doc.dateOfDocumentIssued).toISOString().substring(0, 10));
                    $('#UphysicalLocation').attr("value", doc.physicalLocation);
                    document.querySelector(`#UdepartmentDoc option[value="${doc.department}"`).selected = true;
                    document.querySelector(`#UdivisionDoc option[value="${doc.division}"`).selected = true;
                    $('#Ucomment').text(doc.comment);
                    $('#Udownload').attr("href", url + '/uploads/' + doc.documentFileName)
                    $('#UfileNameSpan').text(doc.documentFileName)
                }
            })
            
        },
        error: function () {
            swal({
                type: 'error',
                text: 'Problem me serverin'
            })
        }
    })
})

$(document).on('click', '#updateDocument', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var updateDocumentForm = $('#updateDocumentForm');
    if (moment($('#UdocumentDate').val(), 'YYYY-MM-DD', true).isValid()
        && moment($('#UdateOfDocumentArrival').val(), 'YYYY-MM-DD', true).isValid()
        && moment($('#UdateOfTheDocumentIssued').val(), 'YYYY-MM-DD', true).isValid()) {

        if (updateDocumentForm[0].checkValidity() === true) {
            var data = {
                documentTitle: $('#UdocumentTitle').val(),
                municipality: $('#UmunicipalityDoc').val(),
                origin: $('#Uorigin').val(),
                addressed: $('#Uaddressed').val(),
                documentDate: $('#UdocumentDate').val(),
                dateOfDocumentArrival: $('#UdateOfDocumentArrival').val(),
                dateOfDocumentIssued: $('#UdateOfTheDocumentIssued').val(),
                physicalLocation: $('#UphysicalLocation').val(),
                department: $('#UdepartmentDoc').val(),
                through: $('#Uthrough').val(),
                receiver: $('#Ureceiver').val(),
                division: $('#UdivisionDoc').val(),
                comment: $('#Ucomment').val(),
            };
            $.ajax({
                type: 'PUT',
                url: url + '/document/' + document_id,
                data: data,
                success: function (response) {
                    var obj = {
                        documentNumber: response.data.documentNumber,
                        documentTitle: response.data.documentTitle,
                        municipality: response.data.municipality,
                        origin: response.data.origin,
                        addressed: response.data.addressed,
                        physicalLocation: response.data.physicalLocation,
                        department: response.data.department,
                        through: response.data.through,
                        receiver: response.data.receiver,
                        division: response.data.division,
                        documentDate: response.data.documentDate,
                        createdAt: response.data.createdAt,
                        comment: response.data.comment
                    }
                    documentsTable.DataTable().row("#" + response.data._id).data(obj).draw(false);
                    swal(
                        'Sukses!',
                        'Ndryshimet u ruajtën me sukses.',
                        'success'
                    )
                    $('#updateDocumentModal').modal('hide');
                    updateDocumentForm.removeClass('was-validated');
                },
                error: function () {
                    swal({
                        type: 'error',
                        text: 'Problem me serverin'
                    })
                }
            })
        }
    } else {
        swal({
            type: 'error',
            text: 'Datat nuk janë valide'
        })
    }
    updateDocumentForm.addClass('was-validated')
})

$(document).on('click', '.viewAnswer', function (e) {
    $.ajax({
        url: url + '/document/' + $(this).parent().parent().attr('docnr') + '/answer/' + $(this).parent().parent().attr('id'),
        type: 'GET',
        success: function (response) {
            var editingUser;
            if (response.data.editingUser != undefined) {
                editingUser = response.data.editingUser.firstName + ' ' + response.data.editingUser.lastName + ' (' + moment(response.data.editingUser.createdAt).format('DD/MM/YYYY HH:mm') + ') '
                $('#AeditingUserDiv').append(
                    `
                    <div class="row" id="AeditingUserDetails">
                        <div class="col-md-6">
                            <label class="documentLabel" for="VeditingUser">Dokumenti është ndryshuar nga:</label>
                        </div>
                            <div class="col-md-6">
                                <label>${editingUser}</label>
                        </div>
                    </div>
                    <hr id="AeditingUserHr">
                    `
                )
            }
            $('#AanswerTitle').text(response.data.answerTitle);
            $('#AanswerNumber').text(response.data.answerNumber);
            $('#Amunicipality').text(response.data.municipality);
            $('#Aorigin').text(response.data.origin);
            $('#Aaddressed').text(response.data.addressed);
            $('#AdocumentDate').text(moment(response.data.answerDate).format('DD/MM/YYYY'));
            $('#AdateOfAnswerArrival').text(moment(response.data.dateOfAnswerArrival).format('DD/MM/YYYY'));
            $('#Athrough').text(response.data.through);
            $('#Areceiver').text(response.data.receiver);
            $('#AdateOfAnswerIssued').text(moment(response.data.dateOfAnswerIssued).format('DD/MM/YYYY'));
            $('#AphysicalLocation').text(response.data.physicalLocation);
            $('#Adepartment').text(response.data.department);
            $('#Adivision').text(response.data.division);
            $('#Auser').text(response.data.user.firstName + ' ' + response.data.user.lastName + ' (' + moment(response.data.user.createdAt).format('DD/MM/YYYY HH:mm') + ')');
            $('#Acomment').text(response.data.comment);
            $('#AfileNameSpan').text(response.data.answerFileName);
            $('#Adownload').attr('href', url + '/uploads/' + response.data.municipality + '/' + response.data.answerFileName);
            $('#viewAnswersModal').modal();
        }
    })
})

var docnr, ansid;

$(document).on('click', '.editAnswer', function (e) {
    var departments;
    docnr = $(this).parent().parent().attr('docnr');
    ansid = $(this).parent().parent().attr('id');
    municipalities.map(val => {
        $('body #UAmunicipalityDoc').append($("<option></option>")
            .attr("value", val)
            .text(val));
    });
    $.ajax({
        url: url + '/document/' + $(this).parent().parent().attr('docnr') + '/answer/' + $(this).parent().parent().attr('id'),
        type: 'GET',
        success: function (response) {
            var document = response.data;
            $.ajax({
                type: 'GET',
                url: url + '/department',
                success: function (response) {
                    departments = response.data
                    for (var i = 0; i < departments.length; i++) {
                        $('body #UAdepartmentDoc').append($("<option></option>").attr("value", departments[i].name).text(departments[i].name));
                    }
                    departments.forEach(department => {
                        if (department.name == document.department) {
                            department.divisions.forEach(division => {
                                $('body #UAdivisionDoc').append($("<option></option>")
                                    .attr("value", division.name)
                                    .text(division.name));
                            })
                        }
                    })
                    $('body #UAdepartmentDoc').change(function () {
                        departments.forEach(department => {
                            if ($('#UAdepartmentDoc').val() == department.name) {
                                $('body #UAdivisionDoc').html("");
                                $('body #UAdivisionDoc').append($("<option></option>")
                                    .attr("value", "")
                                    .text("Zgjedhni divizionin"));
                                department.divisions.forEach(division => {
                                    // Clear the previous selection content
                                    $('body #UAdivisionDoc').append($("<option></option>")
                                        .attr("value", division.name)
                                        .text(division.name));
                                });
                            }
                        });
                    });
        
                    $('#UAdocumentNumber').attr("value", document.answerNumber);
                    $('#UAdocumentTitle').attr("value", document.answerTitle);
                    $('#UAorigin').attr("value", document.origin);
                    $('#UAaddressed').attr("value", document.addressed);
                    $('#UAmunicipalityDoc').attr("value", document.municipality);
                    $('#UAdocumentDate').val(new Date(document.answerDate).toISOString().substring(0, 10));
                    $('#UAdateOfDocumentArrival').attr("value", new Date(document.dateOfAnswerArrival).toISOString().substring(0, 10));
                    $('#UAthrough').attr("value", document.through);
                    $('#UAreceiver').attr("value", document.receiver);
                    $('#UAdateOfTheDocumentIssued').attr("value", new Date(document.dateOfAnswerIssued).toISOString().substring(0, 10));
                    $('#UAphysicalLocation').attr("value", document.physicalLocation);
                    $(`#UAdepartmentDoc option[value="${document.department}"`).attr('selected', 'selected')
                    $(`#UAdivisionDoc option[value="${document.division}"`).attr('selected', 'selected')
                    $('#UAcomment').text(document.comment);
                    $('#UAdownload').attr("href", url + '/uploads/' + document.municipality + '/' + document.answerFileName)
                    $('#UAfileNameSpan').text(document.answerFileName)
                    $('#updateAnswerModal').modal();
                }
            })
            
        }
    })
})

$(document).on('click', '#AupdateAnswer', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var updateAnswerForm = $('#updateAnswerForm');
    if (moment($('#UAdocumentDate').val(), 'YYYY-MM-DD', true).isValid()
        && moment($('#UAdateOfDocumentArrival').val(), 'YYYY-MM-DD', true).isValid()
        && moment($('#UAdateOfTheDocumentIssued').val(), 'YYYY-MM-DD', true).isValid()) {

        if (updateAnswerForm[0].checkValidity() === true) {
            var data = {
                answerTitle: $('#UAdocumentTitle').val(),
                municipality: $('#UAmunicipalityDoc').val(),
                origin: $('#UAorigin').val(),
                addressed: $('#UAaddressed').val(),
                answerDate: $('#UAdocumentDate').val(),
                dateOfAnswerArrival: $('#UAdateOfDocumentArrival').val(),
                dateOfAnswerIssued: $('#UAdateOfTheDocumentIssued').val(),
                physicalLocation: $('#UAphysicalLocation').val(),
                department: $('#UAdepartmentDoc').val(),
                through: $('#UAthrough').val(),
                receiver: $('#UAreceiver').val(),
                division: $('#UAdivisionDoc').val(),
                comment: $('#UAcomment').val(),
            };
            $.ajax({
                type: 'PUT',
                url: url + '/document/' + docnr + '/answer/' + ansid,
                data: data,
                success: function (response) {
                    var obj = {
                        documentNumber: response.data.answerNumber,
                        documentTitle: response.data.answerTitle,
                        municipality: response.data.municipality,
                        origin: response.data.origin,
                        addressed: response.data.addressed,
                        physicalLocation: response.data.physicalLocation,
                        department: response.data.department,
                        through: response.data.through,
                        receiver: response.data.receiver,
                        division: response.data.division,
                        documentDate: response.data.answerDate,
                        createdAt: response.data.createdAt,
                        comment: response.data.comment
                    }
                    documentsTable.DataTable().row("#" + response.data._id).data(obj).draw(false);
                    $('#' + response.data._id).find('td:last').html(`
                            <i data-toggle="tooltip" data-placement="top" title="NDRYSHO" class="fa fa-fw fa-edit editAnswer"></i>
                            <i data-toggle="tooltip" data-placement="top" title="SHIKO" class="fa fa-fw fa-eye viewAnswer"></i>
                            <i data-toggle="tooltip" data-placement="top" title="FSHIJ" class="fa fa-fw fa-trash deleteAnswer"></i>
                        `)
                    swal(
                        'Sukses!',
                        'Ndryshimet u ruajtën me sukses.',
                        'success'
                    )
                    $('#updateAnswerModal').modal('hide');
                    updateAnswerForm.removeClass('was-validated');
                },
                error: function () {
                    swal({
                        type: 'error',
                        text: 'Problem me serverin'
                    })
                }
            })
        }
    } else {
        swal({
            type: 'error',
            text: 'Datat nuk janë valide'
        })
    }
    updateAnswerForm.addClass('was-validated')
})

$(document).on('click', '.deleteAnswer', function (e) {
    ansid = $(this).parent().parent().attr('id');
    docnr = $(this).parent().parent().attr('docnr');
    answerNumber = $(this).parent().parent().data('documentnumber')
    swal({
        title: 'A jeni të sigurte?',
        text: "Ju keni zgjedhur të fshini përgjigjen me numër: " + answerNumber,
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
                url: url + '/document/' + docnr + '/answer/' + ansid,
                success: function (response) {
                    swal(
                        'Sukses!',
                        'Dokumenti është fshirë me sukses.',
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
            documentsTable.DataTable().row($(this).closest('tr')).remove().draw();
        }
    })

})
