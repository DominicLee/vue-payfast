<template>
  <div class="vsc-wrapper" :style="{'--columnCount': shelfColumns}">
    <v-container fluid grid-list>
      <v-layout wrap class="vsc-shelf" v-if="simpleCartReady">
        <v-flex shrink v-for="product in dummyProducts" :key="product.id" class="vsc-shelf-item">
          <v-card>
            <v-img height="50%" :src="product.image"></v-img>
            <v-card-title primary-title>
              <h3 v-html="product.name"></h3>
            </v-card-title>
            <v-card-text align="left" v-html="convertCurrency(product.price)"></v-card-text>
            <v-card-text align="left" v-html="product.description"></v-card-text>
            <v-card-actions>
              <v-btn flat color="orange">More Info</v-btn>
              <v-btn flat color="orange" @click="scAddToCart(product)">Add to Cart</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <div class="vsc-item" v-for="item in vscItems" v-if="simpleCartReady" :key="item.get('id')">
      <div>{{item.get('name')}}</div>
      <div v-html="convertCurrency(item.get('price'))"></div>
      <v-btn @click="scDecrementItem(item.get('id'))">&lt;</v-btn>
      <div>{{item.get('quantity')}}</div>
      <v-btn @click="scIncrementItem(item.get('id'))">&gt;</v-btn>
      <div v-html="convertCurrency(item.get('total'))"></div>
      <v-btn @click="scRemoveItem(item.get('id'))">X</v-btn>
    </div>
    <div class="vsc-total">TOTAL: <span v-html="simpleCartTotal"></span></div>
    <div class="checkout-button">
      <v-btn @click="scCheckout">Checkout</v-btn>
    </div>
  </div>
</template>
<script lang="ts">
  import {Component, Prop, Vue} from "vue-property-decorator";

  declare var simpleCart: any;

  @Component
  export default class PayFast extends Vue {

    // PROPERTIES

    @Prop() merchantId!: string;
    @Prop() merchantKey!: string;
    @Prop() checkout!: any;
    @Prop() shipping!: any;
    @Prop() currency!: any;
    @Prop() urls!: any;
    @Prop() shelfColumns!: number;

    @Prop() beforeAdd!: Function;
    @Prop() afterAdd!: Function;

    // TODO: Add responsivity

    // VARIABLES

    vscItems: any[] = [];
    simpleCartReady: boolean = false;
    simpleCartTotal: number = 0;

    dummyProducts: any[] = [
      {
        name: 'Tomato Sauce',
        price: 15.99,
        description: 'Tomato sauce in a jar',
        image: 'tomato.jpg',
        id: '012'
      }, {
        name: 'Sunglasses',
        price: 215.99,
        description: 'Sunglasses for your face',
        image: 'sunglasses.jpg',
        id: '123'
      }, {
        name: 'Manicure',
        price: 245.99,
        description: 'Stuff for your nails',
        image: 'manicure.jpg',
        id: '234'
      }, {
        name: 'Weave',
        price: 1115.99,
        description: 'More hair for your hair',
        image: 'hair.jpg',
        id: '345'
      }, {
        name: 'Shampoo',
        price: 46.99,
        description: 'Shampoo for your hair',
        image: 'shampoo.jpg',
        id: '456'
      }
    ];

    created() {
      // TODO: Promisify
      // @ts-ignore
      Vue.loadScript('/jquery-1.7.2.min.js').then(() => {
        // @ts-ignore
        Vue.loadScript('/simpleCart.min.js').then(() => {
          // @ts-ignore
          simpleCart({
            cartColumns: [
              {attr: "name", label: "Name"},
              {view: "currency", attr: "price", label: "Price"},
              {view: "decrement", label: false},
              {attr: "quantity", label: "Qty"},
              {view: "increment", label: false},
              {view: "currency", attr: "total", label: "SubTotal"},
              {view: "remove", text: "Remove", label: false}
            ],
            checkout: this.checkout,
            ready: () => {
              this.simpleCartReady = true;
              this.emitEvent('ready', simpleCart);
              simpleCart.bind('update', this.scUpdate);
              simpleCart.update();
            },

            beforeAdd: this.beforeAdd,
            afterAdd: this.afterAdd,
            beforeCheckout: this.scBeforeCheckout
          });
          simpleCart.currency({
            code: "ZAR",
            symbol: "R",
            name: "South African Rand"
          })
        })
      });
    }

    mounted() {

    }

    scAddToCart(_item: any): void {
      simpleCart.add({name: _item.name, price: _item.price, quantity: 1});
    }

    scIncrementItem(_itemId: string): void {
      const foundItem: any = simpleCart.find({id: _itemId})[0];
      foundItem.increment();
      simpleCart.update();
    }

    scDecrementItem(_itemId: any): void {
      const foundItem: any = simpleCart.find({id: _itemId})[0];
      foundItem.decrement();
      simpleCart.update();
    }

    scRemoveItem(_itemId: any): void {
      const foundItem: any = simpleCart.find({id: _itemId})[0];
      foundItem.remove();
      simpleCart.update();
    }

    scBeforeCheckout(_data: any) {
      _data.merchant_key = this.merchantKey;
      _data.merchant_id = this.merchantId;
      _data.amount = simpleCart.total();
      _data.item_name = 'Doms amazing checkout'
    }

    scUpdate(): void {
      this.simpleCartTotal = simpleCart.toCurrency(simpleCart.total());
      this.vscItems = [];
      simpleCart.each((_item: any) => {
        this.vscItems.push(_item)
      });
    }

    scCheckout(): void {
      simpleCart.checkout();
    }

    emitEvent(_event: string, _meta: any) {
      this.$emit(_event, _meta);
    }

    convertCurrency(_cost: number): string {
      return simpleCart.toCurrency(_cost);
    }

  }
</script>
<style lang="less">
  .vsc {


    &-wrapper {

    }

    &-shelf {

      &-item {
        width: calc(100% / var(--columnCount));
        max-width: calc(100% / var(--columnCount));
      }

    }

  }


  .vsc-item {
    height: 100px;

    font-size: 2rem;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
</style>
