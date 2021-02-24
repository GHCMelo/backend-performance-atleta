module.exports ={ 
    getWeekNumber(data){
        Date.prototype.getWeek = function() {
            var onejan = new Date(this.getFullYear(), 0, 1);
            return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        }

        let weekNumber = (new Date(data)).getWeek() + "-" + new Date(data).getFullYear();

        return weekNumber;
    }
}