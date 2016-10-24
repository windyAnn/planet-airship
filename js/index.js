(function ($) {

    var SignalDeal = function () {
        //接受信号
        this.accept = function () {


        };
        this.deal = function () {

        }
    };
    var Energy = function () {
        this.gasOil = 100;
        this.energyConsumeTimer = null;//耗油的定时器
        this.energyAddTimer = null;
        this.onNoOil = null;
        this.onLessOil = null;
        this.onFullOil = null;
    };
    Energy.prototype = {
        provide: function () {
            var energySelf = this;
            //消耗能源
            energySelf.energyConsumeTimer = setInterval(function () {
                energySelf.gasOil -= 5;
                if (energySelf.gasOil > 0 && energySelf.gasOil < 20) {
                    if (energySelf.onLessOil) {
                        energySelf.onLessOil();
                    }
                }else {
                    if (energySelf.lessAlert){
                        energySelf.lessAlert.remove();
                        clearInterval(energySelf.alertTimer1);
                    }

                }
                if (energySelf.gasOil <= 0) {
                    clearInterval(energySelf.energyConsumeTimer);
                    if (energySelf.onNoOil) {
                        energySelf.onNoOil();
                    }
                }
            }, 1000);
        },
        charge: function () {
            var energySelf = this;
            energySelf.energyAddTimer = setInterval(function () {
                energySelf.gasOil +=5;
                if (energySelf.gasOil>100){
                    if (energySelf.onFullOil){
                        energySelf.onFullOil();
                    }
                }

            },10);
        }
    };
    var Airship = function () {
        this.planet = $(".planet");
        this.airship = $(".airship");
        this.airship1 = $($(this.airship)[0]);
        this.airship2 = $($(this.airship)[1]);
        this.oilPercentNum = this.airship.find(".oilPercentNum");//油表刻度
        this.oilPercentIcon = this.airship.find(".oilPercentIcon");//油表icon
        this.oilTableObj = this.airship.find(".oil-table");
        this.addOilbtn = $(".addOil");
        this.lessAlert = null;
        this.shipTravelTimer = null;//船行走的定时器
        this.oilConsumeTimer  = null;//耗油的定时器

        this.alertTimer1 = null;
        this.oilTimer = null;
        this.energy = new Energy();
        var that = this;
        this.energy.onNoOil = function () {
            that.stop();
        };
        this.energy.onLessOil = function () {
            that.lessOilAlert();
        };
        this.energy.onFullOil = function () {
            that.turnOffOil();
        };

    };
    Airship.prototype = {
        start: function () {
            this.energy.provide();  //油箱供油
            this.travel();//船开始走
            this.consumeOil(); //消耗能源
        },
        travel: function () {
            //计算两个飞船的半径
            var airshipR1 =
                parseInt(this.planet.height()) / 2 +
                parseInt(this.planet.css("top")) -
                parseInt(this.airship1.css("top"));   //注意取top值

            var airshipR2 =
                -(
                    parseInt(this.airship2.css("top")) -
                    parseInt(this.planet.height()) / 2 -
                    parseInt(this.planet.css("top"))
                );
            var airshipSelf = this,
                rotate = 1;
            airshipSelf.airship1.css({"transform-origin": "50% " + airshipR1 + "px"});
            airshipSelf.airship2.css({"transform-origin": "50% " + airshipR2 + "px"});
            airshipSelf.shipTravelTimer = setInterval(function () {
                rotate += 10;
                airshipSelf.airship.css({
                    "transform": "rotate(" + rotate + "deg)"
                })
            }, 1000);
        },
        consumeOil: function () {
            var oilSelf = this;

            this.oilConsumeTimer = setInterval(function () {
                oilSelf.oilPercentNum.html(oilSelf.energy.gasOil + "%");
                oilSelf.oilPercentIcon.css({
                    "left": -(1 - oilSelf.energy.gasOil / 100) * parseInt(oilSelf.oilPercentIcon.width()) + "px"
                });
            }, 1000);
        },
        //缺油警告   谁传来这个消息呢：   油箱里的传感器
        lessOilAlert: function () {
            this.lessAlert = $('<div class="lessAlert">能量不足20%</div>');
            this.oilTableObj.append(this.lessAlert);
            var alertSelf = this;
            alertSelf.alertTimer1 = setInterval(function () {
                alertSelf.oilTableObj.find(".lessAlert").fadeIn()
                                                        .fadeOut();
                alertSelf.addOilbtn.fadeIn()
                                  .fadeOut();

            },30);

        },
        addOil: function () {
            this.stop();
            this.energy.charge();
            var oilSelf = this;
            this.addOilNumTimer = setInterval(function () {
                oilSelf.oilPercentNum.html(oilSelf.energy.gasOil + "%");
                oilSelf.oilPercentIcon.css({
                    "left": -(1 - oilSelf.energy.gasOil / 100) * parseInt(oilSelf.oilPercentIcon.width()) + "px"
                });
            }, 10);

        },
        turnOffOil: function () {
            clearInterval(this.energy.energyAddTimer);
            clearInterval(this.addOilNumTimer);
        },
        stop: function () {
           clearInterval(this.energy.energyConsumeTimer);//停止邮箱供油
            //停止油表上的油量的减少
            clearInterval(this.oilConsumeTimer);
            //停止船再运动了
            clearInterval(this.shipTravelTimer);
        }
    };

    Airship.prototype.destroy = function () {

    };
    var airship = new Airship();

    $(".start").bind("click",function () {
        airship.start();
    });
    $(".addOil").bind("click",function () {
        airship.addOil();
    });
    $(".reStart").bind("click",function () {
        airship.start();
    });
    $(".destroy").bind("click",function () {
        airship.start();
    });


})(jQuery);