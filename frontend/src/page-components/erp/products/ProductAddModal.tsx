import { Button, Modal, Stack, Text } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { Plus } from "tabler-icons-react"
import EditableApiEntry from "../../../components/editable/EditableApiEntry"
import EditableText from "../../../components/editable/EditableText"
import useStrapi from "../../../hooks/useStrapi"
import { ProductType } from "../../../types/ProductType"
import ProductListItem from "./ProductListItem"

interface ProductAddModalProps {
  opened: boolean
  onClose: (id?: number) => void
}

const ProductAddModal = ({ opened, onClose }: ProductAddModalProps) => {
  const [productName, setProductName] = useState<any>("Produkt")
  const [template, setTemplate] = useState<Partial<ProductType> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { add, status } = useStrapi<ProductType>("products")

  useEffect(() => {
    if (!opened) {
      setProductName("Produkt")
      setTemplate(null)
      setError(null)
    }
  }, [opened])

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="xl"
      title="Utwórz nowy produkt"
    >
      <Stack>
        <EditableApiEntry
          label="Szablon"
          entryName="products"
          Element={ProductListItem}
          onSubmit={(template) => {
            setTemplate(template)
            // productName === "Klient" && setProductName(template.username)
          }}
          value={template}
          withErase
          listProps={{ defaultSearch: "Szablon", filterKeys: ["name"] }}
        />
        <EditableText
          label="Nazwa"
          onSubmit={setProductName}
          value={productName}
          required
        />

        <Button
          onClick={() => {
            if (productName.length == 0)
              return setError("Musisz podać nie pustą nazwę produktu")
            let new_product = template ? template : {}
            new_product?.id && delete new_product?.id
            new_product.category = "koszulka"
            new_product.name = productName
            add(new_product).then((data) => onClose(data?.data?.id))
            console.log(new_product)
          }}
          leftIcon={<Plus />}
          loading={status === "loading"}
        >
          Utwórz produkt
        </Button>
        <Text color="red">{error}</Text>
      </Stack>
    </Modal>
  )
}

export default ProductAddModal
