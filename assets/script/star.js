// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        pickRadius: 0,     //星星距离player小于此距离时，完成收集
    },

    getPlayerDistance: function(){  //获取player节点的位置
        var playerPosition = this.game.player.getPosition();
        //根据两点位置计算两点之间距离
        //sub()返回两个向量相减后的向量  mag()返回向量的长度
        var dist = playerPosition.sub(this.node.position).mag();
        //返回距离
        return dist;
    },

    onPicked: function(){
        //当星星被收集后，调用game脚本中的接口，生成一个新的星星
        this.game.spawnNewStar();
        //得分+1
        this.game.gainScore();
        //销毁当前的星星节点
        this.node.destroy();
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    update: function() {
        //每帧判断和 player 之间的距离是否小于收集距离
        if(this.getPlayerDistance() < this.pickRadius){
            this.onPicked();
            return;
        }
        //根据 game脚本中的计时器，每帧更新星星的透明度 (待完成)
    },
});
