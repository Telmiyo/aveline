import React from 'react';
import Header from '../../../components/layout/header/Header';

function HeaderLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header title={title} />
      <div className="container mt-8">{children}</div>
    </>
  );
}

export default HeaderLayout;
