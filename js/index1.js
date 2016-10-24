(function ($) {


    var Engine = function () {
        this.gasOil = 100;
        this.powerTimer = null;

        this.oilPercentNum = $(".oilPercentNum");
        this.oilPercentColor = $(".oilPercentColor");
        this.oilPercentColorWidth = parseInt(this.oilPercentColor.width());
        this.onNoGas = null;
    };
    Engine.prototype = {
        start: function () {
            var powerSelf = this;
            powerSelf.powerTimer = setInterval(function () {
                powerSelf.gasOil -=5;
                // console.log($(powerSelf.oilPercentNum));
                powerSelf.oilPercentNum.html(powerSelf.gasOil + "%");
                powerSelf.oilPercentColor.css({"left" : -(1-(powerSelf.gasOil/100))*powerSelf.oilPercentColorWidth + "px"})
                if (powerSelf.gasOil<=0){
                    clearInterval(powerSelf.powerTimer);
                    if (powerSelf.onNoGas)
                        powerSelf.onNoGas();
                }

            }, 1000);

        },
        stop: function () {
            clearInterval(this.powerTimer);
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
        this.energyTimer = null;
    };
    Energy.prototype = {
        provide: function () {
            var energySelf = this;
            //消耗能源
            energySelf.energyTimer = setInterval(function () {
                energySelf.gasOil -=5;
            }, 1000);
        },
        charge: function () {

        }
    };
    var Airship = function () {
        this.planet = $(".planet");
        this.airship = $(".airship");
        this.airship1 = $(this.airship)[0];
        this.airship2 = $(this.airship)[1];
        this.airshipTimer = null;
        this.engine = new Engine();
        var that = this;
        this.engine.onNoGas = function () {
            that.stop();
        };

    };
    Airship.prototype= {
        start: function () {
            this.power.start();
            this.travel();
        },
        travel: function () {
            //计算两个飞船的半径
            var airshipR1 =
                parseInt($(this.planet).height() )/2+
                parseInt($(this.planet).css("top"))-
                parseInt($(this.airship1).css("top"));   //注意取top值

            var airshipR2 =
                -(
                    parseInt($(this.airship2).css("top"))-
                    parseInt($(this.planet).height())/2-
                    parseInt($(this.planet).css("top"))
                );
            var airshipSelf = this,
                rotate = 1;
            console.log(airshipR2+ "aaa"+airshipR1);
            $(airshipSelf.airship1).css({"transform-origin": "50% "+airshipR1+"px"});
            $(airshipSelf.airship2).css({"transform-origin": "50% " +airshipR2+"px"});
            airshipSelf.airshipTimer  = setInterval(function () {
                rotate+=10;
                $(airshipSelf.airship).css({
                    "transform": "rotate(" + rotate + "deg)"
                })
            },1000)
        },
        stop: function () {
            this.power.stop();
            clearInterval(this.airshipTimer);
        }
    };

    Airship.prototype.destroy = function () {

    };

    var airship = new Airship();
    airship.start();


})(jQuery);