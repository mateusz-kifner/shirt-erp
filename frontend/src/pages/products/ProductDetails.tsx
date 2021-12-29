import { FC, useEffect, useState } from "react"
import { message } from "antd"

import axios from "axios"
import Logger from "js-logger"
import { useQuery } from "react-query"

import EditComponent from "../../components/EditComponent"
import { ProductType } from "../../types/ProductType"
import ErrorPage from "../ErrorPage"

interface ProductDetailsProps {
  productId?: number
  template: any
  onUpdate?: () => void
}

const fetchProduct = async (id: number | undefined) => {
  if (!id) return
  const res = await axios.get(`/products/${id}`)
  return res.data
}

const ProductDetails: FC<ProductDetailsProps> = ({
  productId,
  template,
  onUpdate,
}) => {
  const [product, setProduct] = useState<ProductType>()
  const [newTemplate, setNewTemplate] = useState<any>()
  const { data, refetch } = useQuery(
    ["product_one", productId],
    () => fetchProduct(productId),
    {
      enabled: false,
    },
  )

  useEffect(() => {
    refetch()
  }, [productId])

  useEffect(() => {
    if (!data) return
    setProduct(data)
  }, [data])

  useEffect(() => {
    let new_template = { ...template }
    product &&
      Object.keys(product).forEach((key) => {
        // @ts-ignore
        if (product[key] != null) new_template[key].value = product[key]
        else new_template[key].value = new_template[key].initialValue
      })
    setNewTemplate(new_template)
  }, [template, product])

  const onSubmit = (sub_data: Partial<ProductType>) => {
    axios
      .put(`/products/${sub_data.id}`, sub_data)
      .then((res) => {
        Logger.info({ ...res, message: "Edycja produktu udana" })
        message.success("Edycja produktu udana")
        setProduct(res.data)
        onUpdate && onUpdate()
      })
      .catch((e) => {
        Logger.error({ ...e, message: "Błąd edycji produktu" })
      })
  }

  const onDelete = (id: number) => {
    axios
      .delete(`/products/${id}`)
      .then((res) => {
        Logger.info({ ...res, message: "Usuwanie produktu udane" })
        message.success("Usuwanie produktu udane")
        setProduct(res.data)
        onUpdate && onUpdate()
      })
      .catch((e) => {
        Logger.error({ ...e, message: "Błąd usuwania produktu" })
      })
  }

  return (
    <div>
      {product ? (
        <EditComponent
          data={newTemplate}
          onSubmit={onSubmit}
          title="name"
          onDelete={onDelete}
          deleteTitle="Usuń Produkt"
        />
      ) : (
        <ErrorPage errorcode={404} />
      )}
    </div>
  )
}

export default ProductDetails
