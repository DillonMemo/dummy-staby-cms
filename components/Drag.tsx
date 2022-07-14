import { Button } from 'antd'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import styled from 'styled-components'

export type ItemType = { id: string; content: string }
interface Props {
  items: ItemType[]
  onChange: (items: ItemType[]) => any
}

const Drag: React.FC<Props> = ({ items, onChange }) => {
  const onDeleteBtn = (index: number) => () => {
    const result = [...items.slice(0, index), ...items.slice(index + 1, items.length)]
    onChange(result)
  }
  return (
    <Droppable droppableId="droppable-1" type="CONTENT">
      {(provided, _) => (
        <Wrap {...provided.droppableProps} ref={provided.innerRef}>
          {items.map((item: ItemType, index: number) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided, snapshot) => (
                <Row
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  isDragging={snapshot.isDragging}
                  style={{
                    ...provided.draggableProps.style,
                  }}>
                  <div className="content">{item.content}</div>
                  <div>
                    <Button className="deleteBtn" onClick={onDeleteBtn(index)}>
                      &#10006;
                    </Button>
                  </div>
                </Row>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Wrap>
      )}
    </Droppable>
  )
}

const Wrap = styled.div`
  padding: 0;
`

const Row = styled.div<{ isDragging: boolean }>`
  user-select: none;
  padding: 0.5rem 1rem;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.text};

  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  background: ${({ isDragging, theme }) =>
    isDragging ? (theme.mode === 'light' ? '#00FF23' : '#283f7e') : theme.body};
  border-radius: 0.3rem;

  > .content {
    width: auto;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  button {
    transition: none;
    background: ${({ isDragging, theme }) =>
      isDragging ? (theme.mode === 'light' ? '#00FF23' : '#283f7e') : theme.body} !important;
  }
`

export default Drag
