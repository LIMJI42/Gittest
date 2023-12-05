sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Component"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Component) {
        "use strict";

        return Controller.extend("test.controller.Main", {
            onInit: function () {
                var oModel = new JSONModel();
                oModel.loadData(_rootPath + "/model/products.json", "", false);
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
                var oDataModel = this.getView().getModel();
                var oModel     = this.getView().getModel('pricelist');

                oDataModel.read("/PriceSet",{
                        success: function(oReturn){
                            oModel.setProperty('/price',oReturn.results);
                        
                        }.bind(this)
                });

             

                this.setSlideImagePath();
                   //Get login Data
                this.createContent();
            },
            createContent : function() {
                var oModel = new JSONModel({CustID:""});
                let oComponentData = this.getOwnerComponent().getComponentData();
                if(!oComponentData.startupParameters.CustID) return;
                oModel.CustID = decodeURIComponent(oComponentData.startupParameters.CustID[0]);

                this.getView().getModel('Main').setProperty('/User', oModel.CustID);
            },
            setSlideImagePath : function() {
             
                this.byId('idImageSlide1').setBackgroundImage(_rootPath + '/image/str1.jpg');
                this.byId('idImageSlide2').setBackgroundImage(_rootPath + '/image/str2.jpg');
                this.byId('idImageSlide3').setBackgroundImage(_rootPath + '/image/cucum1.jpg');
                this.byId('idImageSlide4').setBackgroundImage(_rootPath + '/image/cucum22.jpg');
                this.byId('idImageSlide5').setBackgroundImage(_rootPath + '/image/tomato1.jpg');
                this.byId('idImageSlide6').setBackgroundImage(_rootPath + '/image/tomato2.JPG');

            },
            onSelect: function(oEvent) {
                var oWeight = oEvent.getParameters().selectedItem.mProperties.text;
                
                var oWmodel = this.getView().getModel('weight');
                oWmodel.setData(oWeight);
            },
            // onClick: function(code) {
            //     var oWmodel = this.getView().getModel('weight').getData('/');
            //     if(oWmodel=='3kg'||oWmodel=='5kg'){
                   
            //         var oDataModel = this.getView().getModel('cart').getProperty('/Cart'); //아무값도 없는 경우엔 []
            //         var oPrice = this.getView().getModel().oData.Price;
            //         var oPricel = this.getView().getModel('pricelist').getData('/');
            //         var oPNum = oPricel.price.find(m => m.ProductNum = code).ProductPrice //해당하는 제품코드의 상품 가격 가져옴
            //         var oData = {};
            //         var count = 0 ;
            //         var success = false;
            //         var oWeight = this.getView().byId('idCombo').getSelectedKey();
                    
            //         var cart = {
            //                         'ProductCod':code,
            //                         'Price':oPNum
            //                     };

            //         oDataModel.push(cart);
            //         var oModel = this.getView().getModel('cart');
            //         oModel.setProperty('cart',oDataModel);
            //         // this.getView().getModel().setData(cart);
            //         // var oModel = new sap.ui.model.json.JSONModel(oDataModel,"Cart");
            //         // sap.ui.getCore().setModel(oModel,"Cart");
            //         success=true;

            //         if(success)
            //         {
            //             sap.m.MessageToast.show("장바구니에 상품을 담았습니다.", {
            //                 width: "20em"
            //             });
            //         }
            //         // this.onInit();
            //     }
            //     else{ 
            //         sap.m.MessageToast.show("무게를 선택해주세요.", {width: "20em"});
            //     }
            // },
            
            onClick: function(code, isShow, key) {
                var oModel = this.getView().getModel('cart');
                var oPricel = this.getView().getModel('pricelist').getData();
                var aCarts = oModel.getProperty('/Cart') || []; //아무값도 없는 경우엔 []
                var sPrice = oPricel.price.find(m => m.ProductNum = code).ProductPrice;
                var oItem = this.getView().getModel('Main').getData().Products.find(m => m.Code == code);

                aCarts.push({
                    Name            : oItem.Name,
                    ProductCod      : code,
                    Price           : sPrice,
                    Weight          : key || "",
                    ProductPicUrl   : oItem.ProductPicUrl,  
                });

                console.log("장바구니 : ", aCarts);
                oModel.setProperty('/Cart',aCarts);
                sap.m.MessageToast.show("장바구니에 상품을 담았습니다.", {
                    width: "20em"
                });
            },

            onFilterSelect2: function(oEvent){
                //해당하는 obj의 order_num 필요
                    var oOrdNM=oEvent.getParameters().listItem.mAggregations.cells[1].mProperties.text;
                    var oRouter = this.getOwnerComponent().getRouter(); 
                    oRouter.navTo('RouteDetail', { 
                      OrderNum : oOrdNM
                    })
            },
            onFilterSelect: function (oEvent) {
                var skey = oEvent.getParameter("key");
                var oModel = this.getView().getModel('Main');
                var User = oModel.oData.User || "x"; //아무값도 없는 경우엔 ""
                    
                debugger;
                if(User == "" || User == "x")
                {
                    //로그인 정보 없으면 로그인하러가자
                    const oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

                    const hash =
                    (oCrossAppNavigator &&
                        oCrossAppNavigator.hrefForExternal({
                        target: {
                            semanticObject: "Z03SE_Login",
                            action: "display",
                        }
                        })) ||
                    "";
            
                    oCrossAppNavigator.toExternal({
                        target: {shellHash: hash}
                    });

                    return false;
                }

                if (skey == "Cart") {
                    
                    var oRouter = this.getOwnerComponent().getRouter();

                    debugger;
                    oRouter.navTo('RouteDetail',{
                        CustID : User // 필수 파라미터     
                    });
                  
                } 
                else if (skey == "Mypage") { 
                    const oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
        
                    const hash =
                    (oCrossAppNavigator &&
                        oCrossAppNavigator.hrefForExternal({
                        target: {
                            semanticObject: "z03se_sd_f1",
                            action: "display",
                        },
                        params: {CustID: User},
                        })) ||
                    "";
            
                    oCrossAppNavigator.toExternal({
                        target: {shellHash: hash}
                    });
                } 
            },
            formatPrice: function(oValue){
          

            },
            fnImageSet : function(path) {
                return _rootPath + path;
            }

        });
    });
