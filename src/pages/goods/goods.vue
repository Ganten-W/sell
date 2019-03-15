<template>
  <div class="goods">
    <div class="menu-box" ref="menuBox">
      <ul>
        <li v-for="(value,index) in goodsProp"
            :key="index"
            @click="selectMenu(index,$event)"
            :class="{current: currentIndex===index}"
            class="menu-item">
          <span class="text">
            <span v-show="value.type>0" class="icon"
                  :class="classMap[value.type]"></span>{{value.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-box" ref="foodsBox">
      <ul>
        <li v-for="(val,index1) in goodsProp" :key="index1"
            class="food-list food-list-hook" ref="foodList">
          <h1 class="title">{{val.name}}</h1>
          <ul>
            <li v-for="(food,index2) in val.foods" :key="index2" class="food-item">
              <div class="icon">
                <img width="57px" height="57px" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}</span>
                  <span>好评率{{food.rating}}</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-box">
                  <cartcontrol :food="food" @cartAdd="cartAdd"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart
      ref="shopcart"
      :select-foods="selectFoods"
      :delivery-price="sellerProp.deliveryPrice"
      :min-price="sellerProp.minPrice"></shopcart>
  </div>
</template>

<script>
  import BScroll from "better-scroll"
  import shopcart from "../../components/shopcart/shopcart"
  import cartcontrol from "../../components/cartcontrol/cartcontrol"

  export default {
    name: "goods",
    props:{
      sellerProp:Object,
      goodsProp:Array
    },
    data(){
      return {
        listHeight:[],
        scrollY:0,
      }
    },
    computed:{
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods(){
        let foods=[];
        this.goodsProp.forEach((good)=>{
          good.foods.forEach((food)=>{
            if(food.count>0){
              foods.push(food)
            }
          })
        });
        return foods
      }
    },
    components:{
      shopcart,
      cartcontrol
    },
    created(){
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    methods:{
      //两栏滚动
      _initScroll() {
        this.menuScroll=new BScroll(this.$refs.menuBox, {click:true});
        this.foodsScroll=new BScroll(this.$refs.foodsBox, {
          click:true,
          probeType:3
        });
        this.foodsScroll.on('scroll',(pos)=>{
          this.scrollY=Math.abs(Math.round(pos.y))
        })
      },
      // 获得高度
      calculateHeight() {
        let foodList = this.$refs.foodsBox.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      // 左右联动
      selectMenu(index,event){
        if (!event._constructed) {
          return;
        }
        let foodList=this.$refs.foodList;
        let el=foodList[index];
        this.foodsScroll.scrollToElement(el,300)
      },
      // 接收cartcontrol组件传来的DOM
      cartAdd(target){
        this.$nextTick(() => { //体验优化，异步执行下落动画，画面不容易卡顿。
          this.$refs.shopcart.drop(target);
        });
      },
    },
    mounted(){
      this._initScroll();
      this.calculateHeight();
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../common/styles/mixin.scss";

  .goods {
    display: flex;
    position: absolute;
    top: 174px;
    bottom: 46px;
    width: 100%;
    overflow: hidden;

    .menu-box {
      flex: 0 0 80px;
      width: 80px;
      background: #f3f5f7;
      .menu-item{
        display: table;
        height: 54px;
        width: 56px;
        padding: 0 12px;
        line-height:14px;
        &.current{
          position: relative;
          z-index: 10;
          margin-top: -1px;
          background: #fff;
          font-weight: 700;
          .text{
            @include border-none()
          }
        }
        .icon{
          display: inline-block;
          vertical-align: top;
          width: 12px;
          height: 12px;
          margin-right: 2px;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          &.decrease{
          @include bg-image('decrease_3')
          }
          &.discount{
          @include bg-image('discount_3')
          }
          &.guarantee{
          @include bg-image('guarantee_3')
          }
          &.invoice{
          @include bg-image('invoice_3')
          }
          &.special{
          @include bg-image('special_3')
          }
        }
        .text{
          display: table-cell;
          width: 56px;
          vertical-align: middle;
          @include border-1px(rgba(7,17,27,0.1));
          font-size: 12px;

        }
      }
    }

    .foods-box {
      flex: 1;
      .title{
        padding-left: 14px;
        height: 26px;
        line-height: 26px;
        border-left: 2px solid #d9dde1;
        font-size: 12px;
        color: rgb(147, 153, 159);
        background: #f3f5f7
      }
      .food-item{
        display: flex;
        margin: 18px;
        padding-bottom: 18px;
        @include border-1px(rgba(7,17,27,0.1));
        &:last-child{
          @include border-none();
          margin-bottom: 0;
        }
        .icon{
          flex: 0 0 57px;
          margin-right: 10px;
        }
        .content{
          flex: 1;
          .name{
            margin:2px 0 8px;
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            color: rgb(7,17,27);
          }
          .desc,.extra{
            font-size: 10px;
            color: rgb(147,153,159);
          }
          .desc{
            line-height: 12px;
            margin-bottom: 8px;
          }
          .extra{
            line-height: 10px;
            .count{
              margin-right: 12px;
            }
          }
          .price{
            font-weight: 700;
            line-height: 24px;
            .now{
              margin-right: 8px;
              font-size: 14px;
              color: rgb(240,20,20);
            }
            .old{
              text-decoration: line-through;
              color: rgb(147,153,159);
            }
          }
          .cartcontrol-box{
            position: absolute;
            right: 0;
            bottom: 12px;
          }
        }
      }
    }
  }
</style>
