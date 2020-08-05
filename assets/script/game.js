// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

//game脚本为游戏主逻辑脚本
cc.Class({
    extends: cc.Component,

    properties: {
        //引用星星预制资源
        starPrefab: {
            default: null,
            type: cc.Prefab,
        },
        //星星产生后随机消失的时间范围
        maxStarDuration: 0,
        minStarDuration: 0,
        //地面节点，用于确定星星的高度
        ground: {
            default: null,
            type: cc.Node,
        },
        //player节点，用于获取主角弹跳的高度，和控制主角行动开关
        player: {
            default: null,
            type: cc.Node,
        },
        scoreBoard: {
            default: null,
            type: cc.Label,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function(){
        //获取地平面的 y 轴坐标
        this.groundY = this.ground.y + this.ground.height/2;  //因为地平面锚点是中间
        //初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        //生成一个新星星
        this.spawnNewStar();
        //初始化score
        this.score = 0;
    },

    spawnNewStar: function(){
        //使用给定的模板在场景中生成一个新节点
        var newStar = cc.instantiate(this.starPrefab); //instantiate方法：克隆对象，或从prefab实例化出新节点
        //将新节点添加到 Canvas 节点下面
        this.node.addChild(newStar);
        //为星星设置一个随机位置  setPosition()设置节点在父节点坐标系中的位置
        newStar.setPosition(this.getNewStarPosition());    //setPosition 接收cc.v2 或者 x,y两种参数
        //获取newStar节点下的star组件，并在这个组件中添加game属性，将this(当前组件)赋值给这个属性
        //js中这样写代表声明game属性   当前组件中有player的组件，可以获取player的位置信息
        newStar.getComponent('star').game = this;
        //重置计时器，根据消失时间范围随机取一个值
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function(){
        //根据地平面位置和主角跳跃高度，随机得到一个星星的 y 坐标
        var randY = this.groundY + this.player.jumpHeight * Math.random();
        //根据屏幕宽度，随机得到一个星星的 x 坐标
        var maxX = this.node.width/2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        //返回星星坐标
        return cc.v2(randX, randY);
    },

    start () {

    },

    update: function (dt) {
        //每帧更新计时器，超过限度还没有生成新的星星，就调用游戏失败逻辑
        if(this.timer > this.maxStarDuration){
            this.gameOver();
            return;
        }
        this.timer += dt;
    },

    gainScore: function () {
        this.score += 1;
        // 更新 scoreDisplay Label 的文字
        this.scoreBoard.string = 'Score: ' + this.score;
    },

    gameOver: function(){
        this.player.stopAllActions(); //停止 player 节点的跳跃动作
        cc.director.loadScene('Game'); //重新加载游戏场景‘game’
    },
});
