sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,Filter,MessageBox) {
        "use strict";

        return Controller.extend("test.controller.Detail", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter(); 

                //Detail 라우터에 패턴 매치드 이벤트 붙이기 
                oRouter.getRoute('RouteDetail').attachPatternMatched(this._patternMatched, this);
                // var oData = sap.ui.getCore().getModel("List").oData;
               
                var oDeliv = new JSONModel({info : [], cart: [], price: ''});
                this.getView().setModel(oDeliv,'deliv')
                ////////////
                // var oModel = new JSONModel();
                // oModel.loadData(_rootPath + "/model/products.json");d
                // this.getView().setModel(oModel,'main');
                var oModel = new JSONModel({});
                // var url = jQuery.sap.getModulePath("test", "/model/products.json")
                var url = _rootPath+"/model/products.json";
                    // oModel.attachRequestCompleted(null,function() { 
                    // console.log(oModel.getData()); 
                    // this.getView().setModel(oModel) }, 
                    // this);
                    oModel.loadData(url, "", false);
                    this.getView().setModel(oModel, 'main');
                 
                this._wizard = this.byId("ShoppingCartWizard");
                this._oNavContainer = this.byId("navContainer");
                this._oDynamicPage = this.getPage();
                // this.model = new JSONModel();
                // this.model.attachRequestCompleted(null, function () {
                //     // this.model.getData().ProductCollection.splice(5, this.model.getData().ProductCollection.length);
                //     this.model.setProperty("/selectedPayment", "Credit Card");
                //     this.model.setProperty("/selectedDeliveryMethod", "Standard Delivery");
                //     this.model.setProperty("/differentDeliveryAddress", false);
                //     this.model.setProperty("/CashOnDelivery", {});
                //     this.model.setProperty("/BillingAddress", {});
                //     this.model.setProperty("/CreditCard", {});
                //     this.model.updateBindings();
                // }.bind(this));

                // this.model.loadData(sap.ui.require.toUrl("sap/ui/demo/mock/products.json"));
                // this.getView().setModel(this.model);
            },
            // 라우터 패턴이 "일치할 때마다" 실행  
            _patternMatched: function(oEvent) {
                var oModel = this.getView().getModel('main');
                var oDataModel = this.getView().getModel();

                // var oArgu = oEvent.getParameters().arguments;
                // var CustId = oModel.getData('/').User[0].CustID;
                var CustId = oEvent.getParameters().arguments.CustID;

                console.log(CustId);
                var url = "";

                if(CustId)
                {
                    url = "CustomerSet('" + CustId + "')";
                }
                else{
                    this.onMoveApp();
                }
                
                this.calcTotal();

                if(!CustId){
                    this.getView().getModel().read(url,{
                        success: function(oReturn){
                            this.getView().getModel('deliv').setProperty('/info',oReturn);
                            this.getView().byId('idName').setValue(oReturn.CustName);
                            this.getView().byId('idPhone').setValue(oReturn.CustTel);
                            this.getView().byId('idMail').setValue(oReturn.Email);
                            this.getView().byId('idPost').setValue(oReturn.Postcode);
                            this.getView().byId('idAddr').setValue(oReturn.CustAddr);
                            this.getView().byId('idDAddr').setValue(oReturn.DetailAddr);        
                        }.bind(this)
                    })    
                }
                else{
                    this.getView().getModel().read(`/CustomerSet('${CustId}')`,{
                        success: function(oReturn){
                            this.getView().getModel('deliv').setProperty('/info',oReturn);
                            this.getView().getModel('deliv').setProperty('/info',oReturn);
                            this.getView().byId('idName').setValue(oReturn.CustName);
                            this.getView().byId('idPhone').setValue(oReturn.CustTel);
                            this.getView().byId('idMail').setValue(oReturn.Email);
                            this.getView().byId('idPost').setValue(oReturn.Postcode);
                            this.getView().byId('idAddr').setValue(oReturn.CustAddr);
                            this.getView().byId('idDAddr').setValue(oReturn.DetailAddr);   
                        }.bind(this)
                })}    
            },
            getPage: function () {
                return this.byId("dynamicPage");
            },
            calcTotal: function () {
                var data = this.getOwnerComponent().getModel('cart').getProperty("/Cart");
                debugger;
               
                if (data) {
                    var total = data.reduce(function (prev, current) {
                        prev = prev.Price || prev;
                        return Number(prev) + Number(current.Price);
                    });
                    this.getView().getModel('deliv').setProperty('/price', total.Price || total);
                } else {
                    this.getView().getModel('deliv').setProperty('/price', 0);
                }
            },
    
            handleDelete: function (oEvent) {
                var listItem = oEvent.getParameter("listItem").getTitle();
            
               listItem = listItem.substr(0,2);
               var data = this.getView().getModel('cart').oData.Cart;
              
                if (data.length <= 1) {
                    return;
                }
    
                for (var i = 0; i < data.length; i++) {
                 var dataname = data[i].Name.substr(0,2)
                    if (dataname === listItem) {
                        data.splice(i, 1);
                       

                        this.getView().getModel('cart').setProperty('/Cart',data);
                        debugger;
                        this.calcTotal();
                    
                        break;
                    } }
            },
    
            goToPaymentStep: function () {
                debugger;
                var selectedKey = this.model.getProperty("/selectedPayment");
    
                switch (selectedKey) {
                    case "Credit Card":
                        this.byId("PaymentTypeStep").setNextStep(this.getView().byId("CreditCardStep"));
                        break;
                    case "Bank Transfer":
                        this.byId("PaymentTypeStep").setNextStep(this.getView().byId("BankAccountStep"));
                        break;
                    case "Cash on Delivery":
                    default:
                        this.byId("PaymentTypeStep").setNextStep(this.getView().byId("CashOnDeliveryStep"));
                        break;
                }
            },
    
            setPaymentMethod: function () {
                debugger;
                this.setDiscardableProperty({
                    message: "Are you sure you want to change the payment type ? This will discard your progress.",
                    discardStep: this.byId("PaymentTypeStep"),
                    modelPath: "/selectedPayment",
                    historyPath: "prevPaymentSelect"
                });
            },

            setDifferentDeliveryAddress: function () {
                debugger;
                this.setDiscardableProperty({
                    message: "Are you sure you want to change the delivery address ? This will discard your progress",
                    discardStep: this.byId("BillingStep"),
                    modelPath: "/differentDeliveryAddress",
                    historyPath: "prevDiffDeliverySelect"
                });
            },
    
            setDiscardableProperty: function (params) {
                debugger;
                if (this._wizard.getProgressStep() !== params.discardStep) {
                    MessageBox.warning(params.message, {
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        onClose: function (oAction) {
                            if (oAction === MessageBox.Action.YES) {
                                this._wizard.discardProgress(params.discardStep);
                                history[params.historyPath] = this.model.getProperty(params.modelPath);
                            } else {
                                this.model.setProperty(params.modelPath, history[params.historyPath]);
                            }
                        }.bind(this)
                    });
                } else {
                    history[params.historyPath] = this.model.getProperty(params.modelPath);
                }
            },
    
            billingAddressComplete: function () {
                debugger;
                if (this.model.getProperty("/differentDeliveryAddress")) {
                    this.byId("BillingStep").setNextStep(this.getView().byId("DeliveryAddressStep"));
                } else {
                    this.byId("BillingStep").setNextStep(this.getView().byId("DeliveryTypeStep"));
                }
            },
    
            handleWizardCancel: function () {
                this._handleMessageBoxOpen("구매를 취소하시겠습니까?", "warning");
            },
    
            handleWizardSubmit: function () {
                debugger;
                this._handleMessageBoxOpen("구매하시겠습니까?", "confirm");
            },
    
            backToWizardContent: function () {
                this._oNavContainer.backToPage(this._oDynamicPage.getId());
            },
    
            checkCreditCardStep: function () {
                debugger;
                var cardName = this.model.getProperty("/CreditCard/Name") || "";
                if (cardName.length < 3) {
                    this._wizard.invalidateStep(this.byId("CreditCardStep"));
                } else {
                    this._wizard.validateStep(this.byId("CreditCardStep"));
                }
            },
    
            checkCashOnDeliveryStep: function () {
                debugger;
                var firstName = this.model.getProperty("/CashOnDelivery/FirstName") || "";
                if (firstName.length < 3) {
                    this._wizard.invalidateStep(this.byId("CashOnDeliveryStep"));
                } else {
                    this._wizard.validateStep(this.byId("CashOnDeliveryStep"));
                }
            },
    
            checkBillingStep: function () {
                debugger;
                var address = this.model.getProperty("/BillingAddress/Address") || "";
                var city = this.model.getProperty("/BillingAddress/City") || "";
                var zipCode = this.model.getProperty("/BillingAddress/ZipCode") || "";
                var country = this.model.getProperty("/BillingAddress/Country") || "";
    
                if (address.length < 3 || city.length < 3 || zipCode.length < 3 || country.length < 3) {
                    this._wizard.invalidateStep(this.byId("BillingStep"));
                } else {
                    this._wizard.validateStep(this.byId("BillingStep"));
                }
            },
    
            completedHandler: function () {

                var oBank = this.getView().byId('idBank').getValue();
                var oCash = this.getView().byId('idCash').getState();
                var oMoney = this.getView().byId('idMoney').getValue();
                var oBill = this.getView().byId('idBill').getValue();
                var oName = this.getView().byId('idName').getValue();
                var oPhone = this.getView().byId('idPhone').getValue();
                var oMail = this.getView().byId('idMail').getValue();
                var oPost = this.getView().byId('idPost').getValue();
                var oAddr = this.getView().byId('idAddr').getValue();
                var oDAddr = this.getView().byId('idDAddr').getValue();
     
               
                this.getView().byId('idBank2').setText(oBank);
                this.getView().byId('idCash2').setState(oCash);
                this.getView().byId('idMoney2').setText(oMoney);
                this.getView().byId('idBill2').setText(oBill);
                this.getView().byId('idName2').setText(oName);
                this.getView().byId('idPhone2').setText(oPhone);
                this.getView().byId('idMail2').setText(oMail);
                this.getView().byId('idPost2').setText(oPost);
                this.getView().byId('idAddr2').setText(oAddr);
                this.getView().byId('idDAddr2').setText(oDAddr);

                this._oNavContainer.to(this.byId("wizardBranchingReviewPage"));
                
            },
            //구매 시: create
            _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
                MessageBox[sMessageBoxType](sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            var aCart = this.getView().getModel('cart').oData.Cart;
                            // aCart 변수에 장바구니 배열 데이터가 들어있음 (cart모델은 json, manifest.json에 등록되어 있음)
                            var oName = this.getView().byId('idName').getValue();
                            var oPhone = this.getView().byId('idPhone').getValue();
                            var oMail = this.getView().byId('idMail').getValue();
                            var oPost = this.getView().byId('idPost').getValue();
                            var oAddr = this.getView().byId('idAddr').getValue();
                            var oDAddr = this.getView().byId('idDAddr').getValue();
                            // var oDeliv = { 
                            //                 'CustName': oCart,
                            //                 'CustTel': oPhone,
                            //                 'Mail' : oMail,
                            //                 'Postcode' : oPost,
                            //                 'Addr': oAddr,
                            //                 'Detail': oDAddr,
                            //                 'OrderSet': oCart
                            //             };
                            

                            // -------------------------------------------------------------
                            // Header-Item 구조라서, Deep Create를 해야 됨
                            var oBody = {
                                // Header
                                // 주문 오더에 필요한 헤더 정보를 적어야 됨. 헤더 DB에 추가해야 함
                                id : '',
                                name : '',
                                // Item (장바구니 데이터)
                                ItemSet : aCart // aCart는 장바구니 배열 데이터.
                                                // 배열에 들어간 데이터 1건씩
                                                // 실제 DB Table에 추가되어야 함
                            };

                            // 위 구조로 create 요청을 보내면 알아서 deep create 로직을 탐!
                            this.getView().getModel().create("/헤더셋", oBody, {
                                success: function(oReturn) {},
                                error :function() {}
                            });
                  
                            // -------------------------------------------------------------
                            sap.m.MessageToast.show("구매해주셔서 감사합니다.")
                            this._wizard.discardProgress(this._wizard.getSteps()[0]);
                          
                            var oRouter = this.getOwnerComponent().getRouter(); 
                    oRouter.navTo('RouteMain')
                        }
                    }.bind(this)
                });
            },
    
            handleNavBackToList: function () {
                this._navBackToStep(this.byId("ContentsStep"));
            },
    
            handleNavBackToPaymentType: function () {
                this._navBackToStep(this.byId("PaymentTypeStep"));
            },
    
            handleNavBackToCreditCard: function () {
                this._navBackToStep(this.byId("CreditCardStep"));
            },
    
            handleNavBackToCashOnDelivery: function () {
                this._navBackToStep(this.byId("CashOnDeliveryStep"));
            },
    
            handleNavBackToBillingAddress: function () {
                this._navBackToStep(this.byId("BillingStep"));
            },
    
            handleNavBackToDeliveryType: function () {
                this._navBackToStep(this.byId("DeliveryTypeStep"));
            },
    
            _navBackToStep: function (step) {
                var fnAfterNavigate = function () {
                    this._wizard.goToStep(step);
                    this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
                }.bind(this);
    
                this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
                this._oNavContainer.to(this._oDynamicPage);
            },
            onMoveApp: function () {
                const oCrossAppNavigator = sap.ushell.Container.getService(
                  "CrossApplicationNavigation"
                );

                var custId = this.getView().getModel('CustID').getData();

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
                  target: {
                    shellHash: hash,
                  },
                });
            },
            fnImageSet : function(path) {
                return _rootPath + path;
            }
        });
    });


