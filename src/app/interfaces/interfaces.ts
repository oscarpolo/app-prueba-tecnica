export interface Products {
  productID: number;
  productName: string;
  description: string;
  price: string;
  stock: string;
}

export interface Customer {
  customerID: number;
  documentIdentity: string;
  address: string;
}

export interface ProductsOrder {
  productID: number;
  productName: string;
  price: number;
  count: number;
  total: number;
}

export interface NewOrder {
  CustomerID: number;
  CustomerAddress: string;
  ProductsOrder: ProductsOrder[];
}
