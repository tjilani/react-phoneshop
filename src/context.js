import React, { Component } from "react";
import { storeProducts, detailProduct } from "./data";

const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    products: [],
    productDetails: detailProduct,
    cartList: [],
    isModalOpen: false,
    modalProduct: detailProduct,
    cartSubTotals: 0,
    cartTax: 0,
    cartTotal: 0
  };

  componentDidMount() {
    this.setProducts();
  }

  setProducts = () => {
    let tempProducts = [];

    storeProducts.forEach(item => {
      const singleItem = { ...item };
      tempProducts = [...tempProducts, singleItem];
    });
    this.setState(() => {
      return { products: tempProducts };
    });
  };

  getItem = id => {
    const product = this.state.products.find(item => item.id === id);
    return product;
  };

  handleDetail = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return { productDetails: product };
    });
  };

  openModal = id => {
    const product = this.getItem(id);
    this.setState(() => {
      return {
        modalProduct: product,
        isModalOpen: true
      };
    });
  };

  closeModal = () => {
    this.setState(() => {
      return {
        isModalOpen: false
      };
    });
  };

  increment = id => {
    let tempCartList = [...this.state.cartList];
    const selectedProduct = tempCartList.find(item => item.id === id);

    const index = tempCartList.indexOf(selectedProduct);
    const product = tempCartList[index];

    product.count = product.count + 1;
    product.total = product.price * product.count;

    this.setState(
      () => {
        return {
          cartList: [...tempCartList]
        };
      },
      () => this.addTotals()
    );
  };

  decrement = id => {
    let tempCartList = [...this.state.cartList];
    const selectedProduct = tempCartList.find(item => item.id === id);

    const index = tempCartList.indexOf(selectedProduct);
    const product = tempCartList[index];

    product.count = product.count - 1;
    if (product.count === 0) {
      this.removeItem(id);
    } else {
      product.total = product.count * product.price;
      this.setState(
        () => {
          return {
            cartList: [...tempCartList]
          };
        },
        () => this.addTotals()
      );
    }
  };

  removeItem = id => {
    let tempProducts = [...this.state.products];
    let tempCart = [...this.state.cartList];

    tempCart = tempCart.filter(item => item.id !== id);

    const index = tempProducts.indexOf(this.getItem(id));
    let removedProduct = tempProducts[index];
    removedProduct.inCart = false;
    removedProduct.count = 0;
    removedProduct.total = 0;

    this.setState(() => {
      return {
        cartList: tempCart,
        products: tempProducts
      };
    }, this.addTotals());
  };

  clearCart = () => {
    this.setState(
      () => {
        return {
          cartList: []
        };
      },
      () => {
        this.setProducts();
        this.addTotals();
      }
    );
  };

  addTotals = () => {
    let subTotal = 0;
    this.state.cartList.map(item => {
      subTotal += item.total;
      const tempTax = subTotal * 0.1;
      const tax = parseFloat(tempTax.toFixed(2));
      let total = subTotal + tax;

      this.setState(() => {
        return {
          cartSubTotals: subTotal,
          cartTax: tax,
          cartTotal: total
        };
      });
    });
  };

  addToCart = id => {
    // let tempProducts = [...this.state.products];
    // const index = tempProducts.indexOf(this.getItem(id));
    // const product = tempProducts[index];
    // product.inCart = true;
    // product.count = 1;
    // const price = product.price;
    // product.total = price;

    // this.setState(
    //   () => {
    //     return {
    //       products: tempProducts,
    //       cartList: [...this.state.cartList, product]
    //     };
    //   },
    //   () => this.addTotals()
    // );

    const tempProducts = [...this.state.products];
    const product = tempProducts.find(item => item.id === id);
    product.inCart = true;
    product.count = 1;
    product.total = product.price;

    this.setState(
      () => {
        return {
          cartList: [...this.state.cartList, product],
          products: tempProducts
        };
      },
      () => this.addTotals()
    );
  };

  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
