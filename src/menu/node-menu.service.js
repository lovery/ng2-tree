"use strict";
var core_1 = require('@angular/core');
var Rx_1 = require('rxjs/Rx');
var NodeMenuService = (function () {
    function NodeMenuService() {
        this.nodeMenuEvents$ = new Rx_1.Subject();
    }
    NodeMenuService.decorators = [
        { type: core_1.Injectable },
    ];
    NodeMenuService.ctorParameters = function () { return []; };
    return NodeMenuService;
}());
exports.NodeMenuService = NodeMenuService;
//# sourceMappingURL=node-menu.service.js.map