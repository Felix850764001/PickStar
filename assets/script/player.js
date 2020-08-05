// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {                //保存结点的属性
        jumpHeight : 0,
        jumpDuration : 0,      //跳跃持续时间
        maxMoveSpeed: 0,      //最大移动速度
        Accel : 0,           //加速度
    },

    setJumpAction: function(){       //让主角跳起来
        //moveBy(动作时间，V2向量/x坐标，/y坐标) 返回一个ActionInterval类对象，表示在一定时间内完成
        //代码含义：在jumpDuration时间内，移动到相对于结点位置的(0, jumpHeight) easing部分实现缓动效果
        //  向上跳
        var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // 下落
        var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // 不断重复
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown));
    },

    onKeyDown(event){
        switch(event.keyCode){
            case cc.macro.KEY.a:
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                this.accRight = true;
                break;
        }
    },

    onKeyUp(event){
        switch(event.keyCode){
            case cc.macro.KEY.a: this.accLeft = false;
                break;
            case cc.macro.KEY.d: this.accRight = false;
                break;
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {
        this.jumpAction = this.setJumpAction();  //赋值setJumpAction方法
        this.node.runAction(this.jumpAction);

        //加速度开关
        this.accLeft = false;     //如果 properties中未定义 此处就是声明变量的意思
        this.accRight = false;

        //主角当前移动速度
        this.speedX = 0;

        //初始化键盘输入监听    (type, callback, target)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    //取消键盘输入监听
    onDestroy(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    start () {

    },

    update: function(dt){     // dt == 两帧之间的间隔时间
        //根据加速度方向，每帧更新速度
        if(this.accLeft){
            this.speedX -= this.Accel * dt;
        }
        else if(this.accRight){
            this.speedX += this.Accel * dt;
        }
   
        //限制player速度不能超出最大速度
        if(this.speedX > this.maxMoveSpeed){
            this.speedX = this.maxMoveSpeed * this.speedX / Math.abs(this.speedX);
        }

        //获取当前player节点位置
        if(this.node.x + this.speedX * dt > 438){
            this.node.x = 438;
            this.speedX = 0;
        }
        else if(this.node.x + this.speedX * dt < -438){
            this.node.x = -438;
            this.speedX = 0;
        }
        else{
            this.node.x += this.speedX * dt;
        }
    },
});
