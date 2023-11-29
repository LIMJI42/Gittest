sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,Filter) {
        "use strict";

        return Controller.extend("test.controller.Detail", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter(); 

                //Detail 라우터에 패턴 매치드 이벤트 붙이기 
                oRouter.getRoute('RouteDetail').attachPatternMatched(this._patternMatched, this);
                
                // var oData = sap.ui.getCore().getModel("List").oData;
                var oList = this.getView().byId("iDList");
                
                // oList.getBinding("ProductCollection",oData);
            },
            // 라우터 패턴이 "일치할 때마다" 실행  
            _patternMatched: function(oEvent) {
                var oList = this.getView().byId("iDList");
                var oData = sap.ui.getCore().getModel("List")
                var oView = this.getView();
                oList.bindAggregation("items",oData);
                oView.setModel(oData,"List2");
                var oDataModel = this.getView().getModel();
                debugger;
                var oFilter = new Filter('Cust_Id','EQ','C00000001'); //Cust_ID 변경!
                oDataModel.read("/CustomerSet",{
    
                    filters: [oFilter] , //sap.ui.model.Filter[] 배열에 필터 객체 여러개 넣을 수 있음
                    success: function(oReturn){
                        var oCust = oReturn.results[0]
                        this.getView().getModel('main').setData(oCust);
                    }.bind(this)
                })
            }
        });
    });


