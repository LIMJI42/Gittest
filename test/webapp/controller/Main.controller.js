sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel) {
        "use strict";

        return Controller.extend("test.controller.Main", {
            onInit: function () {
                var oModel = new JSONModel();
                oModel.loadData("../model/products.json");
                this.getView().setModel(oModel);
                // this.byId("idImage").setSrc(_rootPath + "/image/Image1.jpg");
            },
            onClick: function() {
                sap.m.MessageToast.show("장바구니에 상품을 담았습니다.", {
                    width: "20em"
                });

            }
        });
    });
