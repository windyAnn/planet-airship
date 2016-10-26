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