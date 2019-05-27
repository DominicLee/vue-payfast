<template>
  <div class="vsc-wrapper">
    <v-container grid-list>
      <v-layout class="vsc-shelf">
        <v-flex v-for="product in dummyProducts" :key="product.id">
          <v-card>
            <v-card-media height="200px" :src="product.image"></v-card-media>
            <v-card-title primary-title>
              <h3 v-html="product.name"></h3>
            </v-card-title>
            <v-card-text v-html="product.description"></v-card-text>
            <v-card-actions>
              <v-btn flat color="orange">More Info</v-btn>
              <v-btn flat color="orange" @click="scAddToCart(product)">Add to Cart</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <div class="vsc-item" v-for="item in vscItems">
      {{item.get('name')}}
    </div>
    <div class="shoppingcart-container">
      <div style="width:700px;" class="simpleCart_items"></div>
      <div id="cartTotal"><strong>Total: </strong><span class="simpleCart_total"></span></div>
      <div class="simpleCart_shelfItem">
        <h5 class="item_name">DUMMY PRODUCT 1</h5>
        <img src="" alt="DUMMY PRODUCT 1" title="DUMMY PRODUCT 1" class="item_image"/>
        <span class="item_price"><strong>R10.01</strong></span> <a href="#" class="item_add">Add to Cart</a>
        <p class="item_Description">product description product description<br/>product description product description
        </p>
      </div>
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

    @Prop() beforeAdd!: Function;
    @Prop() afterAdd!: Function;


    // VARIABLES

    _simpleCart: any;
    vscItems: any[] = [];

    dummyProducts:any[] = [
      {
        name: 'Tomato Sauce',
        price: 15.99,
        description: 'Tomato sauce in a jar',
        image: 'tomato.jpg',
        id: '012'
      },{
        name: 'Sunglasses',
        price: 215.99,
        description: 'Sunglasses for your face',
        image: 'sunglasses.jpg',
        id: '123'
      },{
        name: 'Manicure',
        price: 245.99,
        description: 'Stuff for your nails',
        image: 'manicure.jpg',
        id: '234'
      }
    ];

    created() {
      // @ts-ignore
      Vue.loadScript('/jquery-1.7.2.min.js').then(() => {
        // @ts-ignore
        Vue.loadScript('/simpleCart.min.js').then(() => {
          // @ts-ignore
          this._simpleCart = simpleCart({
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
              this.emitEvent('ready', this._simpleCart);
              simpleCart.bind('update', this.scUpdate);
              this.simpleCartReady();
            },
            beforeAdd: this.beforeAdd,
            afterAdd: this.afterAdd
          });

        })
      });

    }

    mounted() {

    }

    scAddToCart(_item:any):void {
      simpleCart.add(_item);
    }

    scUpdate(): void {
      this.vscItems = [];
      simpleCart.each((_item:any) => {
        this.vscItems.push(_item)
      });
    }

    simpleCartReady(): void {
      simpleCart.add({
        name: "Cool T-Shirt",
        price: 45.99,
        size: "Small",
        quantity: 3
      });
    }

    emitEvent(_event: string, _meta: any) {
      console.log('emitting ' + _event);
      this.$emit(_event, _meta);
    }


  }
</script>
<style lang="less">
  .vsc-item {
    height: 100px;
    width: 100px;
    background: red;
    border: 1px solid orange;
  }
</style>
