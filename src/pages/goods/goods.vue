<template>
  <div class="goods">
    <div class="menu-box" ref="menu-box">
      <ul>
        <li v-for="(value,index) in goodsProp"
            :key="index"
            @click="selectMenu(index,$event)"
            :class="{current:currentIndex===index}"
            class="menu-item">
          <span class="text">
            <span v-show="value.type>0" class="icon"
                  :class="classMap[value.type]"></span>{{value.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-box" ref="foods-box">
      <ul>
        <li v-for="(val1,index1) in goodsProp" :key="index1"
            class="food-list food-list-hook" ref="food-list">
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
    data(){
      return {
        listHeight:[],
        scrollY:0,
      }
    },
    computed:{
      currentIndex(){
        for(let i=0;i<this.listHeight.length;i++){
          let height1=this.listHeight[i];
          let height2=this.listHeight[i+1];
          if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
            return i;
          }
        }
        return 0;
      }
    },
    created(){
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    methods:{
      _initScroll() {
        this.menuScroll=new BScroll(this.$refs['menu-box'], {click:true});
        this.foodsScroll=new BScroll(this.$refs['foods-box'], {
          probeType:3
        });
        this.foodsScroll.on('scroll',(pos)=>{
          this.scrollY=Math.abs(Math.round(pos.y))
        })
      },
      calculateHeight() {
        let foodList=this.$refs['food-list'];
        let height=0;
        this.listHeight.push(height);
        for(let i=0;i<foodList.length;i++){
          let item = foodList[i];
          height+=item.clientHeight;
          this.listHeight.push(height)
        }
      },
      selectMenu(index,event){
        if (!event._constructed) {
          return;
        }
        let foodList=this.$refs['food-list'];
        let el=foodList[index];
        this.foodsScroll.scrollToElement(el,300)
      }
    },
    mounted(){
      this._initScroll();
      this.calculateHeight()
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
        }
      }
    }
  }
</style>
