import React from 'react';

const FolderIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox='0 -960 960 960'
      fill='currentColor'
      height='1em'
      width='1em'
      {...props}
    >
      <path d="M140-160q-24 0-42-18.5T80-220v-520q0-23 18-41.5t42-18.5h281l60 60h339q23 0 41.5 18.5T880-680v460q0 23-18.5 41.5T820-160H140Zm0-60h680v-460H456l-60-60H140v520Zm0 0v-520 520Z"/>
    </svg>
  );
};

export default FolderIcon;
