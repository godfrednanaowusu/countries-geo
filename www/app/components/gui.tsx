// 'use client'
import {Card, Grid, Box} from '@radix-ui/themes'
// import { useEffect, useState } from 'react'



const GUI = () => {
    return (<></>)
}
export default GUI

export const GBox = (props: any) => {
    // const gBoxBorder = 'gray.100'
    return (
        <Card size={'4'} {...props}>
            {props.children}
        </Card>
    )
}

export const Row = ({columns='12', children, ...rest}: any) => {
    return (
    <Grid columns={columns}  {...rest} >
      {children}
    </Grid>)
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
      xl: span?.xl || size?.xl || span?.lg || size?.lg || span?.md || size?.md || span?.sm || size?.sm || span?.xs || size?.xs || span?.initial || size?.initial || 12,
    };
    return spans;
  };

  const spanClass = getColumnClass(span || size);

  return (
    <Box
      className={`col-span-${spanClass.initial} col-span-xs-${spanClass.xs} col-span-sm-${spanClass.sm} col-span-md-${spanClass.md} col-span-lg-${spanClass.lg} col-span-xl-${spanClass.xl}`}
      {...rest}
    >
      {children}
    </Box>
  );
};
