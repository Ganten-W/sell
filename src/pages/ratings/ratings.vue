<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{sellerProp.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{sellerProp.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="sellerProp.serviceScore"></star>
            <span class="score">{{sellerProp.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="sellerProp.foodScore"></star>
            <span class="score">{{sellerProp.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{sellerProp.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <div class="ratings-select">
        <div class="rating-type border-1px">
          <span
            @click="select(2,$event)"
            class="block positive"
            :class="{'active':selectType===2}">{{desc.all}}<span
            class="count">{{ratingsProp.length}}</span>
          </span>
          <span
            @click="select(0,$event)"
            class="block positive"
            :class="{'active':selectType===0}">{{desc.positive}}<span
            class="count">{{positives.length}}</span>
          </span>
          <span @click="select(1,$event)" class="block negative"
                :class="{'active':selectType===1}">{{desc.negative}}<span
            class="count">{{negatives.length}}</span></span>
        </div>
        <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
          <span class="icon-check_circle"></span>
          <span class="text">只看有内容的评价</span>
        </div>
      </div>
      <div class="ratings-wrapper">
        <ul>
          <li v-for="rating in ratingsProp"
              v-show="needShow(rating.rateType, rating.text)"
              class="rating-item">
            <div class="avatar">
              <img width="28" height="28" :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="item in rating.recommend">{{item}}</span>
              </div>
              <div class="time">
                {{rating.rateTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import star from "../../components/star/star"
  import split from "../../components/split/split"
  import {formatDate} from '../../common/js/date'
  import BScroll from "better-scroll"

  const ALL = 2;
  const ERR_OK = 0;
  const POSITIVE = 0;
  const NEGATIVE = 1;

  export default {
    name: "ratings",
    props: {
      sellerProp: Object,
      ratingsProp: Array
    },
    data() {
      return {
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      };
    },
    components: {
      star,
      split
    },
    computed: {
      positives() {
        return this.ratingsProp.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negatives() {
        return this.ratingsProp.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    },
    methods:{
      _initScroll(){
        this.$nextTick(()=>{
          new BScroll(this.$refs.ratings,{click:true})
        })
      },
      select(type, event) {
        if (!event._constructed) {
          return;
        }
        this.selectType = type;
      },
      toggleContent(event) {
        if (!event._constructed) {
          return;
        }
        this.onlyContent = !this.onlyContent;
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    mounted(){
      this._initScroll()
    },
  }
</script>

<style lang="scss" scoped>
  @import "../../common/styles/mixin.scss";
  .ratings {
    position: absolute;
    top: 174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    .overview {
      display: flex;
      padding: 18px 0;

      .overview-left {
        flex: 0 0 137px;
        padding: 6px 0;
        width: 137px;
        border-right: 1px solid rgba(7, 17, 27, 0.1);
        text-align: center;
        @media only screen and (max-width: 320px) {
          flex: 0 0 120px;
          width: 120px
        }

        .score {
          margin-bottom: 6px;
          line-height: 28px;
          font-size: 24px;
          color: rgb(255, 153, 0)
        }

        .title {
          margin-bottom: 8px;
          line-height: 12px;
          font-size: 12px;
          color: rgb(7, 17, 27)
        }

        .rank {
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159)
        }
      }

      .overview-right {
        flex: 1;
        padding: 6px 0 6px 24px;
        @media only screen and (max-width: 320px) {
          padding-left: 6px
        }

        .score-wrapper {
          margin-bottom: 8px;
          font-size: 0;

          .title {
            display: inline-block;
            line-height: 18px;
            vertical-align: top;
            font-size: 12px;
            color: rgb(7, 17, 27)
          }

          .star {
            display: inline-block;
            margin: 0 12px;
            vertical-align: top
          }

          .score {
            display: inline-block;
            line-height: 18px;
            vertical-align: top;
            font-size: 12px;
            color: rgb(255, 153, 0)
          }
        }

        .delivery-wrapper {
          font-size: 0;

          .title {
            line-height: 18px;
            font-size: 12px;
            color: rgb(7, 17, 27)
          }

          .delivery {
            margin-left: 12px;
            font-size: 12px;
            color: rgb(147, 153, 159)
          }
        }
      }
    }
    .ratings-select{
      .rating-type{
        padding: 18px 0;
        margin: 0 18px;
        @include border-1px(rgba(7, 17, 27, 0.1));
        font-size: 0;
        .block{
          display: inline-block;
          padding: 8px 12px;
          margin-right: 8px;
          line-height: 16px;
          border-radius: 1px;
          font-size: 12px;
          color: rgb(77, 85, 93);
          &.active{
            color: #fff
          }
          .count{
            margin-left: 2px;
            font-size: 8px
          }
          &.positive{
            background: rgba(0, 160, 220, 0.2);
            &.active{
              background: rgb(0, 160, 220)
            }
          }
          &.negative{
            background: rgba(77, 85, 93, 0.2);
            &.active{
              background: rgb(77, 85, 93)
            }
          }
        }
      }
      .switch{
        padding: 12px 18px;
        line-height: 24px;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        color: rgb(147, 153, 159);
        font-size: 0;
        &.on{
          .icon-check_circle{
            color: #00c850
          }
        }
        .icon-check_circle{
          display: inline-block;
          vertical-align: top;
          margin-right: 4px;
          font-size: 24px
        }
        .text{
          display: inline-block;
          vertical-align: top;
          font-size: 12px
        }
      }

    }
    .ratings-wrapper{
      padding: 0 18px;
      .rating-item{
        display: flex;
        padding: 18px 0;
        @include border-1px(rgba(7, 17, 27, 0.1));
        .avatar{
          flex: 0 0 28px;
          width: 28px;
          margin-right: 12px;
          img{
            border-radius: 50%
          }
        }
        .content{
          position: relative;
          flex: 1;
          .name{
            margin-bottom: 4px;
            line-height: 12px;
            font-size: 10px;
            color: rgb(7, 17, 27)
          }
          .star-wrapper{
            margin-bottom: 6px;
            font-size: 0;
            .star{
              display: inline-block;
              margin-right: 6px;
              vertical-align: top
            }
            .delivery{
              display: inline-block;
              vertical-align: top;
              line-height: 12px;
              font-size: 10px;
              color: rgb(147, 153, 159)
            }
          }
          .text{
            margin-bottom: 8px;
            line-height: 18px;
            color: rgb(7, 17, 27);
            font-size: 12px;
          }
          .recommend{
            line-height: 16px;
            font-size: 0;
            .icon-thumb_up, .item{
              display: inline-block;
              margin: 0 8px 4px 0;
              font-size: 9px
            }
            .icon-thumb_up{
              color: rgb(0, 160, 220)
            }
            .item{
              padding: 0 6px;
              border: 1px solid rgba(7, 17, 27, 0.1);
              border-radius: 1px;
              color: rgb(147, 153, 159);
              background: #fff
            }
          }
          .time{
            position: absolute;
            top: 0;
            right: 0;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147, 153, 159)
          }
        }
      }
    }
  }
</style>
