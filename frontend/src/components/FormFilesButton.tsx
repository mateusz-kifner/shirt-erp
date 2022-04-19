import React, { useRef } from "react"

const FormFilesButton = () => {
  const ref = useRef(null)
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()

        const request = new XMLHttpRequest()

        request.open("POST", "http://localhost:1337/api/upload")
        request.setRequestHeader(
          "Authorization",
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjUwMzgxMTI3LCJleHAiOjE2NTI5NzMxMjd9.-QAkkvIMZbmQKwvtMFNgSaomJFrTHn0CYqZJyFzhDwM"
        )

        ref.current && request.send(new FormData(ref.current))
      }}
      ref={ref}
    >
      <input type="file" name="files" />
      <input type="submit" value="Submit" />
    </form>
  )
}

export default FormFilesButton
