export interface Product {
    id?: string,
    name: string,
    mainImage: string,
    hologramImage: string,
    images: string[],
    price: number,
    description: string,
    offerTime?: number,
    offerPercentage?: number,
    stock: number,
    salesQty: number,
    categoryId: string,
}