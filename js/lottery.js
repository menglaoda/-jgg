/*!
 * lottery v1.0.3
 * by blacksnail2015 2015-03-30
 */
/*
 * 这里对速度做一下说明：
 *     这里的速度其实就是切换样式的间隔时间，也就是setTimeout(functionName, time)中的time值；
 *     因此，速度值越小，间隔越短，转的越快。
 */
var defaults = {
	selector:     '#lottery',
	width:        4,    // 转盘宽度
	height:       4,    // 转盘高度
	initSpeed:    300,	// 初始转动速度
	speed:        0,	// 当前转动速度
	upStep:       50,   // 加速滚动步长
	upMax:        50,   // 速度上限
	downStep:     30,   // 减速滚动步长
	downMax:      500,  // 减速上限
	waiting:      3000, // 匀速转动时长
	index:        0,    // 初始位置
	target:       7,    // 中奖位置，可通过后台算法来获得，默认值：最便宜的一个奖项或者"谢谢参与"
	isRunning:    false, // 当前是否正在抽奖
	num:          3      //允许抽奖次数
}

var lottery = {

	// 初始化用户配置
	lottery: function (options) {
		this.options = $.extend(true, defaults, options);
		this.options.speed = this.options.initSpeed;
		this.container = $(this.options.selector);
		this._setup();
	},

	// 开始装配转盘
	_setup: function () {

		// 这里为每一个奖项设置一个有序的下标，方便lottery._roll的处理
		// 初始化第一行lottery-group的序列
		for (var i = 0; i < this.options.width; ++i) {
			this.container.find('.lottery-group:first .lottery-unit:eq(' + i + ')').attr('lottery-unit-index', i);
		}

		// 初始化最后一行lottery-group的序列
		for (var i = lottery._count() - this.options.height + 1, j = 0, len = this.options.width + this.options.height - 2; i >= len; --i, ++j) {
			this.container.find('.lottery-group:last .lottery-unit:eq(' + j + ')').attr('lottery-unit-index', i);
		}

		// 初始化两侧lottery-group的序列
		for (var i = 1, len = this.options.height - 2; i <= len; ++i) {
			this.container.find('.lottery-group:eq(' + i + ') .lottery-unit:first').attr('lottery-unit-index', lottery._count() - i);
			this.container.find('.lottery-group:eq(' + i + ') .lottery-unit:last').attr('lottery-unit-index', this.options.width + i - 1);
		}
		this._enable();
	},

	// 开启抽奖
	_enable: function () {
		this.container.find('a').bind('click', this.beforeRoll);
	},

	// 禁用抽奖
	_disable: function () {
		this.container.find('a').unbind('click', this.beforeRoll);
	},

	// 转盘加速
	_up: function () {
		var _this = this;
		if (_this.options.speed <= _this.options.upMax) {
			_this._constant();
		} else {
			_this.options.speed -= _this.options.upStep;
			_this.upTimer = setTimeout(function () { _this._up(); }, _this.options.speed);
		}
	},

	// 转盘匀速
	_constant: function () {
		var _this = this;
		clearTimeout(_this.upTimer);
		setTimeout(function () { _this.beforeDown(); }, _this.options.waiting);
	},

	// 减速之前的操作，支持用户追加操作（例如：从后台获取中奖号）
	beforeDown: function () {
		var _this = this;
		_this.aim();
		if (_this.options.beforeDown) {
			_this.options.beforeDown.call(_this);
		}
		_this._down();
	},

	// 转盘减速
	_down: function () {
		var _this = this;
		if (_this.options.speed > _this.options.downMax && _this.options.target == _this._index()) {
			_this._stop();
		} else {
			_this.options.speed += _this.options.downStep;
			_this.downTimer = setTimeout(function () { _this._down(); }, _this.options.speed);
		}
	},

	// 转盘停止，还原设置
	_stop: function () {
		var _this = this;
		clearTimeout(_this.downTimer);
		clearTimeout(_this.rollerTimer);
		_this.options.speed = _this.options.initSpeed;
		_this.options.isRunning = false;
		_this._enable();
		console.log(this.options.target);
		_this.tanchu();
	},

	// 抽奖之前的操作，支持用户追加操作
	beforeRoll: function () {
		var _this = lottery;
		_this._disable();
		if (_this.options.beforeRoll) {
			_this.options.beforeRoll.call(_this);
		}
		_this._roll();
	},

	// 转盘滚动
	_roll: function () {
		var _this = this;
		_this.container.find('[lottery-unit-index=' + _this._index() + ']').removeClass("active");
		++_this.options.index;
		_this.container.find('[lottery-unit-index=' + _this._index() + '].lottery-unit').addClass("active");
		_this.rollerTimer = setTimeout(function () { _this._roll(); }, _this.options.speed);
		if (!_this.options.isRunning) {
			_this._up();
			_this.options.isRunning = true;
		}
	},

	// 转盘当前格子下标
	_index: function () {
		return this.options.index % this._count();
	},

	// 转盘总格子数
	_count: function () {
		return this.options.width * this.options.height - (this.options.width - 2) * (this.options.height - 2);
	},

	// 获取中奖号，用户可重写该事件，默认随机数字
	aim: function () {
		if (this.options.aim) {
			this.options.aim.call(this);
		} else {
			this.options.target = parseInt(parseInt(Math.random() * 10) * this._count() / 10);
			console.log(this.options.target);
		}
	},
	//弹出中奖框
	tanchu: function(){
		var cs = document.querySelector(".cs");//抽奖次数
		this.options.num--;
		var box = document.querySelector(".box");//透明度调低，
		var topic1 = document.querySelector(".topic1");//透明度调低，
		var prize = document.querySelector(".prize");//奖品
		var prize_h4 = document.querySelector(".prize_h4");//具体奖品
		var zj = document.querySelector(".zj");
		var p_nr = document.querySelector(".p_nr");
		var p_qd = document.querySelector(".p_qd");
		var oimg = document.querySelector("#oimg");
		box.style.opacity = "0.7";
		topic1.style.opacity = "0.7";
		zj.style.display = "block";
		//如果抽奖次数小于0，弹出不可抽奖提示框
		if(this.options.num ==0){
			cs.innerHTML = 0;
			oimg.onclick = function(){
				console.log("aaa");
				zj.style.display = "block";
			    p_nr.innerHTML = "抽奖次数已用完，请下次再来！";
			    lottery._disable();
			}
			
		}else{
			cs.innerHTML = this.options.num;
		}
		var i = ["感谢您的参与！","收获一枚逗比小萝莉","感谢您的参与！","收获一枚可爱小萝莉","感谢您的参与！",
		"获得免佣卷2元","感谢您的参与！","收获一枚可爱小萝莉"];
		if(this.options.target==1 ||this.options.target==3 || this.options.target==5 || this.options.target==7  ){
			p_nr.innerHTML = "恭喜你，"+i[this.options.target];
			if(prize_h4!=null){
				prize.removeChild(prize_h4);//移除未中奖
			}
			var prize_h = document.createElement("h4");
			prize.appendChild(prize_h);
			prize_h.className = "prize_h";
			prize_h.innerHTML = i[this.options.target];
		}else{
			p_nr.innerHTML = "未中奖，"+i[this.options.target];
		}
		
		//点击确定，中奖提示框消失
		p_qd.onclick =function(){
			zj.style.display = "none";
			box.style.opacity = "1";
		    topic1.style.opacity = "1";
		}
		
	}
	
};