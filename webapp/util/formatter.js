sap.ui.define([], function () {
    "use strict";

    return {
        formatDateTime: function (oDate) {
            if (oDate !== null) {
                jQuery.sap.require("sap.ui.core.format.DateFormat");
                var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "dd-MM-yyyy HH:mm a" });

                var dt = new Date(oDate)
                return oDateFormat.format(dt);
            } else {
                return oDate;
            }

        },

        formatJobStatusText: function (sValue) {
            if (sValue === null || sValue === '') {
                return "Not started"
            } else if (sValue === 'P') {
                return "In Progress"
            } else if (sValue === 'C') {
                return "Complete"
            }

            return "Undefined"
        },

        formatJobStatusValueState: function (sValue) {
            if (sValue === null || sValue === '') {
                return "None"
            } else if (sValue === 'P') {
                return "Warning"
            } else if (sValue === 'C') {
                return "Success"
            }
            return "None"
        },


        formatXFLAG: function (sValue) {
            if (sValue === null || sValue === '' || sValue === 'M') {
                return true;
            } else if (sValue === 'T') {
                return false;
            } else if (sValue === 'X') {
                return false;
            }

            return false;
        },

        formatSButton: function (sValue) {
            if (sValue === null || sValue === '') {
                return true
            } else if (sValue === 'P') {
                return true
            } else if (sValue === 'C') {
                return false
            }
            return false;            
        }
    };
});