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

                var oWeight = new JSONModel();
                this.getView().setModel(oWeight, "weight");
            
                var oCombo = this.getView().byId("idCombo");
            },
            onSelect: function(oEvent) {
                var oWeight = oEvent.getParameters().selectedItem.mProperties.text;
                var oWmodel = this.getView().getModel('weight');
                oWmodel.setData(oWeight);
                debugger;
            },
            onClick: function(code) {
                // debugger;
                var oDataModel = this.getView().getModel().oData.Cart;
                
                var oPrice = this.getView().getModel().oData.Price;
                var oData = {};
                var count = 0 ;
                var success = false;
                var oWeight = this.getView().byId('idCombo').getSelectedKey();
                // debugger;

                // JH
                var sWeight = this.getView().getModel('weight').getData();
                //

                if(oPrice)
                {
                    oPrice = 1000;
                }
                switch(code){
                    case "MM00000002":
                        //딸기 

                        // JH
                        switch(sWeight) {
                            case "3kg":

                            case "5kg":
                        }
                        //
                    case "MM00000003":
                        //딸기 3kg

                        oData = {
                            "Code":"MM00000003",
                            "Name": "딸기 3kg",
                            "Amount": 1,
                            "Price": oPrice * 1
                        };
                        oDataModel.push(oData);

                        success = true;
                        break;
                    case "MM00000004":
                        //딸기 5kg

                        oData = {
                            "Code":"MM00000004",
                            "Name": "딸기 5kg",
                            "Amount": 1,
                            "Price": oPrice * 1
                        };
                        oDataModel.push(oData);

                        success = true;
                        break;
                    case "MM00000005":
                        //딸기잼
                        // if(oDataModel == undefined )
                        // {
                        //     count = 1;
                        // }
                        // else
                        // {
                        //     count = oDataModel.Amount + 1;
                        // }
                        
                        oData = {
                            "Code":"MM00000005",
                            "Name": "딸기잼",
                            "Amount": 1,
                            "Price": oPrice * 1
                        };
                        oDataModel.push(oData);

                        success = true;
                        break;
                    case "MM00000008":
                        //오이 3kg

                        oData = {
                            "Code":"MM00000008",
                            "Name": "오이 3kg",
                            "Amount": 1,
                            "Price": oPrice * 1
                        };
                        oDataModel.push(oData);

                        success = true;
                        break;
                    case "MM00000009":
                        //오이 5kg

                        oData = {
                            "Code":"MM00000009",
                            "Name": "오이 5kg",
                            "Amount": 1,
                            "Price": oPrice * 1
                        };
                        oDataModel.push(oData);

                        success = true;
                        break;
                    case "MM00000010":
                        //피클

                        oData = {
                            "Code":"MM00000010",
                            "Name": "피클",
                            "Amount": 1,
                            "Price": oPrice * 1
                        };
                        oDataModel.push(oData);

                        success = true;
                            
                        break;
                    case "MM00000013":
                        //토마토 3kg

                        oData = {
                            "Code":"MM00000013",
                            "Name": "토마토 3kg",
                            "Amount": 1,
                            "Price": oPrice * 1
                        };
                        oDataModel.push(oData);

                        success = true;
                        break;
                    case "MM00000014":
                        //토마토 5kg

                        oData = {
                            "Code":"MM00000014",
                            "Name": "토마토 5kg",
                            "Amount": 1,
                            "Price": oPrice * 1
                        };
                        oDataModel.push(oData);

                        success = true;
                        break;
                    case "MM00000015":
                        //케첩

                        oData = {
                            "Code":"MM00000015",
                            "Name": "케첩",
                            "Amount": 1,
                            "Price": oPrice * 1
                        };
                        oDataModel.push(oData);

                        success = true;
                            
                        break;

                }
                this.getView().getModel().setData(oDataModel);
                var oModel = new sap.ui.model.json.JSONModel(oDataModel,"Cart");
                sap.ui.getCore().setModel(oModel,"Cart");
                debugger;

                if(success)
                {
                    sap.m.MessageToast.show("장바구니에 상품을 담았습니다.", {
                        width: "20em"
                    });
                }
                
                this.onInit();

            },
            onFilterSelect: function(oEvent){
                //해당하는 obj의 order_num 필요
                    var oOrdNM=oEvent.getParameters().listItem.mAggregations.cells[1].mProperties.text;
                    var oRouter = this.getOwnerComponent().getRouter(); 
                    oRouter.navTo('RouteDetail', { 
                      OrderNum : oOrdNM
                    })
            },
            onFilterSelect: function (oEvent) {
                var skey = oEvent.getParameter("key");
    
                if (skey === "Cart") {
                    var oRouter = this.getOwnerComponent().getRouter(); 
                    oRouter.navTo('RouteDetail')
                   
                } else if (skey === "MyPage") {
                   
                } 
    
            }
        });
    });
