import React from 'react';

function HeaderLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <h1 className="text-2xl underline underline-offset-4">{title}</h1>;
      <div className="container mt-8">{children}</div>
    </>
  );
}

export default HeaderLayout;
