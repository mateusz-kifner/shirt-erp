import { useEffect, useState, FC } from "react"
import { Button } from "antd"

import axios from "axios"
import { v4 as uuidv4 } from "uuid"

import DebugComponent from "./DebugComponent"

import { ProductType } from "../types/ProductType"
import { ClientType } from "../types/ClientType"
import { OrderType } from "../types/OrderType"

const products_data: Partial<ProductType>[] = [
  {
    name: "Koszulka JHK Biała",
    category: "koszulki",
    color: {
      colorName: "White",
      colorHex: "#ffffff",
    },
    desc: "brak opisu",
    icon: {
      name: "tshirt.svg",
    },
    previewImg: {
      name: "tshirt_white.png",
    },
  },
  {
    name: "Koszulka JHK Czarna",
    category: "koszulki",
    color: {
      colorName: "Black",
      colorHex: "#111111",
    },
    desc: "brak opisu",
    icon: {
      name: "tshirt.svg",
    },
    previewImg: {
      name: "tshirt_black.png",
    },
  },
  {
    name: "Koszulka JHK Turkusowa",
    category: "koszulki",
    color: {
      colorName: "Truquoise",
      colorHex: "#0ca0aa",
    },
    desc: "brak opisu",
    icon: {
      name: "tshirt.svg",
    },
    previewImg: {
      name: "tshirt_white.png",
    },
  },
  {
    name: "Koszulka JHK Róźowa",
    category: "koszulki",
    color: {
      colorName: "Pink",
      colorHex: "#f3b1cc",
    },
    desc: "brak opisu",
    icon: {
      name: "tshirt.svg",
    },
    previewImg: {
      name: "tshirt_white.png",
    },
  },
]

const clients_data: Partial<ClientType>[] = [
  {
    username: "jan.kowalski.test",
    firstname: "Jan",
    lastname: "Kowalski",
    email: "jan.kowalski@lan.lan",
    phoneNumber: "+48 123 456 789",
    address: {
      streetName: "Aroniowa",
      streetNumber: "126",
      apartmentNumber: "12",
      postCode: "80-012",
      city: "Gdańsk",
      province: "pomorskie",
    },
    companyName: "Jan i spółka",
    notes: "Jan zamawia duźo koszulek",
    secretNotes: "secret notes test",
  },
  { username: "małysz.nowak.test" },
  { username: "kuba.lewandowski.test" },
]

const orders_data: Partial<OrderType>[] = [
  {
    name: "Zamówienie Testowe koszulki",
    advance: 100.0,
    isAdvancePaid: true,
    price: 123.45,
    isPricePaid: false,
    dateOfCompletion: new Date(),
    notes: "Jan zamawia duźo koszulek",
    secretNotes: " secretNotes test",
    status: "zaakceptowane",
    products: [
      {
        count: 1,
        product: null,
        size: "XL",
        ready: false,
      },
    ],
    address: {
      streetName: "Aroniowa",
      streetNumber: "126",
      apartmentNumber: "12",
      postCode: "80-012",
      city: "Gdańsk",
      province: "pomorskie",
    },
  },
  { name: "Zamówienie Testowe czapki" },
  { name: "Zamówienie Testowe bluzy" },
]

const DebugData: FC = () => {
  const [status, setStatus] = useState<Array<any>>([])
  const [files, setFiles] = useState<Array<any>>([])
  const [show, setShow] = useState(false)

  useEffect(() => {
    axios
      .get("/upload/files")
      .then(function (response) {
        setFiles(response.data)
      })
      .catch(function (error) {
        setStatus((val) => [...val, { error }])
      })
  }, [])

  const setTestData = () => {
    for (let p_data of products_data) {
      let icon_id = files
        .filter((val) => val.name === p_data.icon?.name)
        .map((val) => val.id)[0]

      let preview_id = files
        .filter((val) => val.name === p_data.previewImg?.name)
        .map((val) => val.id)[0]

      icon_id && ((p_data.icon as { id: number; name: string }).id = icon_id)
      preview_id &&
        ((p_data.previewImg as { id: number; name: string }).id = preview_id)
      // console.log(p_data, icon_id, preview_id)
      axios
        .post("/products", p_data)
        .then(function (response) {
          setStatus((val) => [...val, response.data])
        })
        .catch(function (error) {
          setStatus((val) => [...val, { error }])
        })
    }

    for (let p_data of clients_data) {
      axios
        .post("/clients", p_data)
        .then(function (response) {
          setStatus((val) => [...val, response.data])
        })
        .catch(function (error) {
          setStatus((val) => [...val, { error }])
        })
    }

    for (let p_data of orders_data) {
      console.log(p_data)
      axios
        .post("/orders", p_data)
        .then(function (response) {
          setStatus((val) => [...val, response.data])
        })
        .catch(function (error) {
          setStatus((val) => [...val, { error }])
        })
    }
  }

  return (
    <div>
      {files.length > 0 && "files loaded"}
      <Button type="primary" onClick={setTestData}>
        Set Debug Data
      </Button>
      {status.length > 0 && (
        <>
          {status.map((val) => (
            <DebugComponent {...val} />
          ))}

          <div>
            <pre
              style={{
                height: show ? "auto" : 100,
                overflow: "hidden",
                padding: 10,
                margin: 10,
                background: "#111",
              }}
              onClick={() => setShow((val) => !val)}
            >
              {JSON.stringify(status, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  )
}

export default DebugData
