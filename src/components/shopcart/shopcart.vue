<template>
  <div>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-box">
          <div class="logo" :class="{highlight:totalCount>0}">
            <i class="icon-shopping_cart" :class="{highlight:totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{highlight:totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" @click.stop.prevent="pay"
             :class="this.totalPrice < this.minPrice ? 'not-enough' : 'enough'">
          {{payDesc}}
        </div>
      </div>
    </div>
    <div class="ball-container">
      <div v-for="(ball,index) in balls" :key="index">
        <transition
          @before-enter="beforeEnter"
          @enter="enter"
          @after-enter="afterEnter">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="(food,index) in selectFoods" :key="index">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}.</span>
              </div>
              <div class="cartcontrol-box">
                <cartcontrol :food="food" @cartAdd="cartAdd"></cartcontrol>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script>
  import BScroll from "better-scroll"
  import cartcontrol from "../../components/cartcontrol/cartcontrol"
  export default {
    name: "shopcart",
    props:{
      selectFoods:{
        type:Array,
        default(){
          return[]
        }
      },
      deliveryPrice:{
        type:Number,
        default:0
      },
      minPrice:{
        type:Number,
        default:0
      },
    },
    data(){
      return{
        balls: [
          {
            show:false
          },
          {
            show:false
          },
          {
            show:false
          },
          {
            show:false
          },
          {
            show:false
          },
        ],
        dropBalls: [],
        fold: true
      }
    },
    components:{
      cartcontrol
    },
    computed:{
      totalPrice() { //总价
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() { //总数
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      // payClass() {
      //   if (this.totalPrice < this.minPrice) {
      //     return 'not-enough';
      //   } else {
      //     return 'enough';
      //   }
      // },
      listShow(){ //购物车列表显示
        if(!this.totalCount){
          this.fold = true;
          return false
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods:{
      //遍历小球，拿出show的小球
      drop(target){
        // console.log(target)
        for(let i=0; i<this.balls.length; i++){
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = target; //设置小球的el属性为这个dom对象
            this.dropBalls.push(ball);
            return; //此处return终结函数,这意味着每次触发事件,dropBalls内只增加一个ball
          }
        }
      },
      //遍历所有show的小球,小球飞入购物车动画
      beforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect(); //获取元素相对于视口的位置
            let x = rect.left - 32; //小球掉落X轴起点
            let y = -(window.innerHeight - rect.top - 22); //小球掉落Y轴起点,向下为负
            el.style.display = "";
            el.style.webkitTransform = `translate3d(0, ${y}px,0)`; /* Safari 和 Chrome */
            el.style.transform = `translate3d(0, ${y}px,0)`; //旋转div元素
            // 处理内层动画
            let inner = el.getElementsByClassName("inner-hook")[0];
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter(el,done) {
        //关闭ESlint语法监测，因为ES6语言规范会让被申明却未被调用的变量报错
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight; //申明rf是为了触发浏览器的重排
        this.$nextTick(() => {
          //修改数据之后立即使用这个方法，获取更新后的 DOM。
          el.style.webkitTransform = "translate3d(0, 0, 0)"; /* Safari 和 Chrome */
          el.style.transform = "translate3d(0, 0, 0)"; //旋转div元素
          let inner = el.getElementsByClassName("inner-hook")[0];
          inner.style.webkitTransform = "translate3d(0, 0, 0)";
          inner.style.transform = "translate3d(0, 0, 0)";
          el.addEventListener('transitionend', done); //Vue为了知道过渡的完成，否则无法进入到afterEnter中
        });
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift(); //把数组的第一个元素从其中删除，并返回第一个元素的值。
        if (ball) {
          ball.show = false;
          el.style.display = "none"; //隐藏小球
        }
      },
      //显示关闭购物车列表
      toggleList(){
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      //接收cartcontrol传过来的DOM
      cartAdd(target){
        this.$nextTick(() => { //体验优化，异步执行下落动画，画面不容易卡顿。
          this.drop(target);
        });
      },
      //清空列表
      empty(){
        this.selectFoods.forEach((food) => {
          food.count=0
        })
      },
      //点击背景列表关闭
      hideList(){
        this.fold=true
      },
      //结算按钮，阻止冒泡
      pay(){
        if(this.totalPrice<this.minPrice){
          return
        }
        alert(`支付${this.totalPrice}元`)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../common/styles/mixin.scss";

  .shopcart{
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 50;
    width: 100%;
    height: 48px;
    .content{
      display: flex;
      background: #141d27;
      font-size: 0;
      color: rgba(255,255,255,.4);
      .content-left{
        flex: 1;
        .logo-box{
          display: inline-block;
          vertical-align: top;
          position: relative;
          top: -10px;
          margin: 0 12px;
          padding: 6px;
          width: 56px;
          height:56px;
          box-sizing: border-box;
          border-radius: 50%;
          background: #141d27;
          .logo{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            text-align: center;
            background: #2b343c;
            &.highlight{
              background: rgb(0,160,220);
            }
            .icon-shopping_cart{
              line-height: 44px;
              font-size: 24px;
              color: #80858a;
              &.highlight{
                color: #fff;
              }
            }
          }
          .num{
            position: absolute;
            top: 0;
            right: 0;
            width: 24px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            border-radius: 16px;
            font-size: 9px;
            font-weight: 700;
            color: #fff;
            background: rgb(240,20,20);
            box-shadow: 0 4px 8px 0 rgba(0,0,0,.4);
          }
        }
        .price{
          display: inline-block;
          vertical-align: top;
          margin-top: 12px;
          padding-right: 12px;
          line-height: 24px;
          box-sizing: border-box;
          border-right: 1px solid rgba(255,255,255,.1);
          font-size: 16px;
          font-weight: 700;
          &.highlight{
            color: #fff;
          }
        }
        .desc{
          display: inline-block;
          vertical-align: top;
          margin: 12px 0 0 12px;
          line-height: 24px;
          font-size: 10px;
        }
      }
      .content-right{
        flex: 0 0 105px;
        width: 105px;
        .pay{
          height: 48px;
          line-height: 48px;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          background: #2b333b;
          &.not-enough{
            background: #2b333b;
          }
          &.enough{
            background: #00b43c;
            color: #fff;
          }
        }
      }

    }
    .ball-container{
      .ball{
        position: fixed;
        left: 32px;
        bottom: 22px;
        z-index: 200;
        transition: all .4s cubic-bezier(0.49, -0.29, 0.75, 0.14); //贝塞尔曲线
        .inner{
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: rgb(0, 160, 220);
          transition: all 0.4s linear;
        }
      }
    }
    .shopcart-list{
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      width: 100%;
      transform: translate3d(0, -100%, 0);
      &.fold-enter-active,&.fold-leave-active{
        transition: all 0.5s;
      };
      &.fold-enter,&.fold-leave-to{
        transform: translate3d(0, 0, 0)
      }
      .list-header{
        height: 40px;
        line-height: 40px;
        padding: 0 18px;
        background: #f3f5f7;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        .title{
          float: left;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }
        .empty{
          float: right;
          font-size: 12px;
          color: rgb(0, 160, 220)
        }
      }
      .list-content{
        padding: 0 18px;
        max-height: 217px;
        overflow: hidden;
        background: #fff;
        .food{
          position: relative;
          padding: 12px 0;
          box-sizing: border-box;
          @include border-1px(rgba(7, 17, 27, 0.1));
          .name{
            line-height: 24px;
            font-size: 14px;
            color: rgb(7, 17, 27);
          }
          .price{
            position: absolute;
            right: 90px;
            bottom: 12px;
            line-height: 24px;
            font-size: 14px;
            font-weight: 700;
            color: rgb(240, 20, 20);
          }
          .cartcontrol-box{
            position: absolute;
            right: 0;
            bottom: 6px;
          }
        }
      }
    }
  }
  //背景需放在shopcart外边
  .list-mask{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    backdrop-filter: blur(10px);
    opacity: 1;
    background: rgba(7, 17, 27, 0.6);
    &.fade-enter-active,&.fade-leave-active{
      transition: all 0.5s
    }
    &.fade-enter,&.fade-leave-to{
      opacity: 0;
      background: rgba(7, 17, 27, 0)
    }
  }
</style>
