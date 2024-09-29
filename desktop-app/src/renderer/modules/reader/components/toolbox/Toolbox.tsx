import React, { useEffect } from 'react';

interface ToolboxProps {
  toc: any;
}

export default function Toolbox({ toc }: ToolboxProps) {
  useEffect(() => {
    console.log(toc);
  }, [toc]);

  return <div>Toolbox rendering...</div>;
}
