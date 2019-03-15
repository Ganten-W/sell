<template>
  <div class="cartcontrol">
    <transition-group name="move">
      <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart" :key="1">
        <span class="inner icon-remove_circle_outline"></span>
      </div>
      <div class="cart-count" v-show="food.count>0" :key="2">{{food.count}}</div>
    </transition-group>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script>
  import Vue from "vue"
  export default {
    name: "cartcontrol",
    props:{
      food:{
        type:Object,
      }
    },
    methods:{
      addCart(event){
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
          // console.log(this.food)
        } else {
          this.food.count++;
          // console.log(this.food)
        }
        // console.log(event)
        this.$emit('cartAdd',event.target)
      },
      decreaseCart(){
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cartcontrol{
    font-size: 0;
    .cart-decrease{
      display: inline-block;
      padding: 6px;
      /*opacity:1;*/
      /*transform:translate3d(0,0,0);*/
      .inner{
        display:inline-block;
        line-height: 24px;
        font-size: 24px;
        color: rgb(0,160,220);
        transition:all 0.4s linear;
        transform: rotate(0);
      }
      &.move-enter-active,&.move-leave-active{
        transition: all .4s linear;
      }
      /*&.move-enter-to{*/
        /*opacity: 1;*/
        /*transform: translate3d(0, 0, 0);*/
        /*.inner{*/
          /*transform: rotate(0);*/
        /*}*/
      /*}*/
      &.move-enter,&.move-leave-to{
        opacity: 0;
        transform: translate3d(24px, 0, 0);
        .inner{
          transform: rotate(360deg)
        }
      }
    }
    .cart-count{
      display: inline-block;
      vertical-align: top;
      width: 12px;
      padding-top: 6px;
      line-height: 24px;
      text-align: center;
      font-size: 10px;
      color: rgb(147,153,159);
    }
    .cart-add{
      display: inline-block;
      padding: 6px;
      line-height: 24px;
      font-size: 24px;
      color: rgb(0,160,220);
    }
  }
</style>
