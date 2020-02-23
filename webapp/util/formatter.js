sap.ui.define([
    "com/limscloud/app/util/moment"
], function (momentjs) {
    "use strict";

    return {
        formatDateTime: function (oDate) {
            if (oDate !== null) {
                // jQuery.sap.require("sap.ui.core.format.DateFormat");
                // var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({ pattern: "dd-MM-yyyy HH:mm a" });

                var dt = new Date(oDate)
                // return oDateFormat.format(dt);
                return moment(dt).fromNow();
            } else {
                return oDate;
            }

        },

        formatJobStatusText: function (sValue) {
            var sText = null;
            switch (sValue) {
                case '012': {
                    sText = "Assigned";
                }
                    break;
                case '020': {
                    sText = "In Progress"
                }
                    break;
                default: {
                    sText = "Invalid Status"
                }
            }

            return sText;
        },
        formatSButton: function (sValue) {
            var sText = null;
            switch (sValue) {
                case '012': {
                    sText = false;
                }
                    break;
                case '020': {
                    sText = true
                }
                    break;
                default: {
                    sText = false
                }
            }

            return sText;
        }

    };
});