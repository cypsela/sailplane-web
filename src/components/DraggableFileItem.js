import {Draggable} from 'react-beautiful-dnd';
import {getDraggableStyleHack} from '../utils/Utils';
import React from 'react';
import {FileItem} from './FileItem';

export function DraggableFileItem({
  data,
  sharedFs,
  setCurrentDirectory,
  ipfs,
  fileIndex,
  isParent,
  onIconClicked,
}) {
  return (
    <Draggable draggableId={data.path} index={fileIndex}>
      {({innerRef, draggableProps, dragHandleProps}, snapshot) => {
        return (
          <div
            ref={innerRef}
            {...draggableProps}
            {...dragHandleProps}
            style={getDraggableStyleHack(draggableProps.style, snapshot)}>
            <FileItem
              sharedFs={sharedFs}
              setCurrentDirectory={setCurrentDirectory}
              isParent={isParent}
              fileIndex={fileIndex}
              ipfs={ipfs}
              data={data}
              snapshot={snapshot}
              onIconClicked={onIconClicked}
            />
          </div>
        );
      }}
    </Draggable>
  );
}
