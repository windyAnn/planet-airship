(function ($) {

    var Engine = function () {
        this.energy = new Energy();
    };
    Engine.prototype = {
        start: function () {
            this.energy.provide();

        },
        stop: function () {
            clearInterval(this.energy.energyConsumeTimer);
        }
    };
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
        this.energyIncreaseTimer = null;
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
                }
                if (energySelf.gasOil <= 0) {
                    clearInterval(energySelf.energyTimer);
                    if (energySelf.onNoOil) {
                        energySelf.onNoOil();
                    }
                }
            }, 1000);
        },
        charge: function () {
            var energySelf = this;
            energySelf.energyAddTimer = setInterval(function () {
                energySelf.gasOil +=20;
                if (energySelf.gasOil<=100&& energySelf.gasOil>80){
                    energySelf.gasOil = 100;
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
        this.airshipTimer = null;
        this.addOilNumTimer = null;
        this.alertTimer = null;
        this.oilTimer = null;
        this.engine = new Engine();
        var that = this;
        this.engine.energy.onNoOil = function () {
            that.stop();
        };
        this.engine.energy.onLessOil = function () {
            that.addOil();
          //  that.engine.energy.charge();
        };
        this.engine.energy.onFullOil = function () {
            that.turnOffOil();
        };

    };
    Airship.prototype = {
        start: function () {
            this.engine.start();
            this.travel();
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
            console.log(airshipR2 + "aaa" + airshipR1);
            airshipSelf.airship1.css({"transform-origin": "50% " + airshipR1 + "px"});
            airshipSelf.airship2.css({"transform-origin": "50% " + airshipR2 + "px"});
            airshipSelf.airshipTimer = setInterval(function () {
                rotate += 10;
                airshipSelf.airship.css({
                    "transform": "rotate(" + rotate + "deg)"
                })
            }, 1000);
            this.oilTable();
        },//启动会机器会走
        addOil: function () {
            this.engine.energy.charge();
            this.addOilNumTimer = setInterval(function () {
                oilSelf.oilPercentNum.html(oilSelf.engine.energy.gasOil + "%");
                oilSelf.oilPercentIcon.css({
                    "left": -(1 - oilSelf.engine.energy.gasOil / 100) * parseInt(oilSelf.oilPercentIcon.width()) + "px"
                });
                console.log(-(1 - oilSelf.engine.energy.gasOil / 100) * parseInt(oilSelf.oilPercentIcon.width()))
            }, 10);
        },
        oilTable: function () {     //油表也会走
            var oilSelf = this;
            this.oilTimer = setInterval(function () {
                oilSelf.oilPercentNum.html(oilSelf.engine.energy.gasOil + "%");
                oilSelf.oilPercentIcon.css({
                    "left": -(1 - oilSelf.engine.energy.gasOil / 100) * parseInt(oilSelf.oilPercentIcon.width()) + "px"
                });
                console.log(-(1 - oilSelf.engine.energy.gasOil / 100) * parseInt(oilSelf.oilPercentIcon.width()))
            }, 1000);
        },
        lessOil: function () {
            var $lessAlert = $('<div class="lessAlert">能量不足20%</div>');
            this.oilTableObj.append($lessAlert);
            var alertSelf = this;
            alertSelf.alertTimer1 = setInterval(function () {
                alertSelf.oilTableObj.find(".lessAlert").fadeIn();
                alertSelf.oilTableObj.find(".lessAlert").fadeOut();
            },30);
        },
        turnOffOil: function () {
            clearInterval(this.engine.energy.energyIncreaseTimer);
        },
        stop: function () {
            this.engine.stop();
            clearInterval(this.airshipTimer);
        }
    };

    Airship.prototype.destroy = function () {

    };
    var airship = new Airship();

    $(".start").bind("click",function () {
        airship.start();
    });
    $(".addOil").bind("click",function () {
        airship.start();
    });
    $(".reStart").bind("click",function () {
        airship.start();
    });
    $(".destroy").bind("click",function () {
        airship.start();
    });


})(jQuery);