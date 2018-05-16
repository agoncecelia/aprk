var url = 'http://' + window.location.host;

var categories = [];
var totalPerDay = [];

$.ajax({
    url: url + '/user/profile',
    type: 'GET',
    success: function(res) {
        if(res.role == 'user') {
            $.ajax({
                url: url+ '/stats/for-regular-user',
                type: 'GET',
                success: function(response) {
                    Highcharts.chart('division-stats-user', {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: 'Komuna: ' + res.municipality + '<br> Departamenti: ' + res.department
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        series: [{
                            name: 'Divizionet',
                            colorByPoint: true,
                            data: response.data
                        }]
                    });
                }
            })
        } else {
            $.ajax({
                url: url + '/stats/documents-created-at',
                type: 'GET',
                success: function(response) {
                    for(var i = 0; i < response.data.length; i++) {
                        response.data.reverse();
                        categories.push(response.data[i]._id.day + '/' + response.data[i]._id.month + '/' + response.data[i]._id.year);
                        totalPerDay.push(response.data[i].sum)
                    }
                    Highcharts.chart('main-stats', {
                        chart: {
                            type: 'line'
                        },
                        title: {
                            text: 'Numri i dokumenteve në bazë ditore'
                        },
                        xAxis: {
                            title: {
                                text: 'Data'
                            },
                            categories: categories
                        },
                        yAxis: {
                            title: {
                                text: 'Numri i dokumenteve'
                            }
                        },
                        plotOptions: {
                            line: {
                                dataLabels: {
                                    enabled: true
                                },
                                enableMouseTracking: true
                            }
                        },
                        series: [{
                            name: 'Dokumente',
                            data: totalPerDay
                        }]
                    });
                }
            })
            $.ajax({
                url: url+ '/stats/municipality',
                type: 'GET',
                success: function(response) {
                    Highcharts.chart('municipality-stats', {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: 'Në bazë të komunave'
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        series: [{
                            name: 'Komunat',
                            colorByPoint: true,
                            data: response.data
                        }]
                    });
                }
            })
            $.ajax({
                url: url+ '/stats/department',
                type: 'GET',
                success: function(response) {
                    Highcharts.chart('department-stats', {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: 'Në bazë të departamenteve'
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        series: [{
                            name: 'Departamentet',
                            colorByPoint: true,
                            data: response.data
                        }]
                    });
                }
            })
            $.ajax({
                url: url+ '/stats/division',
                type: 'GET',
                success: function(response) {
                    Highcharts.chart('division-stats', {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: 'Në bazë të divizioneve'
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        series: [{
                            name: 'Divizionet',
                            colorByPoint: true,
                            data: response.data
                        }]
                    });
                }
            })
        }
    }
})

Highcharts.setOptions({
    colors: Highcharts.map(Highcharts.getOptions().colors, function (color) {
        return {
            radialGradient: {
                cx: 0.5,
                cy: 0.3,
                r: 0.7
            },
            stops: [
                [0, color],
                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
            ]
        };
    })
});