import { Group, Stack, Text, Table } from "@mantine/core"
import React from "react"

const ApiEntryDetails = () => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Element position</th>
          <th>Element name</th>
        </tr>
      </thead>
      <tbody>
        <tr key="test">
          <td>element.symbol</td>
          <td>element.mass</td>
        </tr>
        <tr key="test2">
          <td>element.symbol</td>
          <td>element.mass</td>
        </tr>
        <tr key="test2">
          <td>element.symbol</td>
          <td>element.mass</td>
        </tr>
      </tbody>
    </Table>
    // <Stack>
    //   <Group position="center">
    //     <Text>Name</Text>
    //     <Text>Blue Tshirt</Text>
    //   </Group>
    //   <Group position="center">
    //     <Text>Category</Text>
    //     <Text>Koszulka</Text>
    //   </Group>
    //   <Group position="center">
    //     <Text>Notes</Text>
    //     <Text>
    //       Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium,
    //       consequatur. Reiciendis porro magni unde animi voluptates esse iure
    //       sequi, ipsa ipsum, voluptatum repellat, dolor doloremque quisquam
    //       nemo. Quaerat, similique labore!
    //     </Text>
    //   </Group>
    // </Stack>
  )
}

export default ApiEntryDetails
