import Header from '../components/header/Header';
import { CiSquarePlus } from 'react-icons/ci';
import React from 'react';

function HeaderLayout({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <>
      <Header title={title} />
      <div className="container mt-8">
        {children}
      </div>
    </>
  );
}

export default HeaderLayout;
