<template>
  <div class="goods">
    <div class="menu-box" ref="menu-box">
      <ul>
        <li v-for="(value,index) in goodsProp" :key="index" class="menu-item">
          <span class="text">
            <span v-show="value.type>0" class="icon"
                  :class="classMap[value.type]"></span>{{value.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-box" ref="foods-box">
      <ul>
        <li v-for="(val1,index1) in goodsProp" :key="index1" class="food-list">
          <h1 class="title">{{val1.name}}</h1>
          <ul>
            <li v-for="(val2,index2) in val1.foods" :key="index2" class="food-item">
              <div class="icon">
                <img width="57px" height="57px" :src="val2.icon">
              </div>
              <div class="content">
                <h2 class="name">{{val2.name}}</h2>
                <p class="desc">{{val2.description}}</p>
                <div class="extra">
                  <span class="count">月售{{val2.sellCount}}</span>
                  <span>好评率{{val2.rating}}</span>
                </div>
                <div class="price">
                  <span class="now">￥{{val2.price}}</span>
                  <span class="old" v-show="val2.oldPrice">￥{{val2.oldPrice}}</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import BScroll from "better-scroll"

  export default {
    name: "goods",
    props:{
      sellerProp:Object,
      goodsProp:Array
    },
    created(){
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    methods:{
      _initScroll(){
        this.menuScroll = new BScroll(this.$refs.menuBox, {});
        this.foodsScroll = new BScroll(this.$refs.foodsBox, {});
      }
    },
    mounted(){
      this._initScroll()
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
        }
      }
    }
  }
</style>
