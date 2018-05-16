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
var url = 'http://' + window.location.host;

var reportStart, reportEnd;
var reportsInitialLoad = true;
var reportsTable = $('#reportsTable');

$('#reports').click(function () {
    populateReports();
})
if (window.location.hash == "#reports-pane") {
    populateReports();
}

function populateReports() {
    $('#reportsTable').DataTable().destroy();
    $('#reportsTable tbody').empty();
    reportsInitialLoad = true;
    if (sessionStorage.getItem('role') == 'user') {
        reportsTable.DataTable({
            dom: `  <'row'<'col-sm-2'l><"#reports-date-range.col-sm-4"><'col-sm-4'B><'#clearReportFields.col-sm-2'>>
            <'row'<'col-sm-12'tr>>
            <'row'<'col-sm-5'i><'col-sm-7'p>>`,
            "language": {
                "lengthMenu": "_MENU_ dokumente",
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
                reportDisplayDateRanges();
                $('#clearReportFields').html('<button type="button" style="float: right;" class="btn btn-secondary clear-fields-doc">Pastro</button>');
                reportsInitialLoad = false;
            },
            ajax: {
                "url": url + '/document/' + new Date(moment().subtract(12, 'month').startOf('month')) + '/' + new Date(moment()),
                "type": 'GET',
            },
            createdRow: function (row, data, dataIndex) {
                $(row).attr('data-documentNumber', data.documentNumber)
            },
            buttons: [
                {
                    extend: 'pdfHtml5',
                    orientation: 'landscape',
                    className: 'btn btn-outline-primary'
                }
            ],
            rowId: '_id',
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
        reportsTable.DataTable({
            dom: `  <'row'<'col-sm-2'l><"#reports-date-range.col-sm-4"><'col-sm-4'B><'#clearReportFields.col-sm-2'>>
                <'row'<'col-sm-12'tr>>
                <'row'<'col-sm-5'i><'col-sm-7'p>>`,
            "language": {
                "lengthMenu": "_MENU_ dokumente",
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
            buttons: [
                {
                    extend: 'pdfHtml5',
                    orientation: 'landscape',
                    className: 'btn btn-outline-primary'
                },
                {
                    extend: 'csv',
                    className: 'btn btn-outline-primary'
                },
                {
                    extend: 'excel',
                    className: 'btn btn-outline-primary'
                },
                {
                    extend: 'print',
                    className: 'btn btn-outline-primary'
                }
            ],
            ajax: {
                "url": url + '/document/' + new Date(moment().subtract(12, 'month').startOf('month')) + '/' + new Date(moment()),
                "type": 'GET'
            },
            createdRow: function (row, data, dataIndex) {
                $(row).attr('data-documentNumber', data.documentNumber)
            },
            initComplete: function () {
                reportDisplayDateRanges();
                $('#clearReportFields').html('<button type="button" style="float: right;" class="btn btn-secondary clear-fields-doc">Pastro</button>');
                reportsInitialLoad = false;
            },
            rowId: '_id',
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
    
    reportsTable.DataTable().columns().every(function () {
        var that = this;
        $('input', this.footer()).on('keyup change', function () {
            if (that.search() !== this.value) {
                that.search(this.value)
                    .draw();
            }
        });
    });
}
function reportDisplayDateRanges() {
    if (reportsInitialLoad == false) {
        $('#reports-date-range').html(`
            <div class="rangepicker">
            <label id="label-daterange" for="daterange"></label>
            <input type="text" name="daterange" id="repdaterange" class="date-range"/>
            </div>`)
        $('#repdaterange').daterangepicker({
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
            startDate: reportStart,
            endDate: reportEnd
        }, function (start, end, label) {
            reportStart = new Date(start);
            reportEnd = new Date(end);
            searchDocuments(reportStart, reportEnd);
        });
    } else {
        $('#reports-date-range').html(`
            <div class="rangepicker">
            <label id="label-daterange" for="daterange"></label>
            <input type="text" name="daterange" id="repdaterange" class="date-range"/>
            </div>`)
        $('#repdaterange').daterangepicker({
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
            reportStart = new Date(start);
            reportEnd = new Date(end);
            searchDocuments(reportStart, reportEnd);
        });
    }
}

function searchDocuments(starting, ending) {
    reportsTable.DataTable().destroy();
    $('#reportsTable tbody').empty();

    if (sessionStorage.getItem('role') == 'user') {
        reportsTable.DataTable({
            dom: `  <'row'<'col-sm-2'l><"#reports-date-range.col-sm-4"><'col-sm-4'B><'#clearReportFields.col-sm-2'>>
                <'row'<'col-sm-12'tr>>
                <'row'<'col-sm-5'i><'col-sm-7'p>>`,
            "language": {
                "lengthMenu": "_MENU_ dokumente",
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
                $('#clearReportFields').html('<button type="button" style="float: right;" class="btn btn-secondary clear-fields-doc">Pastro</button>');
                reportDisplayDateRanges();
                reportsInitialLoad = false;
            },
            ajax: {
                "url": url + '/document/' + starting + '/' + ending,
                "type": 'GET'
            },
            createdRow: function (row, data, dataIndex) {
                $(row).attr('data-documentNumber', data.documentNumber)
            },
            buttons: [
                {
                    extend: 'pdfHtml5',
                    orientation: 'landscape',
                    className: 'btn btn-outline-primary'
                }
            ],
            rowId: '_id',
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
        reportsTable.DataTable({
            dom: `  <'row'<'col-sm-2'l><"#reports-date-range.col-sm-4"><'col-sm-4'B><'#clearReportFields.col-sm-2'>>
            <'row'<'col-sm-12'tr>>
            <'row'<'col-sm-5'i><'col-sm-7'p>>`,
            "language": {
                "lengthMenu": "_MENU_ dokumente",
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
                "type": 'GET',
            },
            createdRow: function (row, data, dataIndex) {
                $(row).attr('data-documentNumber', data.documentNumber)
            },
            initComplete: function () {
                $('#clearReportFields').html('<button type="button" style="float: right;" class="btn btn-secondary clear-fields-doc">Pastro</button>');
                reportDisplayDateRanges();
                reportsInitialLoad = false;
            },
            buttons: [
                {
                    extend: 'pdfHtml5',
                    orientation: 'landscape',
                    className: 'btn btn-outline-primary'
                },
                {
                    extend: 'csv',
                    className: 'btn btn-outline-primary'
                },
                {
                    extend: 'excel',
                    className: 'btn btn-outline-primary'
                },
                {
                    extend: 'print',
                    className: 'btn btn-outline-primary'
                }
            ],
            rowId: '_id',
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
    
    reportsTable.DataTable().columns().every(function () {
        var that = this;
        $('input', this.footer()).on('keyup change', function () {
            if (that.search() !== this.value) {
                that.search(this.value)
                    .draw();
            }
        });
    });
}
$('#reportsTable tfoot th').each(function () {
    var title = $(this).text().trim();
    if (title != 'Veprimet') {
        $(this).html('<input class="search-box" type="text" placeholder="' + title + '" />')
    } else {
    }
})

$('#reportsTable_filter input').keyup(function () {
    reportsTable.search(
        jQuery.fn.DataTable.ext.type.search.string(this.value)
    ).draw();
});


$(document).on('click', '.clear-fields-doc', function (e) {
    $('#reportsTable tfoot th input').each(function () {
        $(this).val('');
    })
    reportsTable.DataTable().columns().every(function () {
        this.search('').draw();
    })
})
