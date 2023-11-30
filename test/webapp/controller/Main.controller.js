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
                this.getView().setModel(oModel,'Main');
                // this.byId("idImage").setSrc(_rootPath + "/image/Image1.jpg");

                var oModel2 = new JSONModel({price: []});
                this.getView().setModel(oModel2,'pricelist');

                var oWeight = new JSONModel();
                this.getView().setModel(oWeight, "weight");
            
                var oCombo = this.getView().byId("idCombo");
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute('RouteMain').attachPatternMatched(this._patternMatched, this);
    
            }, _patternMatched:function(oEvent){
                
              var  oDataModel = this.getView().getModel();
              var oModel = this.getView().getModel('pricelist')
                 oDataModel.read("/PriceSet",{
                  
                     success: function(oReturn){
                       oModel.setProperty('/price',oReturn.results)
                       debugger;
                     }.bind(this)
                 })}
                
                 ,
    
            onSelect: function(oEvent) {
                var oWeight = oEvent.getParameters().selectedItem.mProperties.text;
                
                var oWmodel = this.getView().getModel('weight');
                oWmodel.setData(oWeight);
              
            },
            onClick: function(code) {
                
                var oWmodel = this.getView().getModel('weight').getData('/');
                if(oWmodel=='3kg'||oWmodel=='5kg'){
                   
                var oDataModel = this.getView().getModel('cart').getProperty('/Cart'); //아무값도 없는 경우엔 []
                var oPrice = this.getView().getModel().oData.Price;
                var oPricel = this.getView().getModel('pricelist').getData('/');
                var oPNum = oPricel.price.find(m => m.ProductNum = code).ProductPrice //해당하는 제품코드의 상품 가격 가져옴
                var oData = {};
                var count = 0 ;
                var success = false;
                var oWeight = this.getView().byId('idCombo').getSelectedKey();
                
               var cart = {
                            'ProductCod':code,
                            'Price':oPNum
               }     
                oDataModel.push(cart);
               var oModel = this.getView().getModel('cart');
                oModel.setProperty('cart',oDataModel)
                // this.getView().getModel().setData(cart);
                // var oModel = new sap.ui.model.json.JSONModel(oDataModel,"Cart");
                // sap.ui.getCore().setModel(oModel,"Cart");
               success=true;

                if(success)
                {
                    sap.m.MessageToast.show("장바구니에 상품을 담았습니다.", {
                        width: "20em"
                    });
                }
              debugger;  
                // this.onInit();
            }else{ sap.m.MessageToast.show("무게를 선택해주세요.", {
    width: "20em"
});

            }},
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
    
            },
            formatPrice: function(oValue){
                debugger;

            },
            fnImageSet : function(path) {
                return _rootPath + path;
            }

        });
    });
