import { InputWrapper } from "@mantine/core"
import { FC, useCallback, useRef, useState } from "react"
import ReactFlow, {
  addEdge,
  Connection,
  Controls,
  OnInit,
  ReactFlowInstance,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from "react-flow-renderer"
import GraphType from "../../types/GraphType"

let id = 0
const getId = () => `dndnode_${id++}`
interface EditableGraphProps {
  label?: string
  value?: GraphType
  initialValue?: GraphType
  onSubmit?: (value: GraphType | null) => void
  disabled?: boolean
  required?: boolean
  reference: string
}

const EditableGraph: FC<EditableGraphProps> = (props) => {
  const {
    label,
    value,
    initialValue,
    onSubmit,
    disabled,
    required,
    reference,
  } = props

  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  const [nodes, setNodes, onNodesChange] = useNodesState(
    value?.nodes ? value.nodes : initialValue?.nodes ? initialValue.nodes : []
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    value?.edges ? value.edges : initialValue?.edges ? initialValue.edges : []
  )
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<
    any,
    any
  > | null>(null)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  )
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      //@ts-ignore
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const type = event.dataTransfer.getData("application/reactflow")

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return
      }
      //@ts-ignore
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance]
  )

  return (
    <ReactFlowProvider>
      <InputWrapper
        label={label}
        required={required}
        style={{ height: 500, width: 400 }}
        ref={reactFlowWrapper}
        className="reactflow-wrapper"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Controls />
        </ReactFlow>
      </InputWrapper>
      <SiteBar />
    </ReactFlowProvider>
  )
}

const SiteBar = () => {
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <aside>
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div
        className="dndnode input"
        onDragStart={(event) => onDragStart(event, "input")}
        draggable
      >
        Input Node
      </div>
      <div
        className="dndnode"
        onDragStart={(event) => onDragStart(event, "default")}
        draggable
      >
        Default Node
      </div>
      <div
        className="dndnode output"
        onDragStart={(event) => onDragStart(event, "output")}
        draggable
      >
        Output Node
      </div>
    </aside>
  )
}

export default EditableGraph
