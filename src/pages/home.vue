<template>
  <div class="home">
    <head-top :sellerProp="seller"></head-top>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :sellerProp="seller" :ratingsProp="ratings" :goodsProp="goods"/>
    </keep-alive>
  </div>
</template>

<script>
  import headTop from "@/components/headTop/headTop"

  export default {
    name: "sell",
    data() {
      return {
        url: '../../static/json/data.json',
        seller: {},
        ratings:[],
        goods:[],
      }
    },
    components: {
      headTop
    },
    methods: {
      async getSellerData() {
        let res = await this.axios.get(this.url);
        console.log(res.data);
        this.seller = res.data.seller;
        this.ratings=res.data.ratings;
        this.goods=res.data.goods;
        // console.log(this.goods)
      }
    },
    mounted() {
      this.getSellerData()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../common/styles/mixin";

  .home {
    width: 100%;
    height: 100%;

    .tab {
      display: flex;
      width: 100%;
      height: 40px;
      line-height: 40px;
      @include border-1px(rgba(7, 17, 27, 0.1));

      .tab-item {
        flex: 1;
        text-align: center;

        a {
          display: block;
          font-size: 14px;
          color: rgb(77, 85, 93);
          text-decoration: none;

          &.router-link-exact-active {
            color: rgb(240, 20, 20)
          }
        }
      }
    }


  }
</style>
