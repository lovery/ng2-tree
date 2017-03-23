"use strict";
var core_1 = require('@angular/core');
var Rx_1 = require('rxjs/Rx');
var MenuService = (function () {
    function MenuService() {
        this.menuEvents$ = new Rx_1.Subject();
    }
    MenuService.decorators = [
        { type: core_1.Injectable },
    ];
    MenuService.ctorParameters = function () { return []; };
    return MenuService;
}());
exports.MenuService = MenuService;
//# sourceMappingURL=menu.service.js.map