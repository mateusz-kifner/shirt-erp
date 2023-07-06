const productTemplate = {
  "id": { "type": "id" },

  "name": {
    "type": "title",
    "initialValue": "",
    "required": true
  },

  "category": {
    "label": "Kategoria",
    "type": "enum",
    "initialValue": "koszulka",
    "enum_data": [
      "koszulka",
      "bluza",
      "czapka",
      "torba / worek",
      "kamizelka",
      "kubek",
      "inne"
    ]
  },

  "description": {
    "label": "Opis",
    "type": "richtext",
    "initialValue": "",
    "maxLength": 4095
  },

  "iconId": {
    "label": "Ikona",
    "type": "iconId",
    "icons": [
      <img src="http://localhost:3000/assets/icons/product/tshirt.svg" alt="t-shirt" />,
      <img src="http://localhost:3000/assets/icons/product/sweatshirt.svg" alt="sweatshirt" />,
      <img src="http://localhost:3000/assets/icons/product/scarf.svg" alt="scarf" />,
      <img src="http://localhost:3000/assets/icons/product/mug.svg" alt="mug" />,
      <img src="http://localhost:3000/assets/icons/product/mitten.svg" alt="mitten" />,
      <img src="http://localhost:3000/assets/icons/product/cap.svg" alt="cap" />,
      <img src="http://localhost:3000/assets/icons/product/boot.svg" alt="boot" />,
      <img src="http://localhost:3000/assets/icons/product/bag2.svg" alt="bag" />,
    ]    
  },

  "previewImages": {
    "label": "Zdjęcia",
    "type": "files",
    "maxFileCount": 10
  },

  "colors": {
    "label": "Kolory",
    "type": "array",
    "arrayType": "color",
    "style": { "minWidth": 220 }
  },

  "sizes": {
    "label": "Rozmiary",
    "type": "array",
    "arrayType": "text",
    "style": { "minWidth": 220 }
  },

  "createdAt": {
    "label": "Utworzono",
    "type": "datetime",
    "disabled": true,
    "collapse": true
  },

  "updatedAt": {
    "label": "Edytowano",
    "type": "datetime",
    "disabled": true,
    "collapse": true
  }
}

export default productTemplate