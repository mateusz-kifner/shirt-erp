import { Loader, Stack } from "@mantine/core"
import dynamic from "next/dynamic"

export default dynamic(() => import("./EditableDesignSSR"), {
  // Disable during server side rendering
  ssr: false,

  // Render anything as fallback on server, e.g. loader or html content without editor
  loading: () => (
    <Stack justify="center" align="center" style={{ height: 100 }}>
      <Loader />
    </Stack>
  ),
})
