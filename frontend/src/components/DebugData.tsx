import { useEffect, useState, FC } from "react"
import { Button } from "antd"

import axios from "axios"
import { v4 as uuidv4 } from "uuid"
import faker from "faker"

import DebugComponent from "./DebugComponent"

import { ProductType } from "../types/ProductType"
import { ClientType } from "../types/ClientType"
import { OrderType } from "../types/OrderType"

faker.locale = "pl"

const products_data: Partial<ProductType>[] = [
  {
    name: "Koszulka JHK Biała" + uuidv4(),
    category: "koszulki",
    color: {
      colorName: "white",
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
    name: "Koszulka JHK Czarna" + uuidv4(),
    category: "koszulki",
    color: {
      colorName: "black",
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
    name: "Koszulka JHK Niebieska" + uuidv4(),
    category: "koszulki",
    color: {
      colorName: "blue",
      colorHex: "#0000ff",
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
    name: "Koszulka JHK czerwona" + uuidv4(),
    category: "koszulki",
    color: {
      colorName: "red",
      colorHex: "#ff0000",
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

const clients_data: Partial<ClientType>[] = []

for (let i = 0; i < 20; i++) {
  clients_data.push({ username: faker.internet.userName() })
}

for (let i = 0; i < 20; i++) {
  let firstname = faker.name.firstName()
  let lastname = faker.name.lastName()
  let username = firstname.toLowerCase() + "." + lastname.toLowerCase()
  const fake_client: Partial<ClientType> = {
    username: username,
    firstname,
    lastname,
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber("!##-!##-####"),
    companyName: faker.company.companyName(),
    address: {
      streetName: faker.address.streetName(),
      streetNumber: faker.datatype.number(100).toString(),
      apartmentNumber: faker.datatype.number(100).toString(),
      city: faker.address.cityName(),
      postCode: faker.address.zipCode(),
      province: "pomorskie",
    },
    notes: faker.lorem.lines(faker.datatype.number(2)),
    secretNotes: faker.lorem.lines(faker.datatype.number(2)),
  }
  clients_data.push(fake_client)
}

const orders_data: Partial<OrderType>[] = []

for (let i = 0; i < 20; i++) {
  orders_data.push({ name: faker.company.companyName() })
}

for (let i = 0; i < 20; i++) {
  const fake_order: Partial<OrderType> = {
    name: faker.company.companyName(),
    client: { id: 10 },
    advance: faker.datatype.number(100),
    price: faker.datatype.number(100),
    isAdvancePaid: faker.datatype.boolean(),
    isPricePaid: faker.datatype.boolean(),
    dateOfCompletion: faker.date.future(),
    status: "planowane",
    files: [],
    products: [
      { count: 100, notes: "", size: "152", product: { id: 10 }, ready: false },
    ],
    address: {
      streetName: faker.address.streetName(),
      streetNumber: faker.datatype.number(100).toString(),
      apartmentNumber: faker.datatype.number(100).toString(),
      city: faker.address.cityName(),
      postCode: faker.address.zipCode(),
      province: "pomorskie",
    },
  }
  orders_data.push(fake_order)
}

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
