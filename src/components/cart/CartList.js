import React from "react";
import CartItem from "./CartItem";

export default function CartList({ value }) {
  const { cartList } = value;
  console.log(value, cartList);

  return (
    <div className="container-fluid">
      {cartList.map(item => {
        return <CartItem key={item.id} data={item} value={value} />;
      })}
    </div>
  );
}
