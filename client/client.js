const dataArray = [{
    title: 'sample title',
    description: 'sample description'
}];

const API_URL = "http://localhost:7000/data"


var app = new Vue({
    el: '#app',
    data: {
        filterDate: undefined,
        selectedMonth: new Date(),
        currentMonthAndYear: 'Oct 2020',
        dataItem: dataArray,
        editWindow: {
            title: "",
            description: "",

        },
        myModel: false,
    },
    methods: {
        previousMonth: function() {
            var tmpDate = this.selectedMonth;
            var tmpMonth = tmpDate.getMonth() - 1;
            this.selectedMonth = new Date(tmpDate.setMonth(tmpMonth));
            this.currentMonthAndYear = moment(this.selectedMonth).format('MMM YYYY');
        },
        nextMonth: function() {
            var tmpDate = this.selectedMonth;
            var tmpMonth = tmpDate.getMonth() + 1;
            this.selectedMonth = new Date(tmpDate.setMonth(tmpMonth));
            this.currentMonthAndYear = moment(this.selectedMonth).format('MMM YYYY');
        },
        addData: function() {
            console.log(this.editWindow);
            const {
                title,
                description,
            } = this.editWindow;
            this.dataItem.push({
                title,
                description,
            });
            this.myModel = false;
            console.log(this.dataItem);
            fetch(API_URL, {
                    method: 'POST',
                    body: JSON.stringify(this.editWindow),
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(createdData => {
                    console.log(createdData);
                });
        },
        setDate: function(date) {
            this.myModel = true;
            if (date == this.filterDate) {
                console.log('setting undefined');
                this.filterDate = undefined;
                //unselected
            } else {
                this.filterDate = date;
            }
        },
        isActive: function(date) {
            return date === this.filterDate;
        },
        getCalendarMatrix: function(date) {
            var calendarMatrix = []

            var startDay = new Date(date.getFullYear(), date.getMonth(), 1)
            var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

            // Modify the result of getDay so that we treat Monday = 0 instead of Sunday = 0
            var startDow = (startDay.getDay() + 6) % 7;
            var endDow = (lastDay.getDay() + 6) % 7;

            // If the month didn't start on a Monday, start from the last Monday of the previous month
            startDay.setDate(startDay.getDate() - startDow);

            // If the month didn't end on a Sunday, end on the following Sunday in the next month
            lastDay.setDate(lastDay.getDate() + (6 - endDow));

            var week = []
            while (startDay <= lastDay) {
                week.push(new Date(startDay));
                if (week.length === 7) {
                    calendarMatrix.push(week);
                    week = []
                }
                startDay.setDate(startDay.getDate() + 1)
            }

            return calendarMatrix;
        }
    },
    computed: {
        // a computed getter
        gridArray: function() {
            var grid = this.getCalendarMatrix(this.selectedMonth);
            return grid;
        },
        formattedDate: function() {
            return this.filterDate ? moment(this.filterDate).format('lll') : '';
        }
    }

});