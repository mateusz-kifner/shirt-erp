import { useRouter } from "next/router"
import React, { useEffect } from "react"

const Main = () => {
  const router = useRouter()

  useEffect(() => {
    router.push("/erp/tasks")
  })

  return <div>Redirecting</div>
}

export default Main
