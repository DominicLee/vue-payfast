<template>
  <div id="app">
    <PayFast :checkout="checkoutData" @ready="cartReady" :before-add="beforeAdd" :after-add="afterAdd"></PayFast>
  </div>
</template>
<script>
  import {Component, Vue} from 'vue-property-decorator';
  import PayFast from "@/components/PayFast.vue";

  @Component({
    components: {
      PayFast,
    },
  })
  export default class Home extends Vue {

    rawSimpleCart;

    checkoutData = {
      type: "SendForm",
      url: "https://sandbox.payfast.co.za/eng/process",
    };

    cartReady(_cart) {
      this.rawSimpleCart = _cart;
    }

    beforeAdd(_item) {
      console.log(_item.get('size'));
      _item.set('price', 49.99);
    }

    afterAdd(_item) {
      console.log(_item.get('price'))
    }

  }
</script>
<style lang="less">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
