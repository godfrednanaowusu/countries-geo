// 'use client'
import {Card} from '@/components/ui/card'
// import { useEffect, useState } from 'react'



const GUI = () => {
    return (<></>)
}
export default GUI

export const GBox = (props: any) => {
    // const gBoxBorder = 'gray.100'
    return (
        <Card className="p-4" {...props}>
            {props.children}
        </Card>
    )
}

export const Row = ({columns='12', children, ...rest}: any) => {
    return (
    <div className="grid grid-cols-12" {...rest} >
      {children}
    </div>)
}

export const Col = ({ size='6', span='6', children, ...rest }:any) => {
  // Create a class to handle the responsive spans
  const getColumnClass = (span:any) => {
    const spans = {
      initial: span?.initial || size?.initial || 12,
      xs: span?.xs || size?.xs || span?.initial || size?.initial || 12,
      sm: span?.sm || size?.sm || span?.xs || size?.xs || span?.initial || size?.initial || 12,
      md: span?.md || size?.md || span?.sm || size?.sm || span?.xs || size?.xs || span?.initial || size?.initial || 12,
      lg: span?.lg || size?.lg || span?.md || size?.md || span?.sm || size?.sm || span?.xs || size?.xs || span?.initial || size?.initial || 12,
      xl: span?.xl || size?.xl || span?.lg || span?.lg || span?.md || size?.md || span?.sm || size?.sm || span?.xs || size?.xs || span?.initial || size?.initial || 12,
    };
    return spans;
  };

  const spanClass = getColumnClass(span || size);

  return (
    <div
      className={`col-span-${spanClass.initial} xs:col-span-${spanClass.xs} sm:col-span-${spanClass.sm} md:col-span-${spanClass.md} lg:col-span-${spanClass.lg} xl:col-span-${spanClass.xl}`}
      {...rest}
    >
      {children}
    </div>
  );
};
