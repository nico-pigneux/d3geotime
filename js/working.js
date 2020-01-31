var defData = [
    {
        place: 'Wuhan',
        datacat: 'confirmed',
        count: 1000
    },
    {
        place: 'Wuhan',
        datacat: 'death',
        count: 50
    },
    {
        place: 'Guangzhou',
        datacat: 'confirmed',
        count: 100
    },
    {
        place: 'Guangzhou',
        datacat: 'death',
        count: 7
    }
]

// hbar(defData);







var chart = new Taucharts.Chart({
    type: 'horizontal-stacked-bar',
    y: 'process',
    x: 'count',
    color: 'stage',
    size: 'ABS(count)',
    plugins: [Taucharts.api.plugins.get('tooltip')()],
    data: [
            {
                process: 'sales',
                stage: 'visit',
                count: 100
            },
            {
                process: 'sales',
                stage: 'trial',
                count: 50
            },
            {
                process: 'sales1',
                stage: 'visit',
                count: 15
            },
            {
                process: 'sales1',
                stage: 'trial',
                count: -7
            }
    ]
            .map(function (row) {
                row['ABS(count)'] = Math.abs(row.count);
                return row;
            })
            .reverse()
});
// chart.renderTo('#bar');
