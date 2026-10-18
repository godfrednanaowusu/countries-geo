"use client";

import { useEffect, useState } from "react";
import { ChevronsUpDown, Search } from "lucide-react";
import { IoMdClose } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// MIGRATED: Radix UI Themes imports removed
import "./style.css";

export default function ComboBox({
  type = "text",
  value,
  onValueChange,
  placeholder,
  items,
  noItemsText = "No",
  searchPlaceholder = "Search",
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
          
        } else {
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
      
      } else {
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

      // console.log('getValue: ', getValue)
      // console.log('Value: ', value)
      // let new_value:any = []

      //   if (typeof getValue[0] === "string") {
      //     new_value = getValue?.map((item:any) => ({value:item, text:items?.some((itm:any)=>itm.identifier == item).name}))
          
      //   }else{
      //     new_value = getValue?.map((item:any) => ({value:item?.hasOwnProperty('identifier')?item?.identifier:item?.value, text:item?.hasOwnProperty('name')?item?.name:item?.label}))
          
      //   }

      // const flat_value = getValue?.map((item:any)=>item?.hasOwnProperty('identifier')?item?.identifier:item?.hasOwnProperty('value')?item?.value:item)
      //   // console.log('flat value: ', flat_value)
      //   const flat_new_value = new_value?.map((item:any)=>item.value)
      //   console.log('flat new value: ', flat_new_value)

      //   const areEqual = JSON.stringify(flat_value) === JSON.stringify(flat_new_value);
      //   console.log('are equal: ', areEqual)
      //   if(!areEqual){
      //     // onValueChange(getValue?.map((item:any)=>item.value));
      //   }

      // // if ((isMulti && Array.isArray(getValue))){
      // //   console.log(JSON.stringify(getValue))
      // // onValueChange(getValue?.map((item:any) => item?.value))
      // // }else{
      // //   onValueChange(getValue);
      // // }
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
      onValueChange(item?.value);
      setOpen(false);
    } else {
      if (!getValue?.includes(item)) {
        setValue([...getValue || [], {value:item.value, text:item.label}]);
        onValueChange([...getValue || [], {value:item.value, text:item.label}]?.map(item => item.value));
      }
      setOpen(false);
    }
  };

  const handleRemoveItem = (val: any) => {
    const newValue = getValue.filter((item: any) => item !== val);
    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue?.map((item: any) => item.value));
    }
  };

  return (
    <>
      {/* {JSON.stringify(getValue)} */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button
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
            <div>
              {!isMulti && (
                <p
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
                </p>
              )}
              {isMulti && (
                <>
                  {getValue?.length > 0 ? (
                    <>
                      {getValue?.map((val: any, ind: any) => (
                        <Badge key={ind}  >
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
                    <p
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
                    </p>
                  )}
                </>
              )}
            </div>
            <ChevronsUpDown size={"12"} />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          style={{ padding: 5, marginTop: 3 }}
        >
          <div className="flex flex-col p-1 space-y-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={getSearchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                className="pl-9 pr-9"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => {
                  setSearchText("");
                  setOpen(false);
                }}
              >
                <IoMdClose size={16} />
              </Button>
            </div>

            <div className="max-h-[200px] overflow-y-auto space-y-1">
              <div 
                className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                onClick={() => {
                  const newValue = isMulti ? [] : "";
                  setValue(newValue);
                  if (onValueChange) {
                    onValueChange(newValue);
                  }
                  setOpen(false);
                }}
              >
                <p className="text-muted-foreground select-none">
                  {noItemsText}
                </p>
              </div>
              {getSortedItems?.map((item: any, ind: any) => (
                <div 
                  className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                  key={ind}
                  onClick={() => handleSelectItem(item)}
                >
                  {item?.icon}
                  <p className="text-foreground select-none">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}