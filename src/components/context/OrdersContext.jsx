import { createContext, useContext, useEffect, useState } from "react"
import { useUsers } from "./UsersContext"
import { useCartContext } from "./CartContext"
import { useProducts } from "./ProductsContext"
import { getFirestore, doc, addDoc, updateDoc, collection, writeBatch } from "firebase/firestore"

export const OrdersContext = createContext()
export const useOrders = () => useContext(OrdersContext)

export const OrdersProvider = ({ children }) => {
    const { user } = useUsers()
    const { cartPrice, productsCart } = useCartContext()
    const {products} = useProducts()
    const [order, setOrder] = useState({})

    const setOrdersFireBase = async () => {
        const dbFirestore = getFirestore()
        const orderCollection = collection(dbFirestore, 'orders')
        try{
            addDoc(orderCollection, order)
        }catch(error){
            console.log(error)
        }
    }

    useEffect(() =>{
        setOrdersFireBase()

    },[order])

    const finalizarOrden = () => {

        const buyerOrder = {
            userData: {
                name: user.nombre,
                email: user.email
            },
            items: [],
            totalPrice: cartPrice
        }

        const storedData = JSON.parse(localStorage.getItem('productQuantitiesCart'))

        productsCart.map(item => {

            let cantidad = storedData[item.id]

            buyerOrder.items.push({
                pName: item.name,
                pCantidad: cantidad
            })
        })
        setOrder(buyerOrder)


    }


    return (
        <OrdersContext.Provider value={{
            finalizarOrden,
        }}>
            {children}
        </OrdersContext.Provider>
    )
}