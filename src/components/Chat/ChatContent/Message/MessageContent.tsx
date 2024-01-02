import React, { useState } from 'react';
import useStore from '@store/store';

import ContentView from './View/ContentView';
import EditView from './View/EditView';

const MessageContent = ({
  role,
  content,
  messageIndex,
  sticky,
  isEdit,
  setIsEdit,
}: {
  role: string;
  content: string;
  messageIndex: number;
  sticky: boolean;
  isEdit: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className='relative flex flex-col gap-2 md:gap-3 lg:w-[calc(100%-5px)]'>
      <div className='flex flex-grow flex-col gap-3'></div>
      {isEdit ? (
        <EditView
          content={content}
          setIsEdit={setIsEdit}
          messageIndex={messageIndex}
          sticky={sticky}
          role={role}
        />
      ) : (
        <ContentView
          role={role}
          content={content}
          setIsEdit={setIsEdit}
          messageIndex={messageIndex}
        />
      )}
    </div>
  );
};

export default MessageContent;
