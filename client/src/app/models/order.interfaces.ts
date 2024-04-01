import { IProduct } from "./product.interfaces";
import { IStore } from "./store.interfaces";

export interface IOrder {
    _id: string;
    storeId: string;
    userId: string;
    addressDelivery: string;
    orders: string[];
    date: Date;
};

export interface IOrderWithProducts {
    _id: string;
    storeId: IStore;
    userId: string;
    addressDelivery: string;
    orders: IProduct[];
    date: number;
};

export interface IOrderSummary {
    _id: string;
    storeImage: string;
    storeName: string;
    storeCategory: string;
    storeAddress: string;
    storePhone: string;
    totalBillCost: number;
    addressDelivery: string;
    date: number;
    canEdit: boolean;
    products: {
      image: string;
      name: string;
      description: string;
      quantity: number;
      price: number;
      totalCost: number;
    }[];
  };