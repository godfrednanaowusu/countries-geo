"use client";

import React, { useState, useEffect } from "react";
import {
  Flex,
  TextField,
  Text,
  ScrollArea,
  Popover,
  Button,
  Badge,
} from "@radix-ui/themes";
import { ChevronsUpDown, Search } from "lucide-react";
import "./style.css";
import { IoMdClose } from "react-icons/io";

export default function ComboBox({
  type = "text",
  value,
  onValueChange,
  placeholder,
  items,
  noItemsText = "No",
  isMulti = false,
  width = "100%",
  ...rest
}: any) {
  const [getSearchText, setSearchText] = useState<any>("");
  const [open, setOpen] = useState(false);
  const [getSortedItems, setSortedItems] = useState([]);

  const [getValue, setValue] = useState<any>();

  useEffect(()=>{
    if (value) {
      if(isMulti && Array.isArray(value)){
        let new_value:any = []
        let flat_value = []
        let flat_old_value = []

        if (typeof value[0] === "string") {
          new_value = value?.map((item:any) => ({value:item, text:items?.some((itm:any)=>itm.identifier == item).name}))
          flat_value = new_value?.map((item:any)=>item?.hasOwnProperty('identifier')?item?.identifier:item?.hasOwnProperty('value')?item?.value:item) || []
          flat_old_value = value || []
          
        }else{
          new_value = value?.map((item:any) => ({value:item?.hasOwnProperty('identifier')?item?.identifier:item?.value, text:item?.hasOwnProperty('name')?item?.name:item?.label}))
          flat_value = new_value?.map((item:any)=>item?.hasOwnProperty('identifier')?item?.identifier:item?.hasOwnProperty('value')?item?.value:item)
          flat_old_value = value?.map((item:any)=>item?.hasOwnProperty('identifier')?item?.identifier:item?.hasOwnProperty('value')?item?.value:item) || []
          
        }
        setValue(new_value)
        
        // console.log('new_value: ', JSON.stringify(new_value))
        // console.log('value: ', JSON.stringify(value))
        // console.log('getValue: ', JSON.stringify(getValue))
        // console.log('flat old value: ', flat_old_value)

        // onValueChange(new_value?.map((item:any)=>item?.hasOwnProperty('identifier')?item?.identifier:item?.hasOwnProperty('value')?item?.value:item))
        const get_value = getValue?.map((item:any) => item?.hasOwnProperty('identifier')?item?.identifier:item?.hasOwnProperty('value')?item?.value:item) || []
        // console.log('flat new_get_value: ', JSON.stringify(get_value))
        const areEqual = JSON.stringify(flat_value) === JSON.stringify(get_value);
        // console.log('are equal: ', areEqual)
        // console.log('final flat value: ', JSON.stringify(flat_value))
        if(!areEqual){
          onValueChange(flat_value?.map((item:any)=>item?.hasOwnProperty('identifier')?item?.identifier:item?.hasOwnProperty('value')?item?.value:item))
        }
      
      }else{
        setValue(value)
      }
    }
  },[value])

  useEffect(() => {
    if(getValue){
      if(isMulti && Array.isArray(getValue)){
        let new_value:any = []
        let flat_value = []
        let flat_old_value = []

        if (typeof value[0] === "string") {
          new_value = getValue?.map((item:any) => item)
          flat_value = new_value?.map((item:any)=>item?.hasOwnProperty('identifier')?item?.identifier:item?.hasOwnProperty('value')?item?.value:item) || []
          flat_old_value = value || []
          // console.log('flat string value: ', flat_value)
          // console.log('flat string old_value: ', flat_old_value)
          
        }else{
          new_value = getValue?.map((item:any) => item?.hasOwnProperty('identifier')?item?.identifier:item?.value)
          flat_value = new_value?.map((item:any)=>item?.hasOwnProperty('identifier')?item?.identifier:item?.hasOwnProperty('value')?item?.value:item)
          flat_old_value = value?.map((item:any)=>item?.hasOwnProperty('identifier')?item?.identifier:item?.hasOwnProperty('value')?item?.value:item) || []
          // console.log('flat array value: ', flat_value)
          // console.log('flat array old_value: ', flat_old_value)
        }
        
        // flat_value = getValue?.map((item:any)=>item?.hasOwnProperty('identifier')?item?.identifier:item?.hasOwnProperty('value')?item?.value:item)
        // console.log('flat value: ', flat_value)
        // flat_old_value = value?.map((item:any)=>item.value) || []
        // console.log('new_value: ', JSON.stringify(new_value))
        // console.log('value: ', JSON.stringify(value))
        // console.log('getValue: ', JSON.stringify(getValue))
        // console.log('flat old value: ', flat_old_value)

        const areEqual = JSON.stringify(flat_value) === JSON.stringify(flat_old_value);
        // console.log('are equal: ', areEqual)
        // console.log('final flat value: ', JSON.stringify(flat_value))
        if(!areEqual){
          // onValueChange(flat_value?.map((item:any)=>item?.hasOwnProperty('identifier')?item?.identifier:item?.hasOwnProperty('value')?item?.value:item))
        }
        // onValueChange(new_value?.map((item)=>item.value));
        
        
      }


    }
  }, [getValue]);

  useEffect(() => {
    if (items && getSearchText) {
      setSortedItems(
        items?.filter((item: any) =>
          item.text.toLowerCase().includes(getSearchText.toLowerCase())
        )
      );
    } else {
      setSortedItems(items);
    }
  }, [items, getSearchText]);

  const handleSelectItem = (item: any) => {
    // console.log(JSON.stringify(item));
    if (!isMulti) {
      
      setValue(item?.value);
      onValueChange(item?.value)
      setOpen(false);
    } else {
      if (!getValue?.includes(item)) {
        setValue([...getValue || [], {value:item.value, text:item.label}]);
        onValueChange([...getValue || [], {value:item.value, text:item.label}]?.map(item => item.value))
      }
      setOpen(false);
    }
  };

  const handleRemoveItem = (val: any) => {
    setValue(getValue.filter((item: any) => item !== val));
  };

  return (
    <>
      {/* {JSON.stringify(getValue)} */}
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger>
          <Button
            variant={"outline"}
            style={{
              width: width,
              height: "auto",
              minHeight: 30,
              paddingTop: 5,
              paddingBottom: 5,
              justifyContent: "space-between",
            }}
            {...rest}
          >
            <Flex wrap={"wrap"} gap={"2"}>
              {!isMulti && (
                <Text
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "normal",
                    fontSize: "1px 20px",
                  }}
                >
                  {items?.find((item: any) => item.value === getValue)?.text ||
                    placeholder}
                </Text>
              )}
              {isMulti && (
                <>
                  {getValue?.length > 0 ? (
                    <>
                      {getValue?.map((val: any, ind: any) => (
                        <Badge key={ind} variant="soft" highContrast>
                          {/* {JSON.stringify(val)} -  */}
                          {/* {JSON.stringify(items)} */}
                          {items?.find((item: any) => item?.value === val?.value)?.text}
                          <IoMdClose
                            onClick={() => handleRemoveItem(val)}
                            style={{ marginLeft: 5, cursor: "pointer" }}
                          />
                        </Badge>
                      ))}
                    </>
                  ) : (
                    <Text
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                      }}
                    >
                      {placeholder}
                    </Text>
                  )}
                </>
              )}
            </Flex>
            <ChevronsUpDown size={"12"} />
          </Button>
        </Popover.Trigger>
        <Popover.Content
          maxWidth={"250px"}
          style={{ padding: 5, marginTop: 3 }}
        >
          <Flex direction="column" p="1" gap={"2"}>
            <TextField.Root
              placeholder="Search"
              value={getSearchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              // onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter') { e.preventDefault(); } }}
            >
              <TextField.Slot side="left">
                <Search size={16} />
              </TextField.Slot>
              <TextField.Slot side="right" pr={"1"}>
                <Button
                  size={"1"}
                  variant={"soft"}
                  color={"red"}
                  highContrast
                  onClick={() => {
                    setSearchText("");
                    setOpen(false);
                  }}
                >
                  <IoMdClose />
                </Button>
              </TextField.Slot>
            </TextField.Root>

            <ScrollArea
              type="auto"
              scrollbars="vertical"
              style={{ height: "200px" }}
            >
              <Flex
                align="center"
                gap="2"
                className={"widget_item"}
                p={"2"}
                onClick={() => {
                  setValue(isMulti ? [] : "");
                  setOpen(false);
                }}
              >
                <Text size={"2"} color={"gray"} style={{ userSelect: "none" }}>
                  {noItemsText}
                </Text>
              </Flex>
              {/* {items?.length} */}
              {getSortedItems?.map((item: any, ind: any) => (
                <Flex
                  align="center"
                  gap="2"
                  className={"widget_item"}
                  key={ind}
                  p={"2"}
                  onClick={() => handleSelectItem(item)}
                >
                  {item?.icon}
                  <Text
                    size={"2"}
                    color={"gray"}
                    style={{ userSelect: "none" }}
                  >
                    {item.text}
                  </Text>
                </Flex>
              ))}
            </ScrollArea>
          </Flex>
        </Popover.Content>
      </Popover.Root>
    </>
  );
}
