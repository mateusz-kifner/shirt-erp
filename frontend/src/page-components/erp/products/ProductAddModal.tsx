import { Button, Modal, Stack, Text } from "@mantine/core"
import { omit } from "lodash"
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
      onClose={() => onClose()}
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
          active={true}
        />
        <EditableText
          label="Nazwa"
          onSubmit={setProductName}
          value={productName}
          required
          active={true}
        />

        <Button
          onClick={() => {
            if (productName.length == 0)
              return setError("Musisz podać nie pustą nazwę produktu")
            const new_product = {
              ...(template ? omit(template, "id") : {}),
              category: "koszulka",
              name: productName,
            }
            add(new_product)
              .then((data) => onClose(data?.data?.id))
              .catch(() => setError("Produkt o takiej nazwie istnieje."))
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
